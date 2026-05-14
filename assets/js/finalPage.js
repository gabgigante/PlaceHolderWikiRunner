const params = new URLSearchParams(window.location.search);

const score = params.get('score');

const bestScore = localStorage.getItem('bestScore');

document.querySelector('h1').textContent = `You won in ${score} jumps`;

document.querySelector('h2').textContent = `Best score: ${bestScore}`;
