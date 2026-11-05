// Calidad · Interacciones de las secciones del diseño:
// pestañas ISO 9126 / 25000, tarjetas de técnicas desplegables y filtro de herramientas.
(() => {
  const animar = (el, mostrar) => {
    if (window.Transiciones) Transiciones.alternar(el, mostrar);
    else el.hidden = !mostrar;
  };

  // --- Pestañas ISO ---
  const tabs = [...document.querySelectorAll('.iso-tab')];
  const panel = (t) => document.getElementById(t.getAttribute('aria-controls'));

  function elegirTab(tab, foco) {
    tabs.forEach((t) => {
      const activa = t === tab;
      t.setAttribute('aria-selected', String(activa));
      t.tabIndex = activa ? 0 : -1;
      panel(t).hidden = !activa;
    });
    if (window.Transiciones) Transiciones.reproducir(panel(tab));
    if (foco) tab.focus();
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => elegirTab(tab));
    tab.addEventListener('keydown', (e) => {
      const destino = { ArrowRight: tabs[(i + 1) % tabs.length], ArrowLeft: tabs[(i - 1 + tabs.length) % tabs.length] }[e.key];
      if (destino) {
        e.preventDefault();
        elegirTab(destino, true);
      }
    });
  });

  // --- Técnicas desplegables ---
  document.querySelectorAll('.tec-toggle').forEach((btn) => {
    const card = btn.closest('.tec-card');
    const cuerpo = document.getElementById(btn.getAttribute('aria-controls'));
    const nombre = card.querySelector('h3').textContent;
    btn.addEventListener('click', () => {
      const abrir = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(abrir));
      btn.setAttribute('aria-label', `${abrir ? 'Ocultar' : 'Mostrar'} ejemplo de ${nombre}`);
      card.classList.toggle('abierta', abrir);
      animar(cuerpo, abrir);
    });
  });

  // --- Filtro de herramientas ---
  const filtros = document.querySelectorAll('.herr-filtro');
  const tarjetas = document.querySelectorAll('.herr-card');
  const estado = document.getElementById('herr-estado');
  filtros.forEach((f) => f.addEventListener('click', () => {
    const cat = f.dataset.cat;
    filtros.forEach((x) => x.setAttribute('aria-pressed', String(x === f)));
    let n = 0;
    tarjetas.forEach((t) => {
      const ver = cat === 'todas' || t.dataset.cat === cat;
      t.hidden = !ver;
      if (ver) n += 1;
    });
    if (estado) estado.textContent = `Mostrando ${n} ${n === 1 ? 'herramienta' : 'herramientas'}.`;
  }));
})();
