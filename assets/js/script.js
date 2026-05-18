// Javascript file that handles game logic and everything related to the playing page
let audioCtx = null;

function initAudio() {
  if (audioCtx) return;

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playTone(freq, duration, type = 'square', volume = 0.06, detune = 0) {
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
  playTone(900 + Math.random() * 200, 0.015, 'square', 0.018);

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
  playTone(600, 0.04, 'sawtooth', 0.035);

  playTone(120, 0.08, 'square', 0.02, -30);
}

function playBootChirp() {
  playTone(440, 0.12, 'sine', 0.05);

  setTimeout(() => {
    playTone(660, 0.12, 'sine', 0.05);
  }, 100);

  setTimeout(() => {
    playTone(880, 0.2, 'sine', 0.06);
  }, 200);
}

function playErrorSound() {
  playTone(220, 0.3, 'sawtooth', 0.07);

  setTimeout(() => {
    playTone(180, 0.3, 'sawtooth', 0.07);
  }, 150);
}

function playDataSound() {
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      playTone(2000 + Math.random() * 4000, 0.02, 'sine', 0.015);
    }, i * 40);
  }
}

function playEmergencySound() {
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      playTone(i % 2 === 0 ? 800 : 400, 0.18, 'square', 0.06);
    }, i * 200);
  }
}

document.addEventListener('click', initAudio, {
  once: true,
});

const result = document.getElementById('display-result');

const counterDisplay = document.getElementById('jumps');

const seconds = document.getElementById('seconds');

const minutes = document.getElementById('minutes');

const jumpText = document.getElementById('jump-text');

const achievements = [];

let count = 0;

let currentTitle = '';

let clickCount = 0;

let pathHistory = [];

function updateCounter() {
  if (counterDisplay) {
    counterDisplay.textContent = clickCount;
  }

  if (jumpText) {
    jumpText.textContent =
      clickCount <= 1 ? 'NUMBER OF JUMP ' : 'NUMBER OF JUMPS ';
  }
}

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

