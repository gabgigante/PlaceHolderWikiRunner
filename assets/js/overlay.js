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

function playReturnSound() {
  // CRLF mechanical clunk
  playTone(600, 0.04, "sawtooth", 0.035);
  playTone(120, 0.08, "square", 0.02, -30);
}

function playErrorSound() {
  playTone(220, 0.3, "sawtooth", 0.07);
  setTimeout(() => playTone(180, 0.3, "sawtooth", 0.07), 150);
}

function playBootChirp() {
  playTone(440, 0.12, "sine", 0.05);
  setTimeout(() => playTone(660, 0.12, "sine", 0.05), 100);
  setTimeout(() => playTone(880, 0.2, "sine", 0.06), 200);
}

document.addEventListener("keydown", initAudio, { once: true });

const loadingContainer = document.getElementById("loading");

const bootLines = [
  {
    paragraph: "CONNECTING TO SERVER... OK",
    delay: 1500,
    status: "OK",
  },
  {
    paragraph: "CALLING WIKI API... OK",
    delay: 1500,
    status: "OK",
  },
  {
    paragraph: "FINDING NODE TARGET... ERROR | MANUAL OVERRIDE",
    delay: 2500,
    status: "ERR",
  },
  {
    paragraph: "TARGET: MICHAEL JACKSON",
    delay: 1000,
    status: "READY",
  },
  {
    paragraph: "READY TO START THE GAME",
    delay: 1000,
    status: "READY",
  },
];

const paragraph = document.getElementById("press-enter");

function handleStart() {
  initAudio();
  startBootLines();
  paragraph.textContent = "Press enter to skip";
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleStart();
});

document.addEventListener("touchstart", handleStart, { once: true });

// document.addEventListener("keydown", (e)=>{
//     if(e.key === "Enter"){

//     }
// })

function startBootLines() {
  let totalDelay = 0;
  let bootContainer = document.createElement("section");
  bootContainer.classList.add("boot-container");

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const isGithubPages = window.location.hostname.includes("github.io");

      window.location.href = isGithubPages
        ? "/PlaceHolderWikiRunner/wikirun.html"
        : "../../wikirun.html";
    }
  });

  for (let i = 0; i < bootLines.length; i++) {
    const line = bootLines[i];
    totalDelay += line.delay;

    setTimeout(() => {
      let newLine = document.createElement("p");
      newLine.textContent = line.paragraph;
      loadingContainer.append(bootContainer);
      bootContainer.append(newLine);
      if (bootLines[i].status === "OK") {
        playReturnSound();
      } else if (bootLines[i].status === "ERR") {
        playErrorSound();
      } else {
        playBootChirp();
      }
    }, totalDelay);
  }
  setTimeout(() => {
    const isGithubPages = window.location.hostname.includes("github.io");
    // rewrite this to be a function that can be called, it's also used in the enter/skip function
    window.location.href = isGithubPages
      ? "/PlaceHolderWikiRunner/wikirun.html"
      : "../../wikirun.html";
  }, totalDelay + 1100);
}
