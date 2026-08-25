/**
 * Fondo interactivo con WebGL.
 * Un shader de ruido fractal (fBm) fluye muy lentamente por la pantalla,
 * generando un movimiento orgánico en tonos lima/verde que evoca frescura
 * sin distraer del contenido. Si el navegador no soporta WebGL o el
 * usuario prefiere menos movimiento, se cae a un fondo estático simple.
 */
(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const gl =
    canvas.getContext("webgl", { alpha: true, antialias: false }) ||
    canvas.getContext("experimental-webgl", { alpha: true, antialias: false });

  if (!gl) {
    // Fallback silencioso: sin WebGL, simplemente no se dibuja el shader.
    return;
  }

  // ── Shaders ──────────────────────────────────────────────────────
  const VERT_SRC = `
    attribute vec2 aPosition;
    void main() {
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `;

  const FRAG_SRC = `
    precision highp float;

    uniform vec2 uResolution;
    uniform float uTime;
    uniform vec2 uMouse;

    // Ruido con valor simple (hash-based)
    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    // Fractal Brownian Motion: solo 2 capas, bien suavizadas (menos detalle)
    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.6;
      for (int i = 0; i < 2; i++) {
        value += amplitude * noise(p);
        p *= 1.8;
        amplitude *= 0.5;
      }
      return value;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / uResolution.xy;
      vec2 p = uv;
      p.x *= uResolution.x / uResolution.y;

      // Movimiento MUY lento: el tiempo se escala hacia abajo
      float t = uTime * 0.03;

      // Parallax muy sutil del mouse
      vec2 mouseInfluence = (uMouse - 0.5) * 0.04;

      // Una sola capa de warping suave (menos capas = menos "definido")
      vec2 q = vec2(
        fbm(p * 0.9 + vec2(t * 0.5, t * 0.35) + mouseInfluence),
        fbm(p * 0.9 + vec2(t * 0.3 + 4.2, t * 0.4 + 1.3) + mouseInfluence)
      );

      float pattern = fbm(p * 0.9 + 1.6 * q);

      // Difumina el patrón para quitarle nitidez / textura
      pattern = smoothstep(0.1, 0.9, pattern);

      // ── Paleta: negro/verde muy oscuro -> lima, con transiciones amplias ──
      vec3 colVoid = vec3(0.020, 0.035, 0.032);
      vec3 colDeep = vec3(0.060, 0.095, 0.040);
      vec3 colLime = vec3(0.35, 0.42, 0.13);

      vec3 color = mix(colVoid, colDeep, smoothstep(0.2, 0.7, pattern));
      color = mix(color, colLime, smoothstep(0.75, 1.05, pattern) * 0.35);

      // Viñeta amplia y suave para que los bordes se apaguen
      float vig = smoothstep(1.2, 0.15, length(uv - 0.5));
      color *= mix(0.6, 1.0, vig);

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  function compileShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn("bg-canvas shader error:", gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vertexShader = compileShader(gl.VERTEX_SHADER, VERT_SRC);
  const fragmentShader = compileShader(gl.FRAGMENT_SHADER, FRAG_SRC);
  if (!vertexShader || !fragmentShader) return;

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn("bg-canvas program link error:", gl.getProgramInfoLog(program));
    return;
  }
  gl.useProgram(program);

  // ── Quad de pantalla completa ────────────────────────────────────
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW
  );

  const aPosition = gl.getAttribLocation(program, "aPosition");
  gl.enableVertexAttribArray(aPosition);
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

  const uResolution = gl.getUniformLocation(program, "uResolution");
  const uTime = gl.getUniformLocation(program, "uTime");
  const uMouse = gl.getUniformLocation(program, "uMouse");

  // ── Mouse / parallax ──────────────────────────────────────────────
  let mouse = { x: 0.5, y: 0.5 };
  const shell = canvas.closest(".page-shell") || document.body;
  shell.addEventListener("mousemove", (e) => {
    const rect = shell.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) / rect.width;
    mouse.y = 1.0 - (e.clientY - rect.top) / rect.height;
  });

  // ── Resize ──────────────────────────────────────────────────────
  let width, height, dpr;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  window.addEventListener("resize", resize);
  resize();

  // ── Loop de render ──────────────────────────────────────────────
  let rafId;
  let startTime = null;

  function render(now) {
    if (startTime === null) startTime = now;
    const elapsed = (now - startTime) / 1000;

    gl.uniform2f(uResolution, canvas.width, canvas.height);
    gl.uniform1f(uTime, elapsed);
    gl.uniform2f(uMouse, mouse.x, mouse.y);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    rafId = requestAnimationFrame(render);
  }

  rafId = requestAnimationFrame(render);

  // Pausar el render cuando la pestaña no está visible (ahorra batería/CPU)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      startTime = null;
      rafId = requestAnimationFrame(render);
    }
  });

  window.addEventListener("beforeunload", () => cancelAnimationFrame(rafId));
})();