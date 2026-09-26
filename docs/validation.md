# Ellenőrzési eredmények – 2026-09-26

## Statikus ellenőrzés

`node tools/check.mjs` sikeres:

| Ellenőrzés | Eredmény |
|---|---:|
| HTML oldalak | 44 |
| Indexelhető sitemap URL-ek | 43 |
| Részletes szolgáltatások | 12 |
| Kerületi oldalak | 23 |
| Ellenőrzött belső linkek/erőforrások | 1164 |
| Feldolgozható JSON-LD dokumentum | 44 |
| Egyedi title / description | 44 / 44 |
| Legrövidebb szolgáltatási főtartalom | 528 szó |
| Legrövidebb kerületi főtartalom | 507 szó |

Minden oldalon egy H1 és main, helyes canonical, mobil viewport, Open Graph, érvényes JSON-LD, dimenzióval és alt szöveggel ellátott kép. Nincs orphan indexelhető oldal, rossz telefonszám, hibás belső horgony, Tailwind CDN, inline CSS vagy inline eseménykezelő. FAQ schema és a látható FAQ válaszok egyeznek. Nyolc eredeti ár és a verification fájl változatlansága ellenőrizve.

## Böngésző

`node tools/browser-check.mjs`, Microsoft Edge headless:

- 44 oldal × 320 / 390 / 768 / 1440 px = 176 oldalbetöltés. Minden helyi oldal HTTP 200; nincs vízszintes túlcsordulás, hibás betöltött kép vagy JavaScript-hiba.
- Mobil menü nyitás/zárás, aria-expanded, Escape fókuszvisszaadás és fix telefonos link megfelelő.
- Consent: induláskor nincs Google kérés; elutasítás újratöltés után is érvényes; elfogadáskor egyszer töltődik a script; visszavonás után nem töltődik.
- Ajánlatkérő a megadott tartalomból összeállítja a másolható e-mailt, és egyértelműen jelzi, hogy az üzenet nincs elküldve. Külső levél nem ment ki.
- JavaScript nélkül a navigáció, telefon és e-mail elérhető, a JS-függő segéd rejtett.
- Ismeretlen helyi útvonal HTTP 404. Ez a helyi kiszolgáló ellenőrzése, nem Apache-teszt.

`node tools/smoke.mjs`: tiltott localStorage, sérült és lejárt választás esetén nincs hallgatólagos engedély vagy JS-hiba.

## Vizuális ellenőrzés és teljesítmény

Megnézett képernyőképek: asztali és mobil főoldal, mobil árlista, kerületi oldal; további minták a szolgáltatás és ajánlatkérés nézetéről az artifacts mappában.

Helyi, lassítás nélküli Edge betöltés két mintában: LCP 584–676 ms, CLS 0, elfogadás előtti külső kérések 0. Ezek helyi diagnosztikai értékek, nem Lighthouse-pontszámok és nem éles Core Web Vitals mérések. CSS kb. 12,6 KB; fő JS kb. 2 KB; consent kb. 2,9 KB; hero WebP kb. 31 KB. A hajtás alatti képek lazy betöltésűek.

A 83 soros URL mapping célfájljainak létezését és a 301-ként felsorolt aliasok RewriteRule-céljait a statikus ellenőrző is összeveti. Ez nem helyettesíti a valós Apache HTTP-válaszok tesztjét.

`node --check js/main.js`, `node --check cookie-popup.js` és `git diff --check` sikeres.

Az Apache redirect/cache/tömörítés futtatási tesztje és a valós GA-fiókba érkező adatok ellenőrzése nem történt meg. A környezetfüggő pontok a handover dokumentumban szerepelnek.
