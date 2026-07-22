import { APP_CONFIG, getElements } from './utils.js';

export function createStars() {
  const { starsContainer } = getElements();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const starCount = prefersReducedMotion
    ? APP_CONFIG.stars.reducedCount
    : window.innerWidth < APP_CONFIG.ui.mobileBreakpoint
      ? APP_CONFIG.stars.mobileCount
      : APP_CONFIG.stars.baseCount;

  starsContainer.innerHTML = '';

  if (prefersReducedMotion) {
    return;
  }

  for (let index = 0; index < starCount; index += 1) {
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.setProperty('--duration', `${APP_CONFIG.stars.minDuration + Math.random() * (APP_CONFIG.stars.maxDuration - APP_CONFIG.stars.minDuration)}s`);
    star.style.animationDelay = `${Math.random() * 3}s`;
    star.style.width = `${1 + Math.random() * 3}px`;
    star.style.height = star.style.width;
    starsContainer.appendChild(star);
  }
}
