# Lomtalanítás / Kiürítés Budapest

Statikus HTML5 weboldal, közös CSS és minimális JavaScript. A kis Node-generátor csak szerkesztéskor kell, a tárhelyen nincs Node-függőség.

## Szerkesztés és ellenőrzés

```powershell
node tools/build.mjs
node tools/check.mjs
node tools/url-map.mjs
node tools/serve.mjs
```

Helyi előnézet: http://127.0.0.1:4173/ . A preview nem futtatja az Apache `.htaccess` szabályait.

- Szolgáltatások: `tools/services.mjs`
- Kerületi tartalom: `tools/districts.mjs`
- Közös fejléc, lábléc, oldalak, schema és sitemap: `tools/build.mjs`
- Vizuális rendszer: `css/style.css`
- Mobil menü és e-mail összeállító: `js/main.js`
- Google Analytics hozzájárulás: `cookie-popup.js`

A HTML kimenetek is verziókövetettek. Módosítás után mindig újra kell generálni őket. A build nem tölti fel a weboldalt sehova.

## Böngészős QA

A `tools/browser-check.mjs` Playwright és telepített Microsoft Edge segítségével ellenőriz. A Playwright a futtatási környezetben már rendelkezésre állt; nem adtunk a weboldalhoz kliensoldali függőséget. Más környezetben a Playwright helyét a `CODEX_NODE_MODULES` környezeti változóval vagy helyi fejlesztői telepítéssel lehet megadni.

```powershell
node tools/browser-check.mjs
```

A mérési szolgáltatás kéréseit a teszt helyben helyettesíti, így nem küld tesztforgalmat a GA-fiókba. Az ajánlatkérő ellenőrzése nem küld e-mailt. Képernyőképek és jelentések: `artifacts/` (Gitből kizárva).

## Üzemeltetési keretek

Kizárólag `redesign-seo` branch. Nincs main merge, push vagy FTP deploy. A canonical host a korábban beállított `https://www.lomtalanitaskiurites.hu`.

A statikus közzétételhez a HTML oldalak, `css/`, `js/`, `assets/`, `cookie-popup.js`, `.htaccess`, `robots.txt`, `sitemap.xml` és a változatlan verification TXT szükséges. A `tools/`, `docs/`, `artifacts/`, `.git/` nem publikus tartalom; az Apache konfiguráció tiltja ezek kiszolgálását, de az alapelv az, hogy nem kerülnek fel a webrootba.

Az élesítés előtti, környezetfüggő ellenőrzések és a hiányzó cégadatok listája: `docs/handover.md`. URL-ek: `docs/url-mapping.md` és `docs/url-mapping.csv`. Kiinduló audit: `docs/initial-audit.md`.
