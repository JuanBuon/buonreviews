// consent.js – aviso de cookies y carga de Google Analytics solo con consentimiento.
// La elección se guarda en localStorage ("br-cookie-consent": "granted" | "denied").
// Cualquier elemento con el atributo data-cookie-settings vuelve a abrir el aviso.
(function () {
  var GA_ID = 'G-EDPFZZJB45';
  var KEY = 'br-cookie-consent';

  function getChoice() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function setChoice(value) {
    try { localStorage.setItem(KEY, value); } catch (e) { /* sin almacenamiento: se volverá a preguntar */ }
  }

  function loadAnalytics() {
    if (window.__brGaLoaded) return;
    window.__brGaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  // Borra las cookies de Google Analytics si el visitante las rechaza después de aceptarlas.
  function removeAnalyticsCookies() {
    var host = location.hostname.replace(/^www\./, '');
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name === '_ga' || name.indexOf('_ga_') === 0 || name === '_gid') {
        ['', '; domain=' + host, '; domain=.' + host].forEach(function (d) {
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
        });
      }
    });
  }

  var banner = null;

  function closeBanner() {
    if (banner) { banner.remove(); banner = null; }
  }

  function choose(value) {
    var previous = getChoice();
    setChoice(value);
    closeBanner();
    if (value === 'granted') {
      loadAnalytics();
    } else {
      removeAnalyticsCookies();
      // Si Analytics ya estaba cargado en esta página, se recarga para descargarlo.
      if (previous === 'granted' && window.__brGaLoaded) location.reload();
    }
  }

  function showBanner() {
    if (banner) return;
    banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Aviso de cookies');
    banner.innerHTML =
      '<div class="cookie-banner-inner">' +
        '<p class="cookie-banner-title">Cookies en BuonReviews</p>' +
        '<p>Usamos cookies propias necesarias y, si nos das permiso, cookies de analítica de Google Analytics para saber qué contenidos son útiles. ' +
        'Puedes aceptarlas o rechazarlas, y cambiar tu elección cuando quieras desde “Configurar cookies” en el pie de página. ' +
        '<a href="/politica-cookies/">Más información</a>.</p>' +
        '<div class="cookie-banner-actions">' +
          '<button type="button" class="btn cookie-btn" data-choice="denied">Rechazar</button>' +
          '<button type="button" class="btn cookie-btn" data-choice="granted">Aceptar</button>' +
        '</div>' +
      '</div>';
    banner.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-choice]');
      if (btn) choose(btn.getAttribute('data-choice'));
    });
    document.body.appendChild(banner);
  }

  function init() {
    var choice = getChoice();
    if (choice === 'granted') loadAnalytics();
    else if (choice !== 'denied') showBanner();

    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-cookie-settings]');
      if (trigger) { e.preventDefault(); showBanner(); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
