// ============================================
// TWINKLING STARS BACKGROUND
// ============================================

function createStars() {
  const container = document.getElementById('starsContainer');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const starCount = prefersReducedMotion ? 30 : (window.innerWidth < 768 ? 45 : 80);

  if (prefersReducedMotion) {
    container.innerHTML = '';
    return;
  }

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.setProperty('--duration', (1.5 + Math.random() * 3) + 's');
    star.style.animationDelay = Math.random() * 3 + 's';
    star.style.width = (1 + Math.random() * 3) + 'px';
    star.style.height = star.style.width;
    container.appendChild(star);
  }
}


// ============================================
// PARTICLE CANVAS — Soft sparkles
// ============================================

const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationActive = false;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor(x, y, isExplosion = false) {
    this.x = x || Math.random() * canvas.width;
    this.y = y || Math.random() * canvas.height;
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
    ctx.save();
    ctx.globalAlpha = this.life * this.opacity;
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function addAmbientParticles() {
  if (particles.length < 50) {
    particles.push(new Particle());
  }
}

function createExplosion(x, y) {
  for (let i = 0; i < 80; i++) {
    particles.push(new Particle(x, y, true));
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles = particles.filter(p => p.life > 0);

  for (const p of particles) {
    p.update();
    p.draw();
  }

  if (animationActive) {
    addAmbientParticles();
  }

  requestAnimationFrame(animateParticles);
}


// ============================================
// FLOATING HEARTS (after reveal)
// ============================================

let floatingHeartsInterval = null;
let floatingHeartsTimeouts = [];

function clearFloatingHearts() {
  if (floatingHeartsInterval) {
    clearInterval(floatingHeartsInterval);
    floatingHeartsInterval = null;
  }

  floatingHeartsTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
  floatingHeartsTimeouts = [];

  const container = document.getElementById('floatingHearts');
  if (container) {
    container.innerHTML = '';
  }
}

function spawnFloatingHearts() {
  clearFloatingHearts();

  const container = document.getElementById('floatingHearts');
  const hearts = ['❤️', '💕', '💖', '💗', '💓', '💘', '💝', '🩷', '✨'];
  let count = 0;
  const maxHearts = 50;

  function addHeart() {
    if (count >= maxHearts) return;

    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.setProperty('--size', (1 + Math.random() * 2) + 'rem');
    heart.style.setProperty('--duration', (3 + Math.random() * 5) + 's');
    heart.style.setProperty('--delay', '0s');
    heart.style.setProperty('--drift', (Math.random() * 100 - 50) + 'px');
    heart.style.setProperty('--rotation', (Math.random() * 360) + 'deg');

    container.appendChild(heart);
    count++;

    // Remove after animation completes
    const duration = parseFloat(heart.style.getPropertyValue('--duration')) * 1000;
    const timeoutId = setTimeout(() => {
      heart.remove();
      count--;
    }, duration);

    floatingHeartsTimeouts.push(timeoutId);
  }

  // Initial burst
  for (let i = 0; i < 15; i++) {
    const timeoutId = setTimeout(addHeart, i * 100);
    floatingHeartsTimeouts.push(timeoutId);
  }

  // Continuous hearts
  floatingHeartsInterval = setInterval(() => {
    addHeart();
  }, 400);
}


// ============================================
// MAIN INTERACTION — Button click + Quiz
// ============================================

const wrongMessages = [
  'Deixe disso, mentirosa! 😤',
  'Tá de brincadeira né? 🤨',
  'Resposta errada, tenta de novo! 😏',
  'Aham, sei... Marca a certa! 💅',
  'Mentira! Eu sei que é mais! 😜',
  'Não acredito! Tenta outra vez 🙄',
  'Hmmm, acho que não hein... 👀',
  'Essa eu finjo que nem vi 🫣',
];

let wrongMessageIndex = 0;

function initApp() {
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  createStars();

  animationActive = true;
  animateParticles();

  const magicButton = document.getElementById('magicButton');
  const screen1 = document.getElementById('screen1');
  const screen2 = document.getElementById('screen2');
  const screen3 = document.getElementById('screen3');

  // ---- Screen 1 → Screen 2 (Quiz) ----
  magicButton.addEventListener('click', function () {
    const rect = magicButton.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    magicButton.classList.add('transforming');

    setTimeout(() => {
      createExplosion(centerX, centerY);
    }, 800);

    setTimeout(() => {
      screen1.classList.remove('active');
      screen2.classList.add('active');
    }, 1200);
  });

  // ---- Quiz Logic ----
  const quizOptions = document.querySelectorAll('.quiz-option');
  const confirmButton = document.getElementById('confirmButton');
  const quizFeedback = document.getElementById('quizFeedback');
  const quizOptionsContainer = document.getElementById('quizOptions');
  let selectedValue = null;

  quizOptions.forEach(option => {
    option.addEventListener('click', function () {
      // Remove selected from all
      quizOptions.forEach(o => o.classList.remove('selected'));
      // Select this one
      this.classList.add('selected');
      selectedValue = this.dataset.value;
      // Enable confirm button
      confirmButton.disabled = false;
      // Clear feedback
      quizFeedback.classList.remove('visible');
    });
  });

  confirmButton.addEventListener('click', function () {
    if (selectedValue === null) return;

    if (selectedValue === '100') {
      // CORRECT! Go to heart screen
      const rect = confirmButton.getBoundingClientRect();
      createExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2);

      setTimeout(() => {
        screen2.classList.remove('active');
        screen3.classList.add('active');
        document.body.classList.add('revealed');

        spawnFloatingHearts();

        setTimeout(() => {
          const heartWrapper = document.getElementById('heartWrapper');
          const heartRect = heartWrapper.getBoundingClientRect();
          createExplosion(heartRect.left + heartRect.width / 2, heartRect.top + heartRect.height / 2);
        }, 400);
      }, 600);
    } else {
      // WRONG — show sassy message + shake
      quizFeedback.textContent = wrongMessages[wrongMessageIndex % wrongMessages.length];
      wrongMessageIndex++;

      // Reset animation by removing and re-adding class
      quizFeedback.classList.remove('visible');
      quizOptionsContainer.classList.remove('shake');

      // Force reflow to restart animation
      void quizFeedback.offsetWidth;
      void quizOptionsContainer.offsetWidth;

      quizFeedback.classList.add('visible');
      quizOptionsContainer.classList.add('shake');

      // Remove shake class after animation
      setTimeout(() => {
        quizOptionsContainer.classList.remove('shake');
      }, 600);
    }
  });

  // ---- Back button → Reset to Screen 1 ----
  const backButton = document.getElementById('backButton');
  backButton.addEventListener('click', function () {
    // Hide screen3, show screen1
    screen3.classList.remove('active');
    screen1.classList.add('active');
    document.body.classList.remove('revealed');

    // Reset button animation
    magicButton.classList.remove('transforming');

    // Reset quiz state
    selectedValue = null;
    confirmButton.disabled = true;
    quizFeedback.textContent = '';
    quizFeedback.classList.remove('visible');
    quizOptions.forEach(o => o.classList.remove('selected'));
    wrongMessageIndex = 0;

    // Clear floating hearts
    clearFloatingHearts();
  });
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
