/**
 * Confetti celebration trigger for Wedding opening and RSVP
 */

window.launchConfetti = function (options = {}) {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '99999';
  canvas.style.pointerEvents = 'none';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const count = options.count || 80;
  const colors = options.colors || ['#d4af37', '#fceda2', '#ffffff', '#e5c158', '#ffd700', '#f43f5e'];
  const pieces = [];

  for (let i = 0; i < count; i++) {
    pieces.push({
      x: options.originX !== undefined ? options.originX : canvas.width / 2,
      y: options.originY !== undefined ? options.originY : canvas.height / 2,
      w: Math.random() * 8 + 6,
      h: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 18,
      rotation: Math.random() * 360,
      vRotation: (Math.random() - 0.5) * 15,
      gravity: 0.35,
      drag: 0.96,
      opacity: 1
    });
  }

  let startTime = Date.now();
  const duration = options.duration || 3200;

  function render() {
    const elapsed = Date.now() - startTime;
    if (elapsed > duration) {
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < pieces.length; i++) {
      const p = pieces[i];
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.vRotation;
      p.opacity = Math.max(0, 1 - elapsed / duration);

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
};
