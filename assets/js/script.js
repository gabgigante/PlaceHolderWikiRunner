const button = document.getElementById('open');
const result = document.getElementById('display-result');

async function getWikiAPI() {
  try {
    // PAGINA RANDOM
    const randomResponse = await fetch(
      'https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=random&grnnamespace=0',
    );

    const randomData = await randomResponse.json();

    const page = Object.values(randomData.query.pages)[0];

    const title = page.title;

    // HTML COMPLETO PAGINA
    const pageResponse = await fetch(
      `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(title)}&prop=text&format=json&origin=*`,
    );

    const pageData = await pageResponse.json();

    const html = pageData.parse.text['*'];

    result.innerHTML = `
      <h1>${title}</h1>
      ${html}
    `;
  } catch (error) {
    console.error(error);

    result.innerHTML = 'Errore caricamento Wikipedia';
  }
}

button.addEventListener('click', getWikiAPI);