async function loadWikipediaPage(title, fromLink = false) {
  try {
    const previousTitle = currentTitle;

    currentTitle = title;
    const headerTitle = document.getElementById('title');

    const redirectTrap = await isRedirectPage(title);

    if (redirectTrap) {
      currentTitle = previousTitle;

      return;
    }
    pathHistory.push(title);
    if (fromLink && title.toLowerCase() !== previousTitle.toLowerCase()) {
      clickCount++;

      updateCounter();
    }
    // WIN CONDITION
    if (title.toLowerCase() === 'michael jackson') {
      clearInterval(intervalId);

      if (clickCount <= 10) {
        achievements.push(
          '🏆 Moonwalker → you have jumped to michael jackson in 10 or less jumps',
        );
      }

      if (count <= 120) {
        achievements.push(
          '⚡ Smooth Criminal → you reached michael jackson in less then 120 seconds',
        );
      }

      if (clickCount <= 5) {
        achievements.push(
          '👑 King of Pop → you have jumped only 5 times or less',
        );
      }
      if (clickCount === 100) {
        achievements.push("gue → that's a secret : ^ ) ");
      }
      if (pathHistory.includes('Billie Jean')) {
        achievements.push(
          "🕺 He's not his kid → you jumped through Billie Jean during your navigation",
        );
      }

      if (pathHistory.includes('Thriller')) {
        achievements.push(
          '🎬 Not directed by Spielberg → you jumped through Thriller during your navigation',
        );
      }

      if (pathHistory.includes('United States')) {
        achievements.push(
          '🦅 Normie → you jumped through United States during your navigation',
        );
      }

      if (pathHistory.includes('Adolf Hitler')) {
        achievements.push(
          '💀 Might be he → jumped through Adolf Hitler during your navigation',
        );
      }
      if (clickCount === 67) {
        achievements.push('6-7');
      }
      if (pathHistory.includes('Sonic the Hedgehog 3 ')) {
        achievements.push(
          'he didnt create the soundtrack → you passed by Sonic 3',
        );
      }
      if (pathHistory.includes("Michael Jackson's Moonwalker")) {
        achievements.push(
          "the greatest classic of'90 → you passed by Michael Jackson's Moonwalker",
        );
      }
      localStorage.setItem('achievements', JSON.stringify(achievements));

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

    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(title)}&prop=text&format=json&origin=*`,
    );

    const data = await response.json();

    if (!data.parse || !data.parse.text) {
      throw new Error('Pagina non trovata');
    }

    const html = data.parse.text['*'];

    result.innerHTML = `
  <h1>${title}</h1>
  ${html}
`;

    headerTitle.textContent = `${title.toUpperCase()}`;

    result.querySelectorAll('*').forEach((el) => {
      el.style.removeProperty('background');
      el.style.removeProperty('background-color');
      //el.style.removeProperty("background-image");
      el.style.removeProperty('color');
    });
    window.scrollTo(0, 0);

    result.querySelectorAll('a').forEach((link) => {
      const href = link.getAttribute('href');

      if (!href) {
        disableLink(link);

        return;
      }

      const wikiMatch = href.match(/^\/wiki\/([^#:]+)$/);

      if (!wikiMatch) {
        disableLink(link);

        return;
      }

      let articleName;

      try {
        articleName = decodeURIComponent(wikiMatch[1]);
      } catch (e) {
        articleName = wikiMatch[1];
      }

      const finalTitle = articleName.replace(/_/g, ' ');

      link.addEventListener('click', (e) => {
        e.preventDefault();

        playKeyType();

        loadWikipediaPage(finalTitle, true);
      });
    });
    if (window.innerWidth < 768) {
      result.querySelectorAll("table:not(.infobox)").forEach((table) => {
        if (table.closest(".infobox")) return;
        const wrapper = document.createElement("div");
        wrapper.classList.add("table-wrapper");
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      });
    }
    playDataSound();
  } catch (error) {
    console.error(error);

    result.innerHTML = 'Error loading Wikipedia article: ' + title;
  }
}

function disableLink(link) {
  link.removeAttribute('href');

  link.style.cursor = 'default';

  link.style.pointerEvents = 'none';
}

async function getWikiAPI() {
  try {
    clickCount = 0;

    updateCounter();

    const randomResponse = await fetch(
      'https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=random&grnnamespace=0&grnlimit=1',
    );

    const randomData = await randomResponse.json();

    if (!randomData.query || !randomData.query.pages) {
      throw new Error('Nessuna pagina casuale trovata');
    }

    const pages = Object.values(randomData.query.pages);

    const page = pages[0];

    if (!page || !page.title) {
      throw new Error('Titolo non valido');
    }

    if (page.title.toLowerCase() === 'michael jackson') {
      getWikiAPI();

      return;
    }

    loadWikipediaPage(page.title);

    playBootChirp();
  } catch (error) {
    console.error(error);

    playErrorSound();

    result.innerHTML = 'Error fetching random article';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  getWikiAPI();

  const scores = document.querySelectorAll('.score');

  scores.forEach((score) => {
    const randomJumps = Math.floor(Math.random() * 10) + 2;

    score.textContent = `${randomJumps} jumps`;
  });
});

const intervalId = setInterval(() => {
  count++;

  seconds.textContent = String(count % 60).padStart(2, '0');

  minutes.textContent = String(Math.floor(count / 60) % 60).padStart(2, '0');

  if (count >= 3600) {
    playEmergencySound();

    clearInterval(intervalId);
  }
}, 1000);

window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
    e.preventDefault();
    e.stopPropagation();

    initAudio();
    playEmergencySound();
    if (document.querySelector(".ctrl-f-overlay")) return; // guard

    const overlay = document.createElement("div");
    overlay.classList.add("ctrl-f-overlay");
    overlay.style.cssText = `
      position: fixed; inset: 0;
      background: rgba(0, 0, 0, 0.75);
      display: flex; align-items: center; justify-content: center;
      z-index: 99999;
    `;

    const modal = document.createElement('div');
    modal.style.cssText = `
      background-color: #0a0a0f;
      color: #c9fbff;
      font-family: 'VT323', monospace;
      font-size: 1.4rem;
      padding: 2rem;
      border: 5px solid #ff00ff;
      outline: 3.5px solid grey;
      text-align: center;
      text-transform: uppercase;
      box-shadow: 0 0 20px #ff00ff, 0 0 40px rgba(255, 0, 255, 0.3);
    `;

    modal.innerHTML = `
      <p style="color: #ff00ff; margin: 0 0 1rem; font-size: 1.8rem;">
        ⚠ <span style="color: #00f3ff;">ERROR</span> ⚠
      </p>
      <p style="margin: 0 0 1.5rem;">ctrl+f is disabled on this page.</p>
      <p style="margin: 0 0 1.5rem;">only link hopping is permitted.</p>
      <button id="closeModal">[ OK ]</button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const close = () => overlay.remove();
    document.getElementById('closeModal').onclick = close;
    overlay.onclick = (ev) => {
      if (ev.target === overlay) close();
    };
  }
});
