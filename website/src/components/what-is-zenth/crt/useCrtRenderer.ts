'use client';

import { useEffect, type RefObject } from 'react';
import { CRT_VERTEX_SHADER, CRT_FRAGMENT_SHADER } from './shaders';

function createShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  return shader;
}

export function useCrtRenderer(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  videoRef: RefObject<HTMLVideoElement | null>
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      premultipliedAlpha: false,
    });
    if (!gl) return;

    const vs = createShader(gl, gl.VERTEX_SHADER, CRT_VERTEX_SHADER);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, CRT_FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;

    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(prog, 'aPos');
    const uTex = gl.getUniformLocation(prog, 'uTex');
    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uMotion = gl.getUniformLocation(prog, 'uMotion');

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    let animId: number;
    let isVisible = true;
    const startTime = performance.now();

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && video.paused) {
        video.play().catch(() => {});
      }
    });
    io.observe(canvas);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const render = (now: number) => {
      if (isVisible) {
        gl.useProgram(prog);

        if (video.readyState >= 2) {
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

        gl.uniform1i(uTex, 0);
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, (now - startTime) * 0.001);
        gl.uniform1f(uMotion, 1.0);

        gl.drawArrays(gl.TRIANGLES, 0, 3);
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
      gl.deleteTexture(texture);
    };
  }, [canvasRef, videoRef]);
}
