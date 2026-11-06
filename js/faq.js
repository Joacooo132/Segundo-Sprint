// US-13 · Acordeón con animación de altura y filtro por categoría.
(() => {
  document.querySelectorAll('#faq details').forEach((det) => {
    const summary = det.querySelector('summary');
    const body = det.querySelector('.acc-body');
    summary.addEventListener('click', (e) => {
      e.preventDefault();
      if (det.classList.contains('animating')) return;
      const abriendo = !det.open;
      if (abriendo) det.open = true;
      // Se animan la altura y el relleno inferior juntos para que no haya saltos.
      const cs = getComputedStyle(body);
      const abierto = { height: `${body.scrollHeight}px`, paddingBottom: cs.paddingBottom, opacity: 1 };
      const cerrado = { height: '0px', paddingBottom: '0px', opacity: 0 };
      det.classList.add('animating');
      body.style.overflow = 'hidden';
      const anim = body.animate(abriendo ? [cerrado, abierto] : [abierto, cerrado], {
        duration: 350,
        easing: 'cubic-bezier(.25, .8, .25, 1)',
      });
      anim.onfinish = () => {
        det.classList.remove('animating');
        body.style.overflow = '';
        if (!abriendo) det.open = false;
      };
    });
  });

  const chips = document.querySelectorAll('#categorias .chip');
  chips.forEach((chip) => chip.addEventListener('click', () => {
    const cat = chip.dataset.cat;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    document.querySelectorAll('#faq details').forEach((d) => {
      d.hidden = cat !== 'todas' && d.dataset.cat !== cat;
    });
  }));
})();
