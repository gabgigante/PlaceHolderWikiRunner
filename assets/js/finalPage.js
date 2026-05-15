if (localStorage.getItem('refreshing') === 'true') {
  localStorage.removeItem('refreshing');

  window.location.href = './wikirun.html';
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

document.querySelector('h1').textContent = `You won in ${score} jumps`;

document.querySelector('h2').textContent = `Time: ${minutes}:${seconds}`;

document.querySelector('h3').textContent = `Best score: ${bestScore}`;

document.querySelector('h4').textContent =
  `Best time: ${bestMinutes}:${bestSeconds}`;

const rawPath = params.get('path');

const pathContainer = document.querySelector('.path-history');

if (rawPath) {
  const pathHistory = JSON.parse(decodeURIComponent(rawPath));

  pathContainer.innerHTML = pathHistory.join(' → ');
} else {
  pathContainer.textContent = 'No path history found';
}

window.addEventListener('beforeunload', () => {
  localStorage.setItem('refreshing', 'true');
});
