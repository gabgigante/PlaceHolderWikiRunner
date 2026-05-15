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
    }, totalDelay);
  }
  setTimeout(() => {

    window.location.href = "../../wikirun.html";
    // window.location.href = "../PlaceHolderWikiRunner/wikirun.html";
  }, totalDelay + 500);
}
