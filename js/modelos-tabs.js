// US-07 · Pestañas de modelos tradicionales: solo se muestra el modelo elegido
// (su diagrama y su información). Cascada aparece seleccionado al entrar.
(() => {
  const tabs = [...document.querySelectorAll('[data-modelos] [role="tab"]')];
  if (!tabs.length) return;
  const panel = (tab) => document.getElementById(tab.getAttribute('aria-controls'));

  function mostrar(tab, { foco = false, actualizarUrl = true } = {}) {
    tabs.forEach((t) => {
      const activo = t === tab;
      t.setAttribute('aria-selected', String(activo));
      t.tabIndex = activo ? 0 : -1;
      panel(t).hidden = !activo;
    });
    const p = panel(tab);
    p.classList.remove('aparecer');
    void p.offsetWidth; // reinicia la animación de entrada
    p.classList.add('aparecer');
    if (foco) tab.focus();
    if (actualizarUrl) history.replaceState(null, '', `#${p.id}`);
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => mostrar(tab));
    // Flechas, Inicio y Fin para moverse entre pestañas con el teclado.
    tab.addEventListener('keydown', (e) => {
      const destino = {
        ArrowRight: tabs[(i + 1) % tabs.length],
        ArrowLeft: tabs[(i - 1 + tabs.length) % tabs.length],
        Home: tabs[0],
        End: tabs[tabs.length - 1],
      }[e.key];
      if (destino) {
        e.preventDefault();
        mostrar(destino, { foco: true });
      }
    });
  });

  // Si se entra con #modelo-v o #iterativo en la URL, abre ese modelo.
  const desdeUrl = tabs.find((t) => `#${t.getAttribute('aria-controls')}` === location.hash);
  mostrar(desdeUrl || tabs[0], { actualizarUrl: false });
})();
