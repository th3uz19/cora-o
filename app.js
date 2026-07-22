import { APP_CONFIG, debounce, getCenterPoint, getElements, switchScreen } from './utils.js';
import { createStars } from './stars.js';
import { createParticleSystem } from './particles.js';
import { createQuizController } from './quiz.js';
import { createHeartsController } from './hearts.js';

function initApp() {
  const elements = getElements();
  const particleSystem = createParticleSystem(elements.particleCanvas);
  const heartsController = createHeartsController();
  const quizController = createQuizController({ particleSystem, heartsController });

  const state = {
    timers: [],
  };

  function resetApp() {
    elements.body.classList.remove('revealed');
    elements.magicButton.classList.remove('transforming');
    switchScreen(elements, 'screen1');
    heartsController.clear();
    quizController.resetQuizUI();
    particleSystem.reset();
  }

  function handleMagicButtonClick() {
    const { x, y } = getCenterPoint(elements.magicButton);

    elements.magicButton.classList.add('transforming');

    window.setTimeout(() => {
      particleSystem.createExplosion(x, y);
    }, APP_CONFIG.timings.buttonExplosionDelay);

    window.setTimeout(() => {
      switchScreen(elements, 'screen2');
    }, APP_CONFIG.timings.screenTransitionDelay);
  }

  function handleResize() {
    particleSystem.resizeCanvas();
    createStars();
  }

  function bindEvents() {
    elements.magicButton.addEventListener('click', handleMagicButtonClick);
    elements.backButton.addEventListener('click', resetApp);
    quizController.bindEvents();
    window.addEventListener('resize', debounce(handleResize));
  }

  function start() {
    bindEvents();
    createStars();
    particleSystem.start();
  }

  start();
}

document.addEventListener('DOMContentLoaded', initApp);
