// US-14 · Apertura segura de enlaces externos y filtro por tipo de recurso.
(() => {
  // Todo enlace a otro dominio se abre en pestaña nueva con rel="noopener noreferrer".
  document.querySelectorAll('a[href^="http"]').forEach((a) => {
    if (new URL(a.href).origin === location.origin) return;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    if (!a.querySelector('.sr-only')) {
      const aviso = document.createElement('span');
      aviso.className = 'sr-only';
      aviso.textContent = ' (se abre en una pestaña nueva)';
      a.appendChild(aviso);
    }
  });

  const chips = document.querySelectorAll('#tipos .chip');
  const cards = document.querySelectorAll('#recursos [data-tipo]');
  const total = document.getElementById('recursos-total');

  function filtrar(tipo) {
    let n = 0;
    cards.forEach((c) => {
      const ver = tipo === 'todos' || c.dataset.tipo === tipo;
      c.hidden = !ver;
      if (ver) n++;
    });
    chips.forEach((ch) => ch.setAttribute('aria-pressed', String(ch.dataset.tipo === tipo)));
    total.textContent = `${n} ${n === 1 ? 'recurso' : 'recursos'}`;
  }

  chips.forEach((ch) => ch.addEventListener('click', () => filtrar(ch.dataset.tipo)));
  filtrar('todos');
})();
