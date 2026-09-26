import {readFile,stat,writeFile,mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {services} from './services.mjs';
import {districts} from './districts.mjs';
const pages=JSON.parse(await readFile('tools/pages.json','utf8'));
const host='https://www.lomtalanitaskiurites.hu';
const htmls=new Map(await Promise.all(pages.map(async p=>[p.url,await readFile(p.file,'utf8')])));
const titles=new Set(),descriptions=new Set(),incoming=new Map();let links=0,schemas=0;
const strip=s=>s.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
for(const p of pages){
 const html=htmls.get(p.url);
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1,p.url+' H1');
 assert.equal((html.match(/<main[ >]/g)||[]).length,1,p.url+' main');
 const title=html.match(/<title>(.*?)<\/title>/s)?.[1];assert(title&&!titles.has(title),'duplicate title '+p.url);titles.add(title);
 const description=html.match(/<meta name="description" content="([^"]+)"/)?.[1];assert(description&&!descriptions.has(description),'duplicate description '+p.url);descriptions.add(description);
 assert(html.includes(`<link rel="canonical" href="${host+p.url}">`),p.url+' canonical');
 assert(!/tailwind|style=|onclick=|tel:\+36(?!708035257)/i.test(html),p.url+' legacy code/phone');
 assert(!/\+36\s*(?:30|20)|\+36303370725/.test(html),p.url+' wrong phone');
 assert(html.includes('name="viewport"'),p.url+' viewport');
 assert(html.includes('property="og:url"'),p.url+' open graph');
 assert(html.includes('src="/cookie-popup.js"'),p.url+' consent');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);assert.equal(ids.length,new Set(ids).size,p.url+' duplicate id');
 for(const [,json] of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)){
  const data=JSON.parse(json);schemas++;
  const faq=data['@graph'].find(g=>g['@type']==='FAQPage');
  for(const q of faq?.mainEntity||[]){assert(html.includes(q.name),p.url+' schema question mismatch');assert(html.includes(q.acceptedAnswer.text),p.url+' schema answer mismatch');}
  assert(!json.includes('aggregateRating')&&!json.includes('reviewCount'),'unverified reviews');
 }
 for(const [,url] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  if(/^(?:mailto:|tel:|https?:)/.test(url))continue;
  const parsed=new URL(url,host+p.url);const target=parsed.pathname;links++;
  const file=target==='/'?'index.html':target.endsWith('/')?target.slice(1)+'index.html':target.slice(1);
  assert((await stat(file)).isFile(),p.url+' broken link '+url);
  if(target.endsWith('/')||target.endsWith('.html'))incoming.set(target,(incoming.get(target)||0)+1);
  if(parsed.hash){const content=htmls.get(target);assert(content?.includes(`id="${parsed.hash.slice(1)}"`),p.url+' broken fragment '+url);}
 }
 for(const [img] of html.matchAll(/<img\b[^>]+>/g))assert(/alt="[^"]+"/.test(img)&&/width="\d+"/.test(img)&&/height="\d+"/.test(img),p.url+' image dimensions/alt');
}
for(const p of pages.filter(p=>!p.noindex))assert(incoming.has(p.url),'orphan '+p.url);
const sitemap=await readFile('sitemap.xml','utf8');const sitemapUrls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(x=>x[1]);
assert.deepEqual(sitemapUrls,pages.filter(p=>!p.noindex).map(p=>host+p.url));
assert((await readFile('robots.txt','utf8')).includes(host+'/sitemap.xml'));
assert.equal(districts.length,23);assert.equal(services.length,12);
const pricing=htmls.get('/arak.html');for(const amount of ['6 900 Ft','5 000 Ft-tól','25 000 Ft-tól','8 000 Ft-tól','12 000 Ft-tól','20 000 Ft-tól','15 000 Ft-tól','70 000 Ft-tól'])assert(pricing.includes(amount),'missing old price '+amount);
// Static redirect-map validation; this is not an Apache runtime emulator.
const htaccess=await readFile('.htaccess','utf8');
const redirectRules=[...htaccess.matchAll(/^RewriteRule (\S+) (\S+) \[R=301[^\]]*\]/gm)].map(m=>({pattern:new RegExp(m[1]),target:m[2]}));
const mappings=(await readFile('docs/url-mapping.csv','utf8')).trim().split(/\r?\n/).slice(1).map(line=>line.slice(1,-1).split('","'));
for(const [old,target,action] of mappings){
 const pathname=target.split('#')[0];const file=pathname==='/'?'index.html':pathname.endsWith('/')?pathname.slice(1)+'index.html':pathname.slice(1);
 assert((await stat(file)).isFile(),'missing mapped target '+target);
 if(action.startsWith('301')){
  const rule=redirectRules.find(r=>r.pattern.test(old.slice(1)));assert(rule,'missing redirect '+old);
  const match=old.slice(1).match(rule.pattern);
  const destination=rule.target.replace(/\$(\d+)/g,(_,n)=>match[Number(n)]||'');
  assert.equal(destination,host+target,'incorrect redirect '+old);
 }
}
const verification='google-site-verification=r9si3v2E46OtJ9nN9j952-v6RsWNqW3hbEEi3rNJxlE.txt';
assert.equal(await readFile(verification,'utf8'),execFileSync('git',['show','2c965f7:'+verification],{encoding:'utf8'}));
const stats={pages:pages.length,indexable:pages.filter(p=>!p.noindex).length,districts:districts.length,services:services.length,checkedLocalLinks:links,jsonLdDocuments:schemas,uniqueTitles:titles.size,uniqueDescriptions:descriptions.size,minServiceWords:Math.min(...services.map(s=>strip(htmls.get('/'+s.slug+'/').match(/<main[\s\S]*?<\/main>/)[0]).split(' ').length)),minDistrictWords:Math.min(...districts.map(d=>strip(htmls.get('/'+d.slug+'/').match(/<main[\s\S]*?<\/main>/)[0]).split(' ').length))};
await mkdir('artifacts',{recursive:true});await writeFile('artifacts/static-check.json',JSON.stringify(stats,null,2));console.log(stats);
