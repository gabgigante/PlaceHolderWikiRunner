// web
let audioCtx = null;

function initAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
}

function playTone(freq, duration, type = "square", volume = 0.06, detune = 0) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.detune.value = detune;
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioCtx.currentTime + duration,
  );
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function playKeyType() {
  // Per-character key click (mechanical)
  playTone(900 + Math.random() * 200, 0.015, "square", 0.018);
  // Noise burst for click texture
  if (!audioCtx) return;
  const bufferSize = audioCtx.sampleRate * 0.008;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] =
      (Math.random() * 2 - 1) * 0.12 * Math.exp(-i / (bufferSize * 0.05));
  }
  const src = audioCtx.createBufferSource();
  src.buffer = buffer;
  const gain = audioCtx.createGain();
  gain.gain.value = 0.04;
  src.connect(gain);
  gain.connect(audioCtx.destination);
  src.start();
}

function playReturnSound() {
  // CRLF mechanical clunk
  playTone(600, 0.04, "sawtooth", 0.035);
  playTone(120, 0.08, "square", 0.02, -30);
}

function playBootChirp() {
  playTone(440, 0.12, "sine", 0.05);
  setTimeout(() => playTone(660, 0.12, "sine", 0.05), 100);
  setTimeout(() => playTone(880, 0.2, "sine", 0.06), 200);
}

function playErrorSound() {
  playTone(220, 0.3, "sawtooth", 0.07);
  setTimeout(() => playTone(180, 0.3, "sawtooth", 0.07), 150);
}

function playDataSound() {
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      playTone(2000 + Math.random() * 4000, 0.02, "sine", 0.015);
    }, i * 40);
  }
}

function playEmergencySound() {
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      playTone(i % 2 === 0 ? 800 : 400, 0.18, "square", 0.06);
    }, i * 200);
  }
}

// start of game logic
document.addEventListener("click", initAudio, { once: true });
// const button = document.getElementById("open");
const result = document.getElementById("display-result");
const counterDisplay = document.getElementById("jumps");
const seconds = document.getElementById("seconds");
const minutes = document.getElementById("minutes");
const jumpText = document.getElementById("jump-text");

let count = 0;
let currentTitle = "";
let clickCount = 0;
let pathHistory = [];

// it's the counter of click(jump) that the player does
function updateCounter() {
  if (counterDisplay) counterDisplay.textContent = clickCount;
  // display the number of click
  if (jumpText) {
    jumpText.textContent =
      clickCount <= 1 ? "NUMBER OF JUMP " : "NUMBER OF JUMPS ";
  }
}
//
async function isRedirectPage(title) {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&redirects&format=json&origin=*`,
    );

    const data = await response.json();

    return (
      data.query && data.query.redirects && data.query.redirects.length > 0
    );
  } catch (error) {
    console.error(error);
    return false;
  }
}

// the game's logic
async function loadWikipediaPage(title, fromLink = false) {
  try {
    if (fromLink && title.toLowerCase() !== currentTitle.toLowerCase()) {
      clickCount++;
      updateCounter();
    }

    currentTitle = title;

    // check if you win
    if (title.toLowerCase() === 'michael jackson') {
      clearInterval(intervalId);
      const encodedPath = encodeURIComponent(JSON.stringify(pathHistory));
      // BEST SCORE
      const savedBest = localStorage.getItem('bestScore');

      const bestScore = savedBest !== null ? Number(savedBest) : Infinity;

      if (clickCount < bestScore) {
        localStorage.setItem('bestScore', String(clickCount));
      }

      // BEST TIME
      const savedBestTime = localStorage.getItem('bestTime');

      const bestTime =
        savedBestTime !== null ? Number(savedBestTime) : Infinity;

      if (count < bestTime) {
        localStorage.setItem('bestTime', String(count));
      }

      playReturnSound();

      setTimeout(() => {
        window.location.href = `finalPage.html?score=${clickCount}&time=${count}&path=${encodedPath}`;
      }, 300);

      return;
    }

    const redirectTrap = await isRedirectPage(title);

    if (redirectTrap) {
      console.log("Skipping redirect:", title);
      return;
    }
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(title)}&prop=text&format=json&origin=*`,
    );

    const data = await response.json();

    if (!data.parse || !data.parse.text) {
      throw new Error("Pagina non trovata");
    }

    const html = data.parse.text["*"];

    result.innerHTML = `
      <h1>${title}</h1>
      ${html}
    `;

    result.querySelectorAll("a").forEach((link) => {
      const href = link.getAttribute("href");

      if (!href) {
        disableLink(link);
        return;
      }

      const wikiMatch = href.match(/^\/wiki\/([^#:]+)$/);

      if (!wikiMatch) {
        disableLink(link);
        return;
      }

      const articleName = decodeURIComponent(wikiMatch[1]);

      const finalTitle = articleName.replace(/_/g, " ");

      link.addEventListener("click", (e) => {
        e.preventDefault();
        playKeyType();
        console.log("Click su:", finalTitle);

        loadWikipediaPage(finalTitle, true);
      });
    });
    playDataSound();
  } catch (error) {
    console.error(error);

    result.innerHTML = "Error loading Wikipedia article: " + title;
  }
  pathHistory.push(title);
}
// disable the external link
function disableLink(link) {
  link.removeAttribute("href");
  link.style.cursor = "default";
  link.style.pointerEvents = "none";
}

// pick a random page from wikipedia
async function getWikiAPI() {
  try {
    clickCount = 0;
    updateCounter();

    const randomResponse = await fetch(
      "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=random&grnnamespace=0&grnlimit=1",
    );

    const randomData = await randomResponse.json();

    if (!randomData.query || !randomData.query.pages) {
      throw new Error("Nessuna pagina casuale trovata");
    }

    const pages = Object.values(randomData.query.pages);

    const page = pages[0];

    if (!page || !page.title) {
      throw new Error("Titolo non valido");
    }
    // if the random page is mj
    if (page.title.toLowerCase() === "michael jackson") {
      console.log("Trovato MJ all'inizio, riprovo...");
      getWikiAPI();
      return;
    }

    //if don't have load a wikipedia page
    loadWikipediaPage(page.title);
    playBootChirp();
  } catch (error) {
    console.error(error);
    playErrorSound();
    result.innerHTML = "Error fetching random article";
  }
}

/*if (button && result) {
  button.addEventListener("click", () => {
    console.log("Nuovo articolo casuale...");
    getWikiAPI();
  });
} else {
  console.error("Elementi HTML non trovati!");
}*/

document.addEventListener("DOMContentLoaded", () => {
  getWikiAPI();
});
// create the timer
const intervalId = setInterval(() => {
  count++;

  seconds.textContent = String(count % 60).padStart(2, "0");
  minutes.textContent = String(Math.floor(count / 60) % 60).padStart(2, "0");

  if (count >= 3600) {
    playEmergencySound();
    clearInterval(intervalId);
  }
}, 1000);
// for block the crt f or cmd f
window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
    e.preventDefault();
    e.stopPropagation();
    window.alert('eh volevi');
    return false;
  }
});
// random number for the ranking of crew
const scores = document.querySelectorAll('.score');

scores.forEach((score) => {
  const randomJumps = Math.floor(Math.random() * 10) + 2;

  score.textContent = `${randomJumps} jumps`;
});
const encodedPath = encodeURIComponent(JSON.stringify(pathHistory));
