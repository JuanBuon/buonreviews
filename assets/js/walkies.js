// walkies.js

document.addEventListener("DOMContentLoaded", () => {
  // Desplazamiento suave para enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Botón "volver arriba" (estilos en style.css → #scrollToTop)
  const scrollToTopBtn = document.createElement('button');
  scrollToTopBtn.textContent = '↑';
  scrollToTopBtn.id = 'scrollToTop';
  scrollToTopBtn.type = 'button';
  scrollToTopBtn.setAttribute('aria-label', 'Volver arriba');
  document.body.appendChild(scrollToTopBtn);

  window.addEventListener('scroll', () => {
    scrollToTopBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
