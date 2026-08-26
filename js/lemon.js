/**
 * Carita-limón interactiva.
 * Las pupilas giran hacia donde está el mouse (efecto "ojos que siguen"),
 * usando la matriz de transformación real del SVG para que el cálculo
 * sea correcto sin importar el tamaño en pantalla. Si no hay mouse
 * (touch / los primeros segundos), los ojos hacen un idle sutil.
 */
(function () {
  const face = document.getElementById("lemon-face");
  if (!face) return;

  const svg = face.querySelector("svg");
  const pupils = Array.from(face.querySelectorAll(".lemon-pupil"));
  const eyeCenters = pupils.map((p) => ({
    x: parseFloat(p.dataset.cx),
    y: parseFloat(p.dataset.cy),
  }));
  const pupilSize = pupils.length ? parseFloat(pupils[0].getAttribute("width")) : 9;

  const MAX_OFFSET = 6; // qué tanto se puede mover la pupila dentro del hexágono
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let target = { x: 0, y: 0 }; // desplazamiento deseado (en unidades del viewBox)
  let current = { x: 0, y: 0 }; // desplazamiento actual (se interpola hacia target)
  let hasPointer = false;
  let idleT = 0;

  function svgPoint(clientX, clientY) {
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const local = pt.matrixTransform(ctm.inverse());
    return { x: local.x, y: local.y };
  }

  function updateTargetFromPointer(clientX, clientY) {
    const p = svgPoint(clientX, clientY);
    // Promedio simple: usamos el punto medio entre ambos ojos como referencia
    const midX = (eyeCenters[0].x + eyeCenters[1].x) / 2;
    const midY = (eyeCenters[0].y + eyeCenters[1].y) / 2;
    const dx = p.x - midX;
    const dy = p.y - midY;
    const dist = Math.hypot(dx, dy) || 1;
    // Normaliza dirección y aplica el offset máximo, proporcional a la
    // distancia hasta un tope (así de cerca los ojos no se ven exagerados)
    const norm = Math.min(dist, 220) / 220;
    target.x = (dx / dist) * MAX_OFFSET * norm;
    target.y = (dy / dist) * MAX_OFFSET * norm;
    hasPointer = true;
  }

  window.addEventListener("mousemove", (e) => updateTargetFromPointer(e.clientX, e.clientY), { passive: true });
  window.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches && e.touches[0]) {
        updateTargetFromPointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    },
    { passive: true }
  );

  function applyPupils(x, y) {
    pupils.forEach((pupil, i) => {
      const cx = eyeCenters[i].x + x;
      const cy = eyeCenters[i].y + y;
      pupil.setAttribute("x", (cx - pupilSize / 2).toFixed(2));
      pupil.setAttribute("y", (cy - pupilSize / 2).toFixed(2));
    });
  }

  function tick(now) {
    if (!hasPointer && !reduceMotion) {
      // Idle: un vagabundeo lento en forma de "8" mientras no hay cursor cerca
      idleT = now / 1600;
      target.x = Math.sin(idleT) * MAX_OFFSET * 0.5;
      target.y = Math.sin(idleT * 2) * MAX_OFFSET * 0.3;
    }

    // Interpolación suave (lerp) hacia el target
    current.x += (target.x - current.x) * 0.12;
    current.y += (target.y - current.y) * 0.12;
    applyPupils(current.x, current.y);

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);

  // ── Parpadeo periódico, sutil y aleatorio ───────────────────────
  if (!reduceMotion) {
    const eyes = Array.from(face.querySelectorAll(".lemon-eye"));

    function blink() {
      eyes.forEach((eye) => eye.classList.add("is-blinking"));
      setTimeout(() => eyes.forEach((eye) => eye.classList.remove("is-blinking")), 140);
      const next = 2600 + Math.random() * 3200;
      setTimeout(blink, next);
    }

    setTimeout(blink, 1800);
  }
})();
