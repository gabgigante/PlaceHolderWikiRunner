const params = new URLSearchParams(window.location.search);

const score = params.get('score');

const time = Number(params.get('time'));

// BEST SCORE
const bestScore = localStorage.getItem('bestScore');

// BEST TIME
const savedBestTime = localStorage.getItem('bestTime');

const bestTime = savedBestTime !== null ? Number(savedBestTime) : 0;

// tempo run corrente
const minutes = String(Math.floor(time / 60)).padStart(2, '0');

const seconds = String(time % 60).padStart(2, '0');

// tempo record
const bestMinutes = String(Math.floor(bestTime / 60)).padStart(2, '0');

const bestSeconds = String(bestTime % 60).padStart(2, '0');

document.querySelector('h1').textContent = `You won in ${score} jumps`;

document.querySelector('h2').textContent = `Time: ${minutes}:${seconds}`;

document.querySelector('h3').textContent = `Best score: ${bestScore}`;

document.querySelector('h4').textContent =
  `Best time: ${bestMinutes}:${bestSeconds}`;
