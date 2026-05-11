const button = document.getElementById("open");
const result = document.getElementById("display-result");

async function isRedirectPage(title) {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&redirects&format=json&origin=*`,
    );
    const data = await response.json();
    return !!data.query.redirects;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function loadWikipediaPage(title) {
  try {
    const redirectTrap = await isRedirectPage(title);

    // silently do nothing if the page is a redirect
    if (redirectTrap) return;

    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(title)}&prop=text&format=json&origin=*`,
    );
    const data = await response.json();
    const html = data.parse.text["*"];

    result.innerHTML = `<h1>${title}</h1>${html}`;

    result.querySelectorAll("a").forEach((link) => {
      const href = link.getAttribute("href");

      if (!href) {
        link.removeAttribute("href");
        link.style.cursor = "default";
        link.style.pointerEvents = "none";
        return;
      }

      const wikiMatch = href.match(/\/wiki\/([^#:]+)$/);

      if (!wikiMatch) {
        link.removeAttribute("href");
        link.style.cursor = "default";
        link.style.pointerEvents = "none";
        return;
      }

      const articleName = decodeURIComponent(wikiMatch[1]);

      link.addEventListener("click", (e) => {
        e.preventDefault();
        loadWikipediaPage(articleName);
      });
    });
  } catch (error) {
    console.error(error);
    result.innerHTML = "Error loading Wikipedia article";
  }
}

async function getWikiAPI() {
  try {
    const randomResponse = await fetch(
      "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=random&grnnamespace=0",
    );
    const randomData = await randomResponse.json();
    const page = Object.values(randomData.query.pages)[0];
    loadWikipediaPage(page.title);
  } catch (error) {
    console.error(error);
  }
}

button.addEventListener("click", getWikiAPI);
