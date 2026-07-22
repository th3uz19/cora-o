import { APP_CONFIG } from './utils.js';

export class Particle {
  constructor(x, y, isExplosion = false, canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.x = x ?? Math.random() * canvas.width;
    this.y = y ?? Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.opacity = Math.random() * 0.5 + 0.3;

    if (isExplosion) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.life = 1;
      this.decay = 0.01 + Math.random() * 0.02;
      this.size = Math.random() * 4 + 2;
      this.color = ['#ff4d8d', '#ff2d6b', '#e91e84', '#ffb3d1', '#ffd700'][Math.floor(Math.random() * 5)];
    } else {
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.life = 1;
      this.decay = 0.002 + Math.random() * 0.003;
      this.color = '#ffb3d1';
    }
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;

    if (this.vx > 0.1 || this.vx < -0.1) {
      this.vx *= 0.98;
    }
    if (this.vy > 0.1 || this.vy < -0.1) {
      this.vy *= 0.98;
    }
  }

  draw() {
    this.ctx.save();
    this.ctx.globalAlpha = this.life * this.opacity;
    this.ctx.fillStyle = this.color;
    this.ctx.shadowColor = this.color;
    this.ctx.shadowBlur = 8;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }
}

export function createParticleSystem(canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationActive = false;
  let frameId = null;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function addAmbientParticles() {
    if (particles.length < APP_CONFIG.particles.ambientCap) {
      particles.push(new Particle(null, null, false, canvas, ctx));
    }
  }

  function createExplosion(x, y) {
    for (let index = 0; index < APP_CONFIG.particles.explosionCount; index += 1) {
      particles.push(new Particle(x, y, true, canvas, ctx));
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter((particle) => particle.life > 0);

    for (const particle of particles) {
      particle.update();
      particle.draw();
    }

    if (animationActive) {
      addAmbientParticles();
    }

    frameId = window.requestAnimationFrame(animate);
  }

  function start() {
    resizeCanvas();
    animationActive = true;
    if (frameId === null) {
      frameId = window.requestAnimationFrame(animate);
    }
  }

  function stop() {
    animationActive = false;
    if (frameId !== null) {
      window.cancelAnimationFrame(frameId);
      frameId = null;
    }
  }

  function reset() {
    particles = [];
  }

  return {
    resizeCanvas,
    createExplosion,
    start,
    stop,
    reset,
  };
}
