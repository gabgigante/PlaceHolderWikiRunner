const loadingContainer = document.getElementById("loading");

const bootLines = [
  {
    paragraph: "CONNECTING TO SERVER...",
    delay: 1000,
    status: "err",
  },
  {
    paragraph: "CALLING WIKI API...",
    delay: 2000,
    status: "err",
  },
  {
    paragraph: "FINDING NODE TARGET...",
    delay: 1000,
    status: "err",
  },
  {
    paragraph: "TARGET: MICHAEL JACKSON",
    delay: 2000,
    status: "err",
  },
  {
    paragraph: "READY TO START THE GAME",
    delay: 1000,
    status: "err",
  },
];

startBootLines();

function startBootLines() {
  let totalDelay = 0;

  for (let i = 0; i < bootLines.length; i++) {
    const line = bootLines[i];
    totalDelay += line.delay;

    setTimeout(() => {
      let newLine = document.createElement("p");
      newLine.textContent = line.paragraph;

      // if (line.status) {
      //     newLine.classList.add(line.status);
      // }

      loadingContainer.append(newLine);
    }, totalDelay);
  }
  setTimeout(() => {
    window.location.href = "/PlaceHolderWikiRunner/wikirun.html";
  }, totalDelay + 500);
}
