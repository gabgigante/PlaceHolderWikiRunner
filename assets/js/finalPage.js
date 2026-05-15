const params = new URLSearchParams(window.location.search);

const score = params.get('score');

const time = Number(params.get('time'));

const bestScore = localStorage.getItem('bestScore');

const minutes = String(Math.floor(time / 60)).padStart(2, '0');

const seconds = String(time % 60).padStart(2, '0');

document.querySelector('h1').textContent = `You won in ${score} jumps`;

document.querySelector('h2').textContent = `Time: ${minutes}:${seconds}`;

document.querySelector('h3').textContent = `Best score: ${bestScore}`;
