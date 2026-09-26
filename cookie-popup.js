// Retains GA4 G-L3L5614D8L. Basic consent: no Google script before opt-in.
(() => {
  const id = 'G-L3L5614D8L';
  const key = 'lk-consent-v1';
  const duration = 180 * 24 * 60 * 60 * 1000;
  const popup = document.getElementById('cookieConsent');
  if (!popup) return;
  let loaded = false;
  let choice = null;
  let settingsTrigger = null;
  try {
    const stored = JSON.parse(localStorage.getItem(key));
    if (stored && ['granted','denied'].includes(stored.value) && stored.expires > Date.now()) choice = stored.value;
  } catch { /* Storage can be unavailable; retain functional session controls. */ }
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  const denied = { analytics_storage:'denied', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied' };
  window.gtag('consent', 'default', denied);
  function enable() {
    window['ga-disable-' + id] = false;
    window.gtag('consent', 'update', {...denied, analytics_storage:'granted'});
    if (loaded) return;
    loaded = true;
    window.gtag('js', new Date());
    window.gtag('config', id, {allow_google_signals:false, allow_ad_personalization_signals:false});
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.append(script);
  }
  function clearAnalyticsCookies() {
    const names = document.cookie.split(';').map(x => x.trim().split('=')[0]).filter(x => /^_ga(?:_|$)/.test(x));
    const domains = [null, location.hostname, '.' + location.hostname, '.lomtalanitaskiurites.hu'];
    for (const name of names) for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/;${domain ? ' domain=' + domain + ';' : ''} SameSite=Lax`;
    }
  }
  function save(value) {
    let persisted = false;
    try { localStorage.setItem(key, JSON.stringify({value, expires:Date.now()+duration})); persisted = true; } catch {}
    choice = value;
    popup.hidden = true;
    settingsTrigger?.focus();
    if (value === 'granted') enable();
    else {
      window['ga-disable-' + id] = true;
      window.gtag('consent', 'update', denied);
      clearAnalyticsCookies();
      if (loaded && persisted) location.reload();
    }
  }
  document.getElementById('acceptCookies')?.addEventListener('click', () => save('granted'));
  document.getElementById('rejectCookies')?.addEventListener('click', () => save('denied'));
  document.querySelectorAll('[data-consent-settings]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => { settingsTrigger = button; popup.hidden = false; document.getElementById('rejectCookies')?.focus(); });
  });
  if (choice === 'granted') enable();
  else { window['ga-disable-' + id] = true; if (choice === null) popup.hidden = false; }
})();
