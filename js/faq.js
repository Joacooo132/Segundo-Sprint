// US-13 · Acordeón con animación de altura y filtro por categoría.
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('#faq details.acc').forEach((det) => {
    const summary = det.querySelector('summary');
    const body = det.querySelector('.acc-body');
    summary.addEventListener('click', (e) => {
      if (reduce) return; // comportamiento nativo sin animación
      e.preventDefault();
      if (det.classList.contains('animating')) return;
      const abriendo = !det.open;
      if (abriendo) det.open = true;
      const alto = body.scrollHeight;
      body.style.height = abriendo ? '0px' : `${alto}px`;
      det.classList.add('animating');
      requestAnimationFrame(() => {
        body.style.height = abriendo ? `${alto}px` : '0px';
      });
      // Se usa un temporizador (igual a la transición CSS de .3s) por si transitionend no se dispara.
      setTimeout(() => {
        det.classList.remove('animating');
        body.style.height = '';
        if (!abriendo) det.open = false;
      }, 320);
    });
  });

  const chips = document.querySelectorAll('#categorias .chip');
  chips.forEach((chip) => chip.addEventListener('click', () => {
    const cat = chip.dataset.cat;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    document.querySelectorAll('#faq details.acc').forEach((d) => {
      d.hidden = cat !== 'todas' && d.dataset.cat !== cat;
    });
  }));
})();
