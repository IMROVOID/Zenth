'use client';

import { useEffect, type RefObject } from 'react';
import { VS_SOURCE, FS_SOURCE } from './shaders';

function createShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  return shader;
}

export function useBacklightRenderer(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  isTop: boolean
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });
    if (!gl) return;

    const vs = createShader(gl, gl.VERTEX_SHADER, VS_SOURCE);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FS_SOURCE);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;

    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(prog, 'a_pos');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uIsTop = gl.getUniformLocation(prog, 'u_is_top');

    let animId: number;
    let isVisible = true;
    const start = performance.now();

    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = Math.max(1, w);
        canvas.height = Math.max(1, h);
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    io.observe(canvas);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const render = (now: number) => {
      if (isVisible) {
        resize();
        gl.useProgram(prog);
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, (now - start) * 0.001);
        gl.uniform1f(uIsTop, isTop ? 1.0 : 0.0);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      io.disconnect();
      ro.disconnect();
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, [canvasRef, isTop]);
}
