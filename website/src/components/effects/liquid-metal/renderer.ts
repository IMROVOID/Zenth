import {
  ShaderPrograms,
  RenderTargets,
  MetalParams,
  RimParams,
  CompositeParams,
  DisturbanceParams,
} from './types';
import {
  DEFAULT_P,
  DEFAULT_E,
  DEFAULT_C,
  DEFAULT_R,
  P_KEYS,
  E_KEYS,
  GLOW_TEX,
} from './constants';
import {
  VERT,
  FRAG_SCENE,
  FRAG_RIM,
  FRAG_DOWN,
  FRAG_BLUR,
  FRAG_COMP,
} from './shaders';
import {
  createProgram,
  makeTarget,
  sizeTarget,
  deleteTarget,
} from './webglUtils';
import {
  runScenePass,
  runRimPass,
  runSoftenPass,
  runBloomPass,
  runCompPass,
} from './renderPasses';

export interface RenderFrameOptions {
  clock: number;
  hover: number;
  press: number;
  ripArr: Float32Array;
  ptrS: { x: number; y: number };
  ptrAmt: number;
  ptrSpeed: number;
}

export class LiquidMetalRenderer {
  private gl: WebGL2RenderingContext;
  private programs: ShaderPrograms;
  private targets: RenderTargets;
  private vao: WebGLVertexArrayObject;
  private vbo: WebGLBuffer;
  private hasFloat: boolean;
  private uArr = new Float32Array(P_KEYS.length);
  private eArr = new Float32Array(E_KEYS.length);

  public W = 0;
  public H = 0;
  public BW = 0;
  public BH = 0;
  public CX = 0;
  public CY = 0;
  public DOWN = 4;

  constructor(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      powerPreference: 'high-performance',
    });
    if (!gl) throw new Error('WebGL2 not supported');
    this.gl = gl;
    this.hasFloat = !!gl.getExtension('EXT_color_buffer_half_float');

    this.programs = {
      scene: null,
      rim: createProgram(gl, VERT, FRAG_RIM),
      down: createProgram(gl, VERT, FRAG_DOWN),
      blur: createProgram(gl, VERT, FRAG_BLUR),
      comp: createProgram(gl, VERT, FRAG_COMP),
    };

    this.vao = gl.createVertexArray()!;
    gl.bindVertexArray(this.vao);
    this.vbo = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    this.targets = {
      core: makeTarget(gl),
      rim: makeTarget(gl),
      s1: makeTarget(gl),
      s2: makeTarget(gl),
      a: makeTarget(gl),
      b: makeTarget(gl),
    };

    // Defer heavy scene shader compilation until well after page load and fade-in finishes
    if (typeof window !== 'undefined') {
      const idle = (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => void }).requestIdleCallback;
      setTimeout(() => {
        if (idle) idle(() => this.ensureScene(), { timeout: 3000 });
        else this.ensureScene();
      }, 2500);
    }
  }

  public ensureScene() {
    if (!this.programs.scene) {
      try {
        this.programs.scene = createProgram(this.gl, VERT, FRAG_SCENE);
      } catch {}
    }
  }

  public resize(width: number, height: number, dpr: number) {
    const gl = this.gl;
    this.W = Math.max(2, Math.round(width * dpr));
    this.H = Math.max(2, Math.round(height * dpr));
    this.BW = this.W;
    this.BH = this.H;
    this.CX = this.BW / 2;
    this.CY = this.H / 2;

    sizeTarget(gl, this.targets.core, this.W, this.H, this.hasFloat);
    sizeTarget(gl, this.targets.rim, this.W, this.H, this.hasFloat);
    const hw = Math.max(2, Math.ceil(this.W / 2));
    const hh = Math.max(2, Math.ceil(this.H / 2));
    sizeTarget(gl, this.targets.s1, hw, hh, this.hasFloat);
    sizeTarget(gl, this.targets.s2, hw, hh, this.hasFloat);

    this.DOWN = Math.max(1, Math.min(4, Math.round(this.BH / GLOW_TEX)));
    const dw = Math.max(2, Math.ceil(this.W / this.DOWN));
    const dh = Math.max(2, Math.ceil(this.H / this.DOWN));
    sizeTarget(gl, this.targets.a, dw, dh, this.hasFloat);
    sizeTarget(gl, this.targets.b, dw, dh, this.hasFloat);
  }

  public render(opts: RenderFrameOptions, P = DEFAULT_P, E = DEFAULT_E, C = DEFAULT_C, R = DEFAULT_R) {
    const { gl, programs, targets, W, H, BW, BH, CX, CY, DOWN } = this;
    const { clock, hover, press, ripArr, ptrS, ptrAmt, ptrSpeed } = opts;
    for (let i = 0; i < P_KEYS.length; i++) this.uArr[i] = P[P_KEYS[i]];
    for (let i = 0; i < E_KEYS.length; i++) this.eArr[i] = E[E_KEYS[i]];

    gl.bindVertexArray(this.vao);
    if (hover > 0.001) {
      this.ensureScene();
      if (programs.scene) {
        runScenePass(gl, programs.scene, targets.core, W, H, CX, CY, BW, BH, clock, hover, press, ripArr, R, ptrS, ptrAmt, ptrSpeed, this.uArr);
        runSoftenPass(gl, programs.down, programs.blur, targets.core, targets.s1, targets.s2, W, H, BH, C.soften);
      }
    } else {
      gl.bindFramebuffer(gl.FRAMEBUFFER, targets.core.fbo);
      gl.viewport(0, 0, targets.core.w, targets.core.h);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }

    runRimPass(gl, programs.rim, targets.rim, W, H, CX, CY, BW, BH, clock, press, ripArr, R, ptrS, ptrAmt, ptrSpeed, this.eArr);
    runBloomPass(gl, programs.down, programs.blur, targets.s1, targets.rim, targets.a, targets.b, W, H, BH, DOWN, C.glowR);
    runCompPass(gl, programs.comp, targets.s1, targets.rim, targets.a, W, H, CX, CY, BW, BH, clock, ripArr, R, C, P.dim);
  }

  public destroy() {
    const { gl, targets, programs, vao, vbo } = this;
    ['core', 'rim', 's1', 's2', 'a', 'b'].forEach((k) => deleteTarget(gl, targets[k as keyof RenderTargets]));
    if (programs.scene) gl.deleteProgram(programs.scene.p);
    ['rim', 'down', 'blur', 'comp'].forEach((k) => gl.deleteProgram(programs[k as keyof ShaderPrograms]!.p));
    gl.deleteBuffer(vbo);
    gl.deleteVertexArray(vao);
  }
}
