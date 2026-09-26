# Átadás – redesign és SEO újraépítés

## Elkészült

- 44 statikus oldal, ebből 43 indexelhető. 12 részletes szolgáltatási landing, 23 saját előkészítési listát és helyi kérdést tartalmazó kerületi oldal, kerületi gyűjtő, főoldal, árak, kapcsolat, ajánlatkérés, galéria, blog, adatvédelem és valódi 404-hez használható hibaoldal.
- A főoldal a budapesti szolgáltatásokat összefogó pillar. A megőrzött `/lomtalanitas-budapest/` oldal a rakodásos szolgáltatás részleteit bontja ki. Külön önmagukra mutató canonicalt kaptak; a régi útvonalat nem töröltük forgalmi bizonyíték nélkül.
- Minden oldalon közös navigáció, morzsa (a főoldal kivételével), lábléc, magyar szöveg, telefonos CTA; mobilon fix alsó „Hívás most”.
- Egységes telefon: `+36 70 803 5257`. E-mail: `lomtalanitaskiurites@gmail.com`.
- Az eredeti nyolc ártétel változatlan. A végösszeg, az adótartalom és a további munkák egyeztetendők, új díj nem került be.
- A korábbi blog négy hasznos témája megmaradt és megújult. Nincs kitalált értékelés, ügyfélszám, helyi referencia vagy „legjobb” állítás.
- Saját korábbi weboldalról visszanyert fotók. A fő kép 31 KB WebP, nem lazy; a galéria nagyobb fotója 275 KB-ról 58 KB-ra optimalizált, 1440×1080 méretű WebP. Méretattribútumok és alt szövegek szerepelnek.
- Közös CSS, külön menü/ajánlatkérő JS és hozzájárulási JS; nincs Tailwind CDN vagy végrehajtható inline script. A JSON-LD természetesen a dokumentumban szerepel.
- Egyedi metaadatok, HTTPS www canonical, Open Graph, LocalBusiness, Service, BreadcrumbList és a látható kérdésekkel egyező FAQPage. A strukturált adatok nem jelentenek ígéretet Google-bővített találatra.
- Sitemap, robots, 83 soros URL mapping, közvetlen régi URL-redirectek, cache/tömörítés, alap fejlécek és 404 konfiguráció.

## Mérőkód és kapcsolatfelvétel

A GA4 azonosító `G-L3L5614D8L` megmaradt. Az új alapértelmezés tiltott mérés: a Google script elfogadás előtt nem töltődik be. Van elutasítás és láblécből elérhető visszavonás; hirdetési consent nem kap automatikus engedélyt. A választás 180 napos, verziózott localStorage-bejegyzés. A korábbi `cookiesAccepted` jelzés nem adott külön analitikai hozzájárulást, ezért nem migráltuk automatikus engedélynek.

A régi FormSubmit űrlapot közvetlen e-mailes ajánlatkérés váltotta fel: a fotók a saját levelezőben csatolhatók. Az oldali segéd nem mutat hamis „elküldve” visszajelzést, és másolható szöveges tartalékot ad, ha nincs alapértelmezett levelező. JavaScript nélkül közvetlen e-mail és telefon marad használható, a segédűrlap rejtett. A teszt nem küldött levelet.

## Amihez nem volt hiteles forrás vagy éles hozzáférés

1. A meglévő adatvédelmi oldalon szereplő üzemeltetőnév (Putnoki Sarolta e.v.) megőrzött adat, önálló cégnyilvántartási hitelesítés nem történt. Székhely, nyilvántartási/adóadatok, tárhelyszolgáltató, szervernaplók megőrzési ideje, tényleges üzleti adatmegőrzési és Google-fiókbeállítások nem találhatók a repositoryban. Ezeket közzététel előtt a tulajdonosnak kell megadnia és az adatvédelmi tájékoztatóban véglegesítenie. Nem helyettesítettük kitalált adatokkal.
2. A verification TXT byte szerint változatlan, de a forrásfájl üres. Ennek működését és a tényleges tulajdonellenőrzési módot Search Console-ban kell ellenőrizni; a fájl önmagában nem bizonyít sikeres ellenőrzést.
3. Search Console lekérdezési/URL-forgalmi adatok nélkül rangsorolási vagy forgalmi javulás nem állítható. Minden tényleges meglévő tartalmi URL megmaradt.
4. Apache nem állt rendelkezésre helyben. A `.htaccess` céljait és szabályait ellenőriztük, de a szervermodulok, AllowOverride, TLS/proxy-konfiguráció és a valós 301-válaszok helyi Node-előnézetből nem tesztelhetők. HTTPS-t az origin Apache-tól feltételez; TLS-termináló proxy esetén a tárhelyszolgáltató hiteles beállítása szükséges, nem tetszőleges forwarded-header elfogadása.
5. A schema üzleti címet nem tartalmaz, mert nincs hiteles cím. Ez korlátozhatja a LocalBusiness bővített találatra való jogosultságot. Nem gyártottunk címet vagy térképpontot.

## Közzététel előtti tárhelyellenőrzés – nem végrehajtott deploy

- Staging Apache-on közvetlen 301: http/non-www, régi .html alias, extensionless alias, index.html és könyvtár perjel nélkül; ne legyen redirectlánc, a query paraméter maradjon meg.
- Ismeretlen URL tényleges HTTP 404 legyen. A 404.html noindex. Privát fejlesztői könyvtárak nem elérhetők.
- CSS/JS megfelelő Content-Type; képek, gzip vagy Brotli és cache ellenőrzése tényleges válaszfejlécek alapján.
- Analytics Realtime/DebugView és Tag Assistant saját fiókkal: elfogadás után mér, elutasítás előtt nincs Google kérés. A teszt csak a helyi beillesztés és consent viselkedését igazolta, a fiókba érkező adatot nem.
- A tulajdonos saját levelezőjéből valódi fotós ajánlatkérés kézbesítési próbája.

Sem az éles oldalt, sem a main branchet nem módosítottuk; nincs FTP-feltöltés.

## Tartalmi és technikai források

- Meglévő repository `2c965f7`, eredeti mentés `aaeb7d4`.
- Budapest Főváros kerületlistája: https://archiv.budapest.hu/Lapok/Fovaros/Keruletek.aspx
- MOHU hivatalos információk: https://mohubudapest.hu/
- Google consent: https://developers.google.com/tag-platform/security/guides/consent
- Apache rewrite: https://httpd.apache.org/docs/2.4/rewrite/remapping.html
- NAIH érintetti jogok: https://www.naih.hu/erintetti-jogok
