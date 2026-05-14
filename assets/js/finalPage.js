const params = new URLSearchParams(window.location.search);

const score = params.get('score');

document.querySelector('h1').textContent = `You won in ${score} jumps`;
