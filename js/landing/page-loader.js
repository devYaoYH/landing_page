/* Inject HTML fragments into placeholders. Two source dirs:
     [data-page="foo"]      → pages/foo.html       (top-level page sections)
     [data-component="foo"] → components/foo.html  (shared chrome / widgets)
   Loading kicks off at script parse so fragments are ready well before the
   user finishes the typewriter intro and clicks through to the blog. */

window.fragmentsReady = (async () => {
  const slots = document.querySelectorAll('[data-page], [data-component]');
  await Promise.all([...slots].map(async (slot) => {
    const isPage = slot.hasAttribute('data-page');
    const name = isPage ? slot.dataset.page : slot.dataset.component;
    const dir = isPage ? 'pages' : 'components';
    const html = await fetch(`${dir}/${name}.html`).then(r => r.text());
    slot.outerHTML = html;
  }));
})();
