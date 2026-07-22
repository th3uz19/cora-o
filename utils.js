export const APP_CONFIG = {
  stars: {
    baseCount: 80,
    reducedCount: 30,
    mobileCount: 45,
    minDuration: 1.5,
    maxDuration: 4.5,
  },
  particles: {
    ambientCap: 50,
    explosionCount: 80,
    maxParticles: 200,
  },
  hearts: {
    maxCount: 50,
    initialBurstCount: 15,
    initialBurstStep: 100,
    spawnInterval: 400,
    symbols: ['❤️', '💕', '💖', '💗', '💓', '💘', '💝', '🩷', '✨'],
  },
  quiz: {
    correctValue: '100',
    wrongMessages: [
      'Deixe disso, mentirosa! 😤',
      'Tá de brincadeira né? 🤨',
      'Resposta errada, tenta de novo! 😏',
      'Aham, sei... Marca a certa! 💅',
      'Mentira! Eu sei que é mais! 😜',
      'Não acredito! Tenta outra vez 🙄',
      'Hmmm, acho que não hein... 👀',
      'Essa eu finjo que nem vi 🫣',
    ],
  },
  timings: {
    buttonExplosionDelay: 800,
    screenTransitionDelay: 1200,
    successTransitionDelay: 600,
    heartExplosionDelay: 400,
    feedbackResetDelay: 600,
  },
  ui: {
    mobileBreakpoint: 768,
    debounceDelay: 120,
  },
};

export function getElements() {
  return {
    body: document.body,
    particleCanvas: document.getElementById('particleCanvas'),
    starsContainer: document.getElementById('starsContainer'),
    mainContainer: document.getElementById('mainContainer'),
    screen1: document.getElementById('screen1'),
    screen2: document.getElementById('screen2'),
    screen3: document.getElementById('screen3'),
    magicButton: document.getElementById('magicButton'),
    confirmButton: document.getElementById('confirmButton'),
    quizOptions: document.getElementById('quizOptions'),
    quizFeedback: document.getElementById('quizFeedback'),
    backButton: document.getElementById('backButton'),
    heartWrapper: document.getElementById('heartWrapper'),
    floatingHearts: document.getElementById('floatingHearts'),
    quizOptionButtons: Array.from(document.querySelectorAll('.quiz-option')),
  };
}

export function getCenterPoint(element) {
  const rect = element.getBoundingClientRect();

  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

export function switchScreen(elements, screenId) {
  const screens = [elements.screen1, elements.screen2, elements.screen3];

  screens.forEach((screen) => {
    const isActive = screen.id === screenId;
    screen.classList.toggle('active', isActive);
  });
}

export function debounce(callback, delay = APP_CONFIG.ui.debounceDelay) {
  let timeoutId = null;

  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => callback(...args), delay);
  };
}

export function queueTimeout(state, callback, delay) {
  const timeoutId = window.setTimeout(() => {
    state.timers = state.timers.filter((id) => id !== timeoutId);
    callback();
  }, delay);

  state.timers.push(timeoutId);
  return timeoutId;
}

export function clearScheduledTimers(state) {
  state.timers.forEach((timeoutId) => window.clearTimeout(timeoutId));
  state.timers = [];
}
