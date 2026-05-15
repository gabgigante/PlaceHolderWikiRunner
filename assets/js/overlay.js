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


const loadingContainer = document.getElementById("loading");

const bootLines = [
    {
        paragraph: "CONNECTING TO SERVER...",
        delay: 1000,
        status: "err"
    },
    {
        paragraph: "CALLING WIKI API...",
        delay: 2000, 
        status: "err"
    },
    {
        paragraph: "FINDING NODE TARGET...",
        delay: 1000, 
        status: "err"
    },
    {
        paragraph: "TARGET: MICHAEL JACKSON",
        delay: 2000, 
        status: "err"
    },
    {
        paragraph: "READY TO START THE GAME",
        delay: 1000, 
        status: "err"
    }

]


document.addEventListener("keydown", (e)=>{
    if(e.key === "Enter"){

        window.location.href = "../../wikirun.html";
        //  window.location.href = "/PlaceHolderWikiRunner/wikirun.html";

    }
})

startBootLines();

function startBootLines() {
    let totalDelay = 0;
    let bootContainer = document.createElement("section");
    bootContainer.classList.add("boot-container")

  for (let i = 0; i < bootLines.length; i++) {
    const line = bootLines[i];
    totalDelay += line.delay;

    setTimeout(() => {
    let newLine = document.createElement("p");
    newLine.textContent = line.paragraph;
    loadingContainer.append(bootContainer);
    bootContainer.append(newLine);
    playReturnSound();

    }, totalDelay);
  }
  setTimeout(() => {

    window.location.href = "../../wikirun.html";
    // window.location.href = "../PlaceHolderWikiRunner/wikirun.html";
  }, totalDelay + 500);
}
