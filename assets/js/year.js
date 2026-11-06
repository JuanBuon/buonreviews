// year.js – pone el año actual en todos los elementos con data-year,
// en el <title> y en la meta descripción de las páginas que lo usan.
// El HTML ya trae un año escrito de respaldo por si el JavaScript no se ejecuta.
(function () {
  var year = String(new Date().getFullYear());

  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = year;
  });

  var root = document.documentElement;
  if (root.hasAttribute('data-year-meta')) {
    var re = /\b20\d{2}\b/g;
    document.title = document.title.replace(re, year);
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', desc.getAttribute('content').replace(re, year));
  }
})();
