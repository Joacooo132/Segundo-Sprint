// Tabla de contenidos dinámica: resalta el enlace de la sección visible (US-07, US-08).
(() => {
  const links = [...document.querySelectorAll('.toc-bar a[href^="#"], .page-index a[href^="#"]')];
  if (!links.length || !('IntersectionObserver' in window)) return;
  const mapa = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => a.classList.remove('active'));
      const a = mapa.get(en.target.id);
      if (a) a.classList.add('active');
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  mapa.forEach((_, id) => { const s = document.getElementById(id); if (s) obs.observe(s); });
})();
