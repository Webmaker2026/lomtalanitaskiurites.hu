import {execFileSync} from 'node:child_process';
import {readFile,writeFile} from 'node:fs/promises';
const baseline=execFileSync('git',['ls-tree','-r','--name-only','2c965f7'],{encoding:'utf8'}).trim().split(/\r?\n/);
const mappings=[];
for(const file of baseline.filter(f=>f.endsWith('.html'))){const url=file==='index.html'?'/':file.endsWith('/index.html')?'/'+file.slice(0,-10):'/'+file;mappings.push([url,url,'200 megőrzés és újraépítés']);if(file==='index.html'||file.endsWith('/index.html'))mappings.push(['/'+file,url,'301 canonical index']);}
for(const [old,target] of [['lomtalanitas','/lomtalanitas-budapest/'],['lakaskiurites','/lakaskiurites-budapest/'],['munkamenet','/blog.html#lakaskiurites-menete'],['fontos-tudnivalok','/blog.html']])for(const suffix of ['','.html','/'])mappings.push(['/'+old+suffix,target,'301 közvetlen, régi hivatkozás']);
for(const name of ['arak','ajanlatkeres','elerhetoseg','galeria','blog','adatvedelem'])for(const suffix of ['','/','.html/'])mappings.push(['/'+name+suffix,'/'+name+'.html','301 alias normalizálás']);
for(const [old,target] of [['kep3.webp','kep3.webp'],['kep4.webp','kiuritott-szoba.webp'],['lakas-lomtalanitas.webp','lakas-lomtalanitas.webp']])mappings.push(['/'+old,'/assets/'+target,'301 eredeti képhivatkozás']);
const pages=JSON.parse(await readFile('tools/pages.json','utf8'));
for(const p of pages.filter(p=>p.url!=='/'&&p.url.endsWith('/')))if(!mappings.some(m=>m[0]===p.url))mappings.push([p.url,p.url,'200 új tartalom']);
await writeFile('docs/url-mapping.csv','regi_url,uj_url,muvelet\n'+mappings.map(row=>row.map(c=>'"'+c.replaceAll('"','""')+'"').join(',')).join('\n')+'\n');
await writeFile('docs/url-mapping.md','# URL mapping\n\nCanonical host: `https://www.lomtalanitaskiurites.hu`. A forrás a `2c965f7` fájllistája és az első (`aaeb7d4`) mentés belső hivatkozásai. Forgalmi értéket Search Console hozzáférés nélkül nem állítunk.\n\n| Régi URL | Új URL | Művelet |\n|---|---|---|\n'+mappings.map(row=>'| '+row.join(' | ')+' |').join('\n')+'\n\nMinden végleges könyvtároldal záró perjeles. A tényleges könyvtárak perjel nélküli és index.html változatai közvetlen 301-et kapnak a canonical host végleges URL-jére. A http/non-www változatok HTTPS www címre kerülnek; a fenti aliasok eleve teljes canonical célra mutatnak. Query paraméterek megmaradnak, így az UTM és Google Ads kattintási paraméterek nem vesznek el. Ismeretlen URL: valódi 404, nem főoldali redirect. A 404 oldal noindex és nem szerepel a sitemapben.\n');
console.log(`Documented ${mappings.length} URL mappings.`);
