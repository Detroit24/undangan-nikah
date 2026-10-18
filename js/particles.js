/**
 * Falling Golden Dust & Romantic Petals Particle System
 */

(function () {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const maxParticles = Math.min(45, Math.floor(window.innerWidth / 25));

  class SparkleParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -10;
      this.size = Math.random() * 2.5 + 1;
      this.speedY = Math.random() * 0.8 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.fadeSpeed = Math.random() * 0.008 + 0.004;
      this.fadeDir = 1;
      this.isPetal = Math.random() > 0.65; // mix of golden sparkles and soft petals
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 1.5;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.01) * 0.4;
      this.rotation += this.rotationSpeed;

      // Opacity oscillation
      this.opacity += this.fadeDir * this.fadeSpeed;
      if (this.opacity > 0.8) {
        this.opacity = 0.8;
        this.fadeDir = -1;
      } else if (this.opacity < 0.15) {
        this.opacity = 0.15;
        this.fadeDir = 1;
      }

      if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);

      if (this.isPetal) {
        // Soft romantic rose/cream petal
        ctx.fillStyle = `rgba(243, 229, 171, ${this.opacity * 0.85})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 2, this.size * 1.2, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Glowing gold star dust
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#d4af37';
        ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  for (let i = 0; i < maxParticles; i++) {
    particles.push(new SparkleParticle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(animate);
  }

  animate();
})();
