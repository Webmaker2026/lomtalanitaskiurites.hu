# Kiinduló audit – 2026-09-26

- Branch: `redesign-seo`, kiinduló commit: `2c965f7`; munkafa tiszta. Main, FTP és éles fájlok módosítása tilos.
- 13 HTML oldal, hiányzó robots/sitemap/Apache konfiguráció. Régi .html és kiterjesztés nélküli linkek nem létező szolgáltatási oldalakra mutatnak.
- Canonical host az előző redesignban: `https://www.lomtalanitaskiurites.hu`. Megtartjuk. Értékes URL-ekről Search Console adatok nem állnak rendelkezésre; nem feltételezünk forgalmat vagy rangsort.
- Megőrzendő GA4: `G-L3L5614D8L`, eredetileg elerhetoseg.html. GTM/Ads azonosító nincs a jelenlegi fájlokban. Verification TXT változatlan marad, név és tartalom szerint is.
- Korábbi cookie-popup.js csak localStorage cookiesAccepted értéket írt, a mérőkódot nem szabályozta. Új, visszavonható hozzájárulás szükséges; az eredeti változat Gitben megmarad.
- Árforrás arak.html: 1 m³ 6 900 Ft; bútor 5 000 Ft-tól; szekrénysor 25 000 Ft-tól; mosógép 8 000 Ft-tól; hűtő 12 000 Ft-tól; kanapé 20 000 Ft-tól; franciaágy 15 000 Ft-tól; teljes lakás 70 000 Ft-tól. Ezek változatlanok. ÁFA/minimumdíj nincs tisztázva, nem találunk ki ilyen feltételeket.
- Helyes telefon minden új oldalon: +36 70 803 5257. E-mail a meglévő ajánlatkérő szerint lomtalanitaskiurites@gmail.com. Kapcsolat oldalon eltérő mailto volt, javítandó.
- Blog: ingyenesség/értékbeszámítás, éves lomtalanítás alternatívái, lakáskiürítés folyamata, bútorok. Témák és blog.html URL megőrzése; bizonyítatlan garanciák és elavult 2025-ös állítások helyett tárgyilagos útmutatók.
- Fotók nincsenek a Git történetében sem. A meglévő oldalról olvasással visszanyert három WebP: kep3.webp, kep4.webp, lakas-lomtalanitas.webp. Nem új stock és nem generált referencia. A régi galériából származó képeket nem rendeljük kitalált címhez/ügyfélhez.
- Adatvédelmi forrásban szereplő név: Putnoki Sarolta e.v.; székhely, adószám, konkrét megőrzési idők hiányoznak. Ezeket nem találjuk ki.

## Források és döntések

- Helynevek: https://archiv.budapest.hu/Lapok/Fovaros/Keruletek.aspx (Budapest Főváros). A rakodási tanácsok feltételesek, nem állítanak ellenőrizetlen helyi engedélyezési szabályt.
- Hozzájárulás: https://developers.google.com/tag-platform/security/guides/consent
- Apache: https://httpd.apache.org/docs/2.4/rewrite/remapping.html
- Minden meglévő tényleges oldal URL-je megtartandó. Hiányzó korábbi szolgáltatási és extensionless aliasok közvetlen 301-et kapnak, nem főoldali gyűjtőredirectet.
