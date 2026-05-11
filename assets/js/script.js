// gets the button from the HTML
const button = document.getElementById('open');

// gets the container where the wikipedia page will be shown
const result = document.getElementById('display-result');

// checks if the wikipedia page is an actual redirect
async function isRedirectPage(title) {
  try {
    // requests page info
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&redirects&format=json&origin=*`,
    );

    // converts response into JSON
    const data = await response.json();

    // wikipedia adds a "redirects" field
    // if the page is a redirect
    return !!data.query.redirects;
  } catch (error) {
    // logs errors
    console.error(error);

    // if request fails
    // assume not a redirect
    return false;
  }
}

// function that loads wikipedia pages
async function loadWikipediaPage(title) {
  try {
    // checks if page is a redirect trap
    const redirectTrap = await isRedirectPage(title);

    // blocks redirect trap pages
    if (redirectTrap) {
      result.innerHTML = `
        <h2>Blocked Redirect Page</h2>
        <p>This page only redirects to another article.</p>
      `;

      return;
    }

    // requests wikipedia page HTML
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(title)}&prop=text&format=json&origin=*`,
    );

    // converts response into JSON
    const data = await response.json();

    // gets article HTML
    const html = data.parse.text['*'];

    // injects article into page
    result.innerHTML = `
      <h1>${title}</h1>
      ${html}
    `;

    // selects all links in the article
    const links = result.querySelectorAll('a');

    // loops through links
    links.forEach((link) => {
      // gets href value
      const href = link.getAttribute('href');

      // blocks empty links
      if (!href) {
        link.removeAttribute('href');

        return;
      }

      // blocks image/file pages ONLY
      const isImagePage =
        href.includes('/wiki/File:') || href.includes('/wiki/Image:');
      // checks if link starts with wikipedia article path
      const isWikiPath = href.startsWith('/wiki/');

      // extracts article name
      const articleName = href.replace('/wiki/', '');

      // wikipedia namespaces that should be blocked
      const blockedNamespaces = [
        'File:',
        'Image:',
        'Special:',
        'Help:',
        'Category:',
        'Portal:',
        'Template:',
        'Template_talk:',
        'Wikipedia:',
        'Talk:',
      ];

      // checks if link belongs to blocked namespace
      const isBlockedNamespace = blockedNamespaces.some((namespace) =>
        articleName.startsWith(namespace),
      );

      // final validation
      const isWikiArticle =
        isWikiPath &&
        !isBlockedNamespace &&
        !href.startsWith('#') &&
        !href.startsWith('//');

      // if link is an image page
      // disable clicking but keep image visible
      if (isImagePage) {
        link.removeAttribute('href');

        link.style.cursor = 'default';

        return;
      }

      // blocks all invalid article links
      if (!isWikiArticle) {
        link.removeAttribute('href');

        link.style.cursor = 'default';

        link.style.opacity = '0.5';

        return;
      }

      // adds internal wikipedia navigation
      link.addEventListener('click', (e) => {
        // prevents browser navigation
        e.preventDefault();

        // extracts article title
        const newTitle = decodeURIComponent(href.replace('/wiki/', ''));

        // loads new article
        loadWikipediaPage(newTitle);
      });
    });
  } catch (error) {
    // logs errors
    console.error(error);

    // displays error message
    result.innerHTML = 'Error loading Wikipedia article';
  }
}

// loads a random wikipedia article
async function getWikiAPI() {
  try {
    // requests random wikipedia page
    const randomResponse = await fetch(
      'https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=random&grnnamespace=0',
    );

    // converts response into JSON
    const randomData = await randomResponse.json();

    // extracts random page object
    const page = Object.values(randomData.query.pages)[0];

    // loads random article
    loadWikipediaPage(page.title);
  } catch (error) {
    // logs errors
    console.error(error);
  }
}

// starts game when button is clicked
button.addEventListener('click', getWikiAPI);
