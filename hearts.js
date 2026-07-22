import { APP_CONFIG, getElements, queueTimeout, clearScheduledTimers } from './utils.js';

export function createHeartsController() {
  const elements = getElements();
  const state = {
    timers: [],
    intervalId: null,
    count: 0,
  };

  function clear() {
    if (state.intervalId !== null) {
      window.clearInterval(state.intervalId);
      state.intervalId = null;
    }

    clearScheduledTimers(state);
    elements.floatingHearts.innerHTML = '';
    state.count = 0;
  }

  function spawn() {
    clear();

    const hearts = APP_CONFIG.hearts.symbols;

    function addHeart() {
      if (state.count >= APP_CONFIG.hearts.maxCount) {
        return;
      }

      const heart = document.createElement('div');
      heart.classList.add('floating-heart');
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.setProperty('--size', `${1 + Math.random() * 2}rem`);
      heart.style.setProperty('--duration', `${3 + Math.random() * 5}s`);
      heart.style.setProperty('--delay', '0s');
      heart.style.setProperty('--drift', `${Math.random() * 100 - 50}px`);
      heart.style.setProperty('--rotation', `${Math.random() * 360}deg`);

      elements.floatingHearts.appendChild(heart);
      state.count += 1;

      const duration = parseFloat(heart.style.getPropertyValue('--duration')) * 1000;
      queueTimeout(state, () => {
        heart.remove();
        state.count -= 1;
      }, duration);
    }

    for (let index = 0; index < APP_CONFIG.hearts.initialBurstCount; index += 1) {
      queueTimeout(state, addHeart, index * APP_CONFIG.hearts.initialBurstStep);
    }

    state.intervalId = window.setInterval(addHeart, APP_CONFIG.hearts.spawnInterval);
  }

  return {
    spawn,
    clear,
  };
}
