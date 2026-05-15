const navigationType = performance.getEntriesByType('navigation')[0].type;

if (navigationType === 'reload') {
  window.location.href = '../wikirun.html';
}

const params = new URLSearchParams(window.location.search);

const score = params.get('score');

const time = Number(params.get('time'));

const bestScore = localStorage.getItem('bestScore');

const savedBestTime = localStorage.getItem('bestTime');

const bestTime = savedBestTime !== null ? Number(savedBestTime) : 0;

const minutes = String(Math.floor(time / 60)).padStart(2, '0');

const seconds = String(time % 60).padStart(2, '0');

const bestMinutes = String(Math.floor(bestTime / 60)).padStart(2, '0');

const bestSeconds = String(bestTime % 60).padStart(2, '0');

document.getElementById('nr-of-jumps').textContent = `You won in ${score} jumps`;

document.getElementById('time').textContent = `Time: ${minutes}:${seconds}`;

document.getElementById('best-score').textContent = `Best score: ${bestScore}`;

document.getElementById('best-time').textContent =
  `Best time: ${bestMinutes}:${bestSeconds}`;

const rawPath = params.get('path');

const pathContainer = document.querySelector('.path-history');

if (rawPath) {
  const pathHistory = JSON.parse(decodeURIComponent(rawPath));

  pathContainer.innerHTML = pathHistory.join(' → ');
} else {
  pathContainer.textContent = 'No path history found';
}

const savedAchievements =
  JSON.parse(localStorage.getItem('achievements')) || [];

const achievementContainer = document.querySelector('.achievements');

savedAchievements.forEach((achievement) => {
  const p = document.createElement('p');

  p.textContent = achievement;

  achievementContainer.appendChild(p);
});

function showAchievement(text) {
  const div = document.createElement('div');

  div.classList.add('achievement-popup');

  div.textContent = `UNLOCKED: ${text}`;

  document.body.appendChild(div);

  setTimeout(() => {
    div.remove();
  }, 3000);
}
