const navigation = performance.getEntriesByType('navigation')[0];

if (navigation && navigation.type === 'reload') {
  window.location.href = '../wikirun.html';
}

// URL params
const params = new URLSearchParams(window.location.search);

const score = params.get('score');
const time = Number(params.get('time'));

// BEST SCORE
const bestScore = localStorage.getItem('bestScore');

// BEST TIME
const savedBestTime = localStorage.getItem('bestTime');
const bestTime = savedBestTime !== null ? Number(savedBestTime) : 0;

// CURRENT TIME
const minutes = String(Math.floor(time / 60)).padStart(2, '0');
const seconds = String(time % 60).padStart(2, '0');

// BEST TIME FORMAT
const bestMinutes = String(Math.floor(bestTime / 60)).padStart(2, '0');
const bestSeconds = String(bestTime % 60).padStart(2, '0');

// TEXT
document.querySelector('h1').textContent = `You won in ${score} jumps`;

document.querySelector('h2').textContent = `Time: ${minutes}:${seconds}`;

document.querySelector('h3').textContent = `Best score: ${bestScore}`;

document.querySelector('h4').textContent =
  `Best time: ${bestMinutes}:${bestSeconds}`;

// PATH HISTORY
const rawPath = params.get('path');

const pathContainer = document.querySelector('.path-history');

if (rawPath) {
  const pathHistory = JSON.parse(decodeURIComponent(rawPath));

  pathContainer.innerHTML = pathHistory.join(' → ');
} else {
  pathContainer.textContent = 'No path history found';
}

// ACHIEVEMENTS
const savedAchievements =
  JSON.parse(localStorage.getItem('achievements')) || [];

const achievementContainer = document.querySelector('.achievements');

savedAchievements.forEach((achievement) => {
  const p = document.createElement('p');

  p.textContent = achievement;

  achievementContainer.appendChild(p);

  showAchievement(achievement);
});

// POPUP
function showAchievement(text) {
  const div = document.createElement('div');

  div.classList.add('achievement-popup');

  div.textContent = `UNLOCKED: ${text}`;

  document.body.appendChild(div);

  setTimeout(() => {
    div.remove();
  }, 3000);
}
