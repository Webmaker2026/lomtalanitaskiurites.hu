// Navigation remains visible without JavaScript.
const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('#fo-menu');
if (menuButton && nav) {
  document.documentElement.classList.add('js-menu');
  menuButton.hidden = false;
  const closeMenu = () => { nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); };
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menuButton.focus(); }
  });
  window.matchMedia('(min-width:1050px)').addEventListener('change', closeMenu);
}
const form = document.querySelector('#quote-form');
if (form) {
  form.hidden = false;
  // Prevent an unenhanced form from putting personal data into a GET URL.
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const body = `Fotós ajánlatkérés\n\nNév: ${data.get('name')}\nElérhetőség: ${data.get('contact')}\nHelyszín: ${data.get('location')}\nMegközelítés: ${data.get('access')}\n\nElszállítandó tárgyak és időpont:\n${data.get('message')}\n\nA fényképeket ehhez az e-mailhez csatolom.`;
    document.querySelector('#quote-copy').value = body;
    document.querySelector('#quote-fallback').hidden = false;
    document.querySelector('#quote-status').textContent = 'Az e-mail szövege elkészült. A fotókat a levelezőjében csatolja. Az üzenet még nincs elküldve.';
    window.location.href = `mailto:lomtalanitaskiurites@gmail.com?subject=${encodeURIComponent('Lomtalanítás – fotós ajánlatkérés')}&body=${encodeURIComponent(body)}`;
  });
}
