"use client";

import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

// Fragment: 2D simplex noise (Ashima/IQ) + fbm flow field, mixed across
// a prismatic palette (void / cyan / violet / amber) with a vignette and
// mouse-reactive warp. Designed to feel post-2030s — generative, alive.
const FRAG = `
precision highp float;

uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_scroll;

vec3 mod289_3(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289_2(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289_3(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289_2(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                       + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                          dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x  = 2.0 * fract(p * C.www) - 1.0;
  vec3 h  = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * snoise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

// Smooth palette across a single t in [0,1].
// Anchors: void (#03030a), cyan (#67e8f9), violet (#c084fc), amber (#fbbf24).
vec3 prismaticPalette(float t) {
  vec3 c0 = vec3(0.012, 0.012, 0.039); // void
  vec3 c1 = vec3(0.404, 0.910, 0.976); // cyan
  vec3 c2 = vec3(0.753, 0.518, 0.988); // violet
  vec3 c3 = vec3(0.984, 0.749, 0.141); // amber
  vec3 col;
  if (t < 0.33) {
    col = mix(c0, c1, smoothstep(0.0, 0.33, t));
  } else if (t < 0.66) {
    col = mix(c1, c2, smoothstep(0.33, 0.66, t));
  } else {
    col = mix(c2, c3, smoothstep(0.66, 1.0, t));
  }
  return col;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;

  // Mouse warp + scroll-driven tunneling.
  vec2 m = (u_mouse - 0.5 * u_res) / u_res.y;
  float warp = 0.6 / (1.0 + length(uv - m) * 4.0);
  uv += (uv - m) * warp * 0.18;
  uv *= 1.0 + u_scroll * 0.35;

  float t = u_time * 0.06;
  vec2 q = vec2(fbm(uv + t), fbm(uv - t + 5.2));
  vec2 r = vec2(fbm(uv + 1.7 * q + vec2(1.7, 9.2) + 0.13 * t),
                fbm(uv + 1.7 * q + vec2(8.3, 2.8) + 0.09 * t));
  float n = fbm(uv + 1.6 * r);

  // Map [-0.7, 0.9] noise into the palette; favor the void at the edges.
  float pal = clamp((n + 0.7) / 1.6, 0.0, 1.0);
  vec3 col = prismaticPalette(pal);

  // Boost the cyan/violet "veins" where fbm is sharply changing.
  float veins = smoothstep(0.45, 0.55, length(r));
  col += veins * vec3(0.10, 0.18, 0.30);

  // Vignette — pulls everything back toward the void at the edges.
  float v = smoothstep(1.25, 0.35, length(uv));
  col *= mix(0.18, 1.0, v);

  // Soft grain.
  float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)))
                      * 43758.5453 + u_time);
  col += (grain - 0.5) * 0.018;

  // Final lift so darks don't crush.
  col = pow(col, vec3(0.92));

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn("supreme shader compile error:", gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export default function ShaderField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fallbackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      (canvas.getContext("webgl", {
        antialias: false,
        alpha: false,
        premultipliedAlpha: false,
      }) as WebGLRenderingContext | null) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (!gl) {
      // Fallback handled in CSS — show the gradient div instead.
      if (fallbackRef.current) fallbackRef.current.style.opacity = "1";
      return;
    }

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) {
      if (fallbackRef.current) fallbackRef.current.style.opacity = "1";
      return;
    }
    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn("supreme program link:", gl.getProgramInfoLog(prog));
      if (fallbackRef.current) fallbackRef.current.style.opacity = "1";
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uScroll = gl.getUniformLocation(prog, "u_scroll");

    const state = {
      mouse: [window.innerWidth / 2, window.innerHeight / 2],
      target: [window.innerWidth / 2, window.innerHeight / 2],
      scroll: 0,
      targetScroll: 0,
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: PointerEvent) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      state.target[0] = e.clientX * dpr;
      // WebGL Y is flipped relative to DOM Y.
      state.target[1] = (window.innerHeight - e.clientY) * dpr;
    };
    window.addEventListener("pointermove", onMove);

    const onScroll = () => {
      const max = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );
      state.targetScroll = Math.min(window.scrollY / max, 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const start = performance.now();
    let raf = 0;
    const loop = () => {
      const t = (performance.now() - start) / 1000;
      // Smooth toward the targets so the warp feels weighty.
      state.mouse[0] += (state.target[0] - state.mouse[0]) * 0.07;
      state.mouse[1] += (state.target[1] - state.mouse[1]) * 0.07;
      state.scroll += (state.targetScroll - state.scroll) * 0.06;

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, reduceMotion ? 0 : t);
      gl.uniform2f(uMouse, state.mouse[0], state.mouse[1]);
      gl.uniform1f(uScroll, state.scroll);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      />
      <div
        ref={fallbackRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-0 transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(60% 80% at 30% 20%, rgba(103,232,249,0.18), transparent 60%), radial-gradient(50% 60% at 80% 70%, rgba(192,132,252,0.18), transparent 60%), radial-gradient(40% 50% at 60% 50%, rgba(251,191,36,0.10), transparent 60%), #03030a",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(3,3,10,0.0) 0%, rgba(3,3,10,0.4) 60%, rgba(3,3,10,0.85) 100%)",
        }}
      />
    </>
  );
}
