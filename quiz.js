import { APP_CONFIG, getCenterPoint, switchScreen, getElements, queueTimeout, clearScheduledTimers } from './utils.js';

export function createQuizController({ particleSystem, heartsController }) {
  const elements = getElements();
  const state = {
    selectedValue: null,
    wrongMessageIndex: 0,
    timers: [],
  };

  function setFeedback(message) {
    elements.quizFeedback.textContent = message;
    elements.quizFeedback.classList.remove('visible');
    elements.quizOptions.classList.remove('shake');

    void elements.quizFeedback.offsetWidth;
    void elements.quizOptions.offsetWidth;

    elements.quizFeedback.classList.add('visible');
    elements.quizOptions.classList.add('shake');
  }

  function resetQuizUI() {
    state.selectedValue = null;
    state.wrongMessageIndex = 0;
    elements.confirmButton.disabled = true;
    elements.quizFeedback.textContent = '';
    elements.quizFeedback.classList.remove('visible');
    elements.quizOptions.classList.remove('shake');
    elements.quizOptionButtons.forEach((option) => option.classList.remove('selected'));
  }

  function handleOptionSelection(event) {
    const selectedOption = event.currentTarget;

    elements.quizOptionButtons.forEach((option) => option.classList.remove('selected'));
    selectedOption.classList.add('selected');
    state.selectedValue = selectedOption.dataset.value;
    elements.confirmButton.disabled = false;
    elements.quizFeedback.classList.remove('visible');
  }

  function handleConfirm() {
    if (state.selectedValue === null) {
      return;
    }

    if (state.selectedValue === APP_CONFIG.quiz.correctValue) {
      const { x, y } = getCenterPoint(elements.confirmButton);
      particleSystem.createExplosion(x, y);

      queueTimeout(state, () => {
        switchScreen(elements, 'screen3');
        elements.body.classList.add('revealed');
        heartsController.spawn();

        queueTimeout(state, () => {
          const { x: heartX, y: heartY } = getCenterPoint(elements.heartWrapper);
          particleSystem.createExplosion(heartX, heartY);
        }, APP_CONFIG.timings.heartExplosionDelay);
      }, APP_CONFIG.timings.successTransitionDelay);

      return;
    }

    const message = APP_CONFIG.quiz.wrongMessages[state.wrongMessageIndex % APP_CONFIG.quiz.wrongMessages.length];
    state.wrongMessageIndex += 1;
    setFeedback(message);

    queueTimeout(state, () => {
      elements.quizOptions.classList.remove('shake');
    }, APP_CONFIG.timings.feedbackResetDelay);
  }

  function bindEvents() {
    elements.quizOptionButtons.forEach((option) => {
      option.addEventListener('click', handleOptionSelection);
    });

    elements.confirmButton.addEventListener('click', handleConfirm);
  }

  function destroy() {
    clearScheduledTimers(state);
    elements.quizOptionButtons.forEach((option) => {
      option.replaceWith(option.cloneNode(true));
    });
  }

  return {
    bindEvents,
    resetQuizUI,
    destroy,
  };
}
