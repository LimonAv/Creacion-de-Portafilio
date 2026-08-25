/**
 * Limón 3D dibujado a mano en <canvas>.
 * Simula un giro sobre el eje Y y un ligero flotado, con parallax
 * respecto a la posición del mouse dentro del hero.
 */
(function () {
  const canvas = document.getElementById("lemon-canvas");
  if (!canvas) return;

  const stage = canvas.closest(".lemon-stage");
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let mouse = { x: 0.5, y: 0.5 };
  let rafId;

  function applyTilt() {
    const tiltX = (mouse.y - 0.5) * -8;
    const tiltY = (mouse.x - 0.5) * 8;
    canvas.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  }

  const heroSection = document.querySelector(".hero");
  if (heroSection) {
    heroSection.addEventListener("mousemove", (e) => {
      const r = heroSection.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) / r.width;
      mouse.y = (e.clientY - r.top) / r.height;
      applyTilt();
    });
  }

  function draw(now) {
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const t = now / 1000;
    const spinAngle = reduceMotion ? Math.PI * 0.25 : (t * Math.PI * 2) / 9;
    const floatY = reduceMotion ? 0 : Math.sin((t * Math.PI * 2) / 4.2) * 11;

    const cx = W / 2;
    const cy = H / 2 + floatY;

    const cosA = Math.cos(spinAngle);
    const isFront = cosA >= 0;
    const squish = Math.abs(cosA);

    const baseRX = W * 0.38;
    const baseRY = H * 0.4;
    const rx = Math.max(baseRX * squish, 2);
    const ry = baseRY;

    // Sombra / brillo de suelo
    const shadowGrd = ctx.createRadialGradient(cx, cy + ry + 18, 4, cx, cy + ry + 18, rx * 1.6);
    shadowGrd.addColorStop(0, "rgba(130, 190, 10, 0.13)");
    shadowGrd.addColorStop(0.5, "rgba(80, 130, 5, 0.06)");
    shadowGrd.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = shadowGrd;
    ctx.beginPath();
    ctx.ellipse(cx, cy + ry + 14, rx * 1.5, ry * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cuerpo principal
    const hx = cx - rx * 0.38 * cosA;
    const hy = cy - ry * 0.3;
    const bodyGrd = ctx.createRadialGradient(hx, hy, 0, cx, cy, Math.max(rx, ry) * 1.35);

    if (isFront) {
      bodyGrd.addColorStop(0.0, "#f5f07c");
      bodyGrd.addColorStop(0.14, "#ece428");
      bodyGrd.addColorStop(0.34, "#d8cc00");
      bodyGrd.addColorStop(0.58, "#b4a800");
      bodyGrd.addColorStop(0.78, "#8a8200");
      bodyGrd.addColorStop(0.94, "#5c5800");
      bodyGrd.addColorStop(1.0, "#403c00");
    } else {
      bodyGrd.addColorStop(0.0, "#c8be18");
      bodyGrd.addColorStop(0.25, "#a49800");
      bodyGrd.addColorStop(0.55, "#807600");
      bodyGrd.addColorStop(0.8, "#545000");
      bodyGrd.addColorStop(1.0, "#302e00");
    }

    ctx.fillStyle = bodyGrd;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();

    // Textura tipo poro, muy sutil
    if (squish > 0.15) {
      const seed = [
        [0.22, 0.28], [-0.3, 0.1], [0.15, -0.35], [-0.18, -0.2],
        [0.38, -0.1], [-0.1, 0.4], [0.05, 0.15], [-0.35, 0.3],
        [0.28, 0.42], [-0.22, -0.42], [0.4, 0.28], [-0.05, -0.12],
      ];
      ctx.save();
      ctx.globalAlpha = 0.09 * squish;
      seed.forEach(([px, py]) => {
        const bx = cx + px * rx;
        const by = cy + py * ry;
        const br = rx * 0.045;
        const bg = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        bg.addColorStop(0, "rgba(0,0,0,0.6)");
        bg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }

    // Brillo especular principal
    if (squish > 0.08) {
      const sx = cx - rx * 0.32 * cosA;
      const sy = cy - ry * 0.33;
      const sr = rx * 0.28 * squish;
      const specGrd = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
      specGrd.addColorStop(0, "rgba(255,255,255,0.55)");
      specGrd.addColorStop(0.42, "rgba(255,255,240,0.18)");
      specGrd.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = specGrd;
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(sx, sy, sr, sr * 0.68, -0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      const gx = cx + rx * 0.22 * cosA;
      const gy = cy + ry * 0.24;
      ctx.fillStyle = "rgba(255,255,200,0.13)";
      ctx.beginPath();
      ctx.ellipse(gx, gy, rx * 0.11 * squish, ry * 0.08, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Oscurecimiento de borde (aprox. Fresnel)
    const rimGrd = ctx.createRadialGradient(cx, cy, Math.min(rx, ry) * 0.55, cx, cy, Math.max(rx, ry) * 1.05);
    rimGrd.addColorStop(0, "rgba(0,0,0,0)");
    rimGrd.addColorStop(0.78, "rgba(0,0,0,0)");
    rimGrd.addColorStop(1, "rgba(0,0,0,0.38)");
    ctx.fillStyle = rimGrd;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();

    // Puntas del limón
    if (squish > 0.05) {
      const nlx = cx - rx - 5;
      const nly = cy;
      const nlGrd = ctx.createRadialGradient(nlx + 3, nly - 2, 0, nlx, nly, 12);
      nlGrd.addColorStop(0, isFront ? "#ccc028" : "#8a8800");
      nlGrd.addColorStop(1, "#3a3800");
      ctx.fillStyle = nlGrd;
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.ellipse(nlx, nly, Math.max(10 * squish, 2), 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      const nrx = cx + rx + 5;
      const nry = cy;
      const nrGrd = ctx.createRadialGradient(nrx - 3, nry - 2, 0, nrx, nry, 12);
      nrGrd.addColorStop(0, isFront ? "#a8a010" : "#606000");
      nrGrd.addColorStop(1, "#282600");
      ctx.fillStyle = nrGrd;
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.ellipse(nrx, nry, Math.max(10 * squish, 2), 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    rafId = requestAnimationFrame(draw);
  }

  applyTilt();
  rafId = requestAnimationFrame(draw);

  window.addEventListener("beforeunload", () => cancelAnimationFrame(rafId));
})();
