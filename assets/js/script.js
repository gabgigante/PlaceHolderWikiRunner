const button = document.getElementById("open");
const result = document.getElementById("display-result");

let currentTitle = "";

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

async function loadWikipediaPage(title) {
  try {
    currentTitle = title;
    //controlla se si ha vinto
    if (title.toLowerCase() === "michael jackson")
      window.location.href = "https://google.com";

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

        console.log("Click su:", finalTitle);

        loadWikipediaPage(finalTitle);
      });
    });
  } catch (error) {
    console.error(error);

    result.innerHTML = "Error loading Wikipedia article: " + title;
  }
}

function disableLink(link) {
  link.removeAttribute("href");
  link.style.cursor = "default";
  link.style.pointerEvents = "none";
}

async function getWikiAPI() {
  try {
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

    if (page.title.toLowerCase() === "michael jackson") {
      console.log("Trovato MJ all’inizio, riprovo...");
      getWikiAPI();
      return;
    }

    loadWikipediaPage(page.title);
  } catch (error) {
    console.error(error);

    result.innerHTML = "Error fetching random article";
  }
}

if (button && result) {
  getWikiAPI();

  button.addEventListener("click", () => {
    console.log("Nuovo articolo casuale...");
    getWikiAPI();
  });
} else {
  console.error("Elementi HTML non trovati!");
}
