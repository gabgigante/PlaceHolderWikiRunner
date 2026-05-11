const button = document.getElementById('open');
const URL =
  'https://en.wikipedia.org/w/api.php?action=parse&format=json&origin=*&page=Special:Random&redirects=true&prop=text|images|displaytitle';

async function getWikiAPI() {
  const h1 = document.getElementById('title');
  const content = document.getElementById('content');
  try {
    const res = await fetch(URL);

    if (!res.ok) {
      throw new Error('Errore nella chiamata API', res.status);
    }

    const data = await res.json();

    console.log(data);

    const info = data.parse;

    h1.textContent = info.title;
    content.innerHTML = info.text['*'];

    // if (data.parse) {
    //   const info = data.parse;
    //   title.textContent = info.title;
    //   content.innerHTML = info.text['*'];
    // }
  } catch (err) {
    console.error('Dettaglio Errore:', err.message);
    h1.textContent = 'Ops! Qualcosa è andato storto.';
    content.innerHTML = err.message;
  }
}

button.addEventListener('click', (e) => {
  getWikiAPI();
});
