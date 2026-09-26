import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=process.env.CODEX_NODE_MODULES?require(process.env.CODEX_NODE_MODULES+'/playwright'):require('playwright');
const browser=await chromium.launch({headless:true,channel:'msedge'});
try{
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 await context.addInitScript(()=>{
  window.qaMetrics={lcp:0,cls:0};
  new PerformanceObserver(list=>{for(const entry of list.getEntries())window.qaMetrics.lcp=entry.startTime;}).observe({type:'largest-contentful-paint',buffered:true});
  new PerformanceObserver(list=>{for(const entry of list.getEntries())if(!entry.hadRecentInput)window.qaMetrics.cls+=entry.value;}).observe({type:'layout-shift',buffered:true});
 });
 const page=await context.newPage();let external=0;
 await context.route('https://**/*',route=>{external++;return route.abort();});
 await page.goto('http://127.0.0.1:4173/');await page.locator('.hero-photo img').evaluate(img=>img.decode());
 await page.screenshot({path:'artifacts/first-visit-desktop.png'});
 const metrics=await page.evaluate(()=>({...window.qaMetrics,resources:performance.getEntriesByType('resource').map(e=>({name:new URL(e.name).pathname,bytes:e.decodedBodySize}))}));
 assert.equal(external,0,'external calls before consent');
 await page.locator('#rejectCookies').click();
 await page.goto('http://127.0.0.1:4173/lakaskiurites-budapest/');await page.screenshot({path:'artifacts/service-desktop.png'});
 await page.goto('http://127.0.0.1:4173/ajanlatkeres.html');
 assert.equal(await page.locator('.page-hero .text-link').getAttribute('href'),'#email');
 await page.locator('#quote-form').scrollIntoViewIfNeeded();await page.screenshot({path:'artifacts/quote-desktop.png'});
 // Stored preference corruption and expiry must never silently grant consent.
 for(const value of ['invalid',JSON.stringify({value:'granted',expires:1})]){
  await page.evaluate(v=>localStorage.setItem('lk-consent-v1',v),value);await page.reload();
  assert(await page.locator('#cookieConsent').isVisible());assert.equal(external,0);
 }
 const blocked=await browser.newContext({viewport:{width:320,height:700}});
 await blocked.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked')}}));
 const b=await blocked.newPage();let err=0;b.on('pageerror',()=>err++);
 await b.goto('http://127.0.0.1:4173/');await b.locator('#rejectCookies').click();assert(await b.locator('#cookieConsent').isHidden());assert.equal(err,0);
 await writeFile('artifacts/performance-smoke.json',JSON.stringify({environment:'Local Edge headless, unthrottled; not Lighthouse or field Core Web Vitals',...metrics,externalRequestsBeforeConsent:external,storage:'blocked, corrupt and expired cases passed'},null,2));
 console.log(JSON.stringify({metrics,external,storage:'PASS'}));
}finally{await browser.close();}
