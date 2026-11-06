// US-15 · "Mostrar solución" con estado dinámico y filtro por nivel.
// Las soluciones empiezan ocultas (atributo hidden en el HTML).
(() => {
  document.querySelectorAll('[data-sol]').forEach((btn) => {
    const sol = document.getElementById(btn.dataset.sol);
    if (!sol) return;
    const estado = btn.closest('.ex-card')?.querySelector('.estado');
    sol.hidden = true;
    btn.addEventListener('click', () => {
      // El estado se lee del botón para que un doble clic durante la animación funcione bien.
      const mostrar = btn.getAttribute('aria-expanded') !== 'true';
      if (window.Transiciones) Transiciones.alternar(sol, mostrar);
      else sol.hidden = !mostrar;
      btn.setAttribute('aria-expanded', String(mostrar));
      btn.textContent = mostrar ? 'Ocultar solución −' : 'Mostrar solución +';
      if (estado) estado.textContent = mostrar ? 'Solución visible' : 'Solución oculta';
    });
  });

  const chips = document.querySelectorAll('#temas .chip');
  chips.forEach((chip) => chip.addEventListener('click', () => {
    const tema = chip.dataset.tema;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    document.querySelectorAll('#ejercicios [data-tema]').forEach((card) => {
      card.hidden = tema !== 'todos' && card.dataset.tema !== tema;
    });
  }));
})();
