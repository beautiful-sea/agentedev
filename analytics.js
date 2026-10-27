(() => {
  'use strict';
  const id = 'G-1FFT3KXQY1';
  const key = 'agentedev.analytics-consent.v1';
  const lifetime = 90 * 86400000;
  const banner = document.querySelector('#metrics-choice');
  if (!banner) return;
  let enabled = false;
  let loaded = false;
  function savedChoice() {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value && Date.now() - value.time < lifetime ? value.choice : null;
    } catch { return null; }
  }
  function remember(choice) {
    try { localStorage.setItem(key, JSON.stringify({ choice, time: Date.now() })); } catch {}
  }
  // Only our campaign labels are sent. Other queries, fragments and referrer paths are omitted.
  const campaign = {
    utm_source: ['instagram'], utm_medium: ['organic_social'],
    utm_campaign: ['perfil'], utm_content: ['bio', 'stories', 'reels']
  };
  const page = new URL(location.origin + location.pathname);
  const query = new URLSearchParams(location.search);
  Object.entries(campaign).forEach(([name, values]) => {
    if (values.includes(query.get(name))) page.searchParams.set(name, query.get(name));
  });
  let referrer = '';
  try { referrer = new URL(document.referrer).origin + '/'; } catch {}
  function enable() {
    if (enabled || location.hostname !== 'beautiful-sea.github.io') return;
    enabled = true;
    window['ga-disable-' + id] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'denied', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied'
    });
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', id, {
      page_location: page.href, page_referrer: referrer,
      allow_google_signals: false, allow_ad_personalization_signals: false,
      cookie_domain: location.hostname, cookie_path: '/agentedev/',
      cookie_prefix: 'agentedev', cookie_expires: 90 * 86400,
      cookie_flags: 'SameSite=Lax;Secure'
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.append(script);
    loaded = true;
  }
  function decline() {
    enabled = false;
    window['ga-disable-' + id] = true;
    // Remove only this site's analytics cookies, never cookies belonging to other projects.
    document.cookie.split(';').forEach(part => {
      const name = part.split('=')[0].trim();
      if (!name.startsWith('agentedev_ga')) return;
      for (const domain of ['', ';Domain=' + location.hostname]) {
        document.cookie = name + '=;Max-Age=0;Path=/agentedev/' + domain + ';Secure;SameSite=Lax';
      }
    });
    if (loaded) location.reload();
  }
  banner.addEventListener('click', event => {
    const button = event.target.closest('[data-metrics-choice]');
    if (!button) return;
    const choice = button.dataset.metricsChoice;
    remember(choice);
    banner.hidden = true;
    if (choice === 'accept') enable(); else decline();
  });
  document.querySelectorAll('[data-metrics-settings]').forEach(button => {
    button.addEventListener('click', () => {
      banner.hidden = false;
      banner.querySelector('button').focus();
    });
  });
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!enabled || !link || event.defaultPrevented) return;
    let url;
    try { url = new URL(link.href); } catch { return; }
    if (url.hostname !== 'wa.me') return;
    window.gtag('event', 'whatsapp_click', {
      send_to: id, contact_channel: 'whatsapp',
      button_location: link.closest('#contato') ? 'footer' : 'intro',
      page_location: page.href, page_referrer: referrer,
      transport_type: 'beacon'
    });
  });
  const choice = savedChoice();
  banner.hidden = !!choice;
  if (choice === 'accept') enable();
})();
