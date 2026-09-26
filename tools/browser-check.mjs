import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const dependencyRoot=process.env.CODEX_NODE_MODULES;
const {chromium}=dependencyRoot?require(dependencyRoot+'/playwright'):require('playwright');
const browser=await chromium.launch({headless:true,channel:'msedge'});
const pages=JSON.parse(await readFile('tools/pages.json','utf8'));
await mkdir('artifacts',{recursive:true});
const errors=[],results=[];
try{
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 // Block external measurement during QA; no production analytics polluted.
 let googleRequests=0;
 await context.route(/https:\/\/(?:www\.)?(?:googletagmanager|google-analytics)\.com\//,route=>{googleRequests++;return route.fulfill({status:200,contentType:'application/javascript',body:''});});
 const page=await context.newPage();page.on('pageerror',error=>errors.push(String(error)));
 await page.goto('http://127.0.0.1:4173/');
 assert.equal(googleRequests,0,'GA loaded before consent');
 assert(await page.locator('#cookieConsent').isVisible());
 await page.locator('#rejectCookies').click();
 await page.reload();assert.equal(googleRequests,0,'GA loaded after rejection');
 assert(await page.locator('#cookieConsent').isHidden());
 await page.screenshot({path:'artifacts/home-desktop.png',fullPage:false});
 await page.locator('[data-consent-settings]').click();await page.locator('#acceptCookies').click();
 await page.waitForFunction(()=>document.querySelector('script[src*="googletagmanager"]'));
 assert.equal(await page.locator('script[src*="googletagmanager"]').count(),1);
 await page.locator('[data-consent-settings]').click();
 await Promise.all([page.waitForEvent('load'),page.locator('#rejectCookies').click()]);
 assert.equal(await page.locator('script[src*="googletagmanager"]').count(),0,'GA remains after withdrawal');
 for(const width of [320,390,768,1440]){
  await page.setViewportSize({width,height:900});
  for(const item of pages){
   const response=await page.goto('http://127.0.0.1:4173'+item.url);
   assert.equal(response.status(),200,item.url);
   const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,failedImages:[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src),h1:document.querySelector('h1')?.getBoundingClientRect().width}));
   assert(!state.overflow,`${width}px overflow ${item.url}`);assert.equal(state.failedImages.length,0,JSON.stringify(state.failedImages));
   assert.equal(errors.length,0,errors.join('\n'));
  }
  results.push({width,pages:pages.length,overflow:0});console.log(`Checked ${pages.length} pages at ${width}px`);
 }
 await page.setViewportSize({width:390,height:844});await page.goto('http://127.0.0.1:4173/');
 assert(await page.locator('.mobile-call').isVisible());
 assert.equal(await page.locator('.mobile-call').getAttribute('href'),'tel:+36708035257');
 const button=page.locator('.menu-button');await button.click();assert.equal(await button.getAttribute('aria-expanded'),'true');
 await page.keyboard.press('Escape');assert.equal(await button.getAttribute('aria-expanded'),'false');
 await page.screenshot({path:'artifacts/home-mobile.png',fullPage:false});
 await page.goto('http://127.0.0.1:4173/arak.html');await page.locator('.price-table').screenshot({path:'artifacts/prices-mobile.png'});
 await page.goto('http://127.0.0.1:4173/lomtalanitas-22-kerulet/');await page.screenshot({path:'artifacts/district-mobile.png',fullPage:false});
 await page.locator('.faq summary').first().click();assert(await page.locator('.faq details').first().getAttribute('open')!==null);
 await page.goto('http://127.0.0.1:4173/ajanlatkeres.html');
 await page.locator('[name=name]').fill('Teszt');await page.locator('[name=contact]').fill('teszt@example.invalid');await page.locator('[name=location]').fill('XI. kerület, 2. emelet');await page.locator('[name=message]').fill('Egy kanapé, két doboz.');
 // Avoid opening any external mail application; validate native form and generated fallback via DOM event.
 await page.route('mailto:**',route=>route.abort());
 await page.locator('#quote-form').evaluate(form=>form.dispatchEvent(new Event('submit',{cancelable:true,bubbles:true})));
 assert((await page.locator('#quote-copy').inputValue()).includes('Egy kanapé, két doboz.'));
 assert((await page.locator('#quote-status').textContent()).includes('még nincs elküldve'));
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const staticPage=await nojs.newPage();
 await staticPage.goto('http://127.0.0.1:4173/ajanlatkeres.html');assert(await staticPage.locator('#fo-menu').isVisible());assert(await staticPage.locator('#quote-form').isHidden());assert(await staticPage.locator('a[href^="mailto:"]').first().isVisible());
 const missing=await page.goto('http://127.0.0.1:4173/does-not-exist');assert.equal(missing.status(),404);
 assert.equal(errors.length,0,errors.join('\n'));
 await writeFile('artifacts/browser-check.json',JSON.stringify({viewports:results,consent:'initial/reject/accept/withdraw passed',navigation:'mobile menu + Escape passed',quote:'validation and copy fallback passed; no email sent',noJavaScript:'navigation + direct email passed',pageErrors:errors},null,2));
 console.log('PASS: '+pages.length+' pages × 4 widths; consent, menu, quote, no-JS, 404.');
}finally{await browser.close();}
