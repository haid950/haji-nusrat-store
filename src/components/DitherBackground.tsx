import { useEffect, useRef } from 'react'

// Animated, ordered-dither "fjord" fog rendered with raw WebGL (no libraries).
// Drifting layered noise forms ridges and mist, then an 8×8 Bayer matrix turns it
// into a 1-bit dot pattern. Rendered at reduced resolution and paused off-screen.

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`

const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uCell;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
  return v;
}

// 8x8 Bayer threshold, computed without a lookup table
float bayer2(vec2 a) { a = floor(a); return fract(dot(a, vec2(0.5, a.y * 0.75))); }
float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }
float bayer8(vec2 a) { return bayer4(0.5 * a) * 0.25 + bayer2(a); }

void main() {
  vec2 cell = floor(gl_FragCoord.xy / uCell);
  vec2 uv = (cell * uCell) / uRes;
  vec2 q = vec2(uv.x * uRes.x / uRes.y, uv.y);
  float t = uTime * 0.035;

  // mountain ridges receding into the distance
  float ridge = 0.0;
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float h = 0.28 + fi * 0.12 + 0.16 * fbm(vec2(q.x * (1.2 + fi * 0.6) + fi * 3.1 + t * (0.4 + fi * 0.3), fi));
    ridge = max(ridge, smoothstep(h + 0.02, h - 0.12, uv.y) * (0.75 - fi * 0.2));
  }

  // drifting mist, nudged by the cursor
  vec2 m = (uMouse - 0.5) * 0.15;
  float mist = fbm(q * 2.2 + vec2(t * 1.6, -t * 0.6) + m);
  mist = smoothstep(0.35, 0.85, mist) * smoothstep(0.05, 0.55, uv.y) * 0.55;

  float v = max(ridge * 0.55, 0.0) + mist;
  // keep the left side (where the copy sits) calmer
  v *= mix(0.35, 1.0, smoothstep(0.15, 0.75, uv.x));
  // fade into the page at the bottom and top
  v *= smoothstep(0.0, 0.18, uv.y) * smoothstep(1.0, 0.7, uv.y);

  float on = step(bayer8(cell) + 0.001, v);
  vec3 bg = vec3(0.008, 0.016, 0.039);
  gl_FragColor = vec4(mix(bg, vec3(1.0), on * 0.55), 1.0);
}
`

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src)
  gl.compileShader(s)
  return s
}

export default function DitherBackground({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false })
    if (!gl) return

    const prog = gl.createProgram()!
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'uRes')
    const uTime = gl.getUniformLocation(prog, 'uTime')
    const uMouse = gl.getUniformLocation(prog, 'uMouse')
    const uCell = gl.getUniformLocation(prog, 'uCell')

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 }
    let visible = true
    let frame = 0
    const start = performance.now()

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const r = canvas.getBoundingClientRect()
      canvas.width = Math.max(1, Math.round(r.width * dpr))
      canvas.height = Math.max(1, Math.round(r.height * dpr))
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uCell, Math.round(3 * dpr))
    }

    const draw = () => {
      mouse.x += (mouse.tx - mouse.x) * 0.04
      mouse.y += (mouse.ty - mouse.y) * 0.04
      gl.uniform1f(uTime, reduced ? 12 : (performance.now() - start) / 1000)
      gl.uniform2f(uMouse, mouse.x, mouse.y)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    // ~30fps is plenty for slow drifting fog and halves the GPU work
    let last = 0
    const loop = (now: number) => {
      if (visible && now - last >= 32) {
        last = now
        draw()
      }
      frame = requestAnimationFrame(loop)
    }

    const onMove = (e: MouseEvent) => {
      mouse.tx = e.clientX / window.innerWidth
      mouse.ty = 1 - e.clientY / window.innerHeight
    }

    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting))
    io.observe(canvas)
    const ro = new ResizeObserver(() => {
      resize()
      if (reduced) draw()
    })
    ro.observe(canvas)

    resize()
    if (reduced) draw()
    else {
      window.addEventListener('mousemove', onMove)
      frame = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('mousemove', onMove)
      io.disconnect()
      ro.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none block h-full w-full ${className}`} />
}
