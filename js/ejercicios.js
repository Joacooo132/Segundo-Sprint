// US-15 · Botón «Mostrar/Ocultar solución» con estado dinámico y filtro por tema.
// Las soluciones empiezan ocultas (atributo hidden en el HTML).
(() => {
  document.querySelectorAll('[data-sol]').forEach((btn) => {
    const sol = document.getElementById(btn.dataset.sol);
    if (!sol) return;
    sol.hidden = true;
    btn.addEventListener('click', () => {
      const mostrar = sol.hidden;
      sol.hidden = !mostrar;
      btn.setAttribute('aria-expanded', String(mostrar));
      btn.textContent = mostrar ? 'Ocultar solución' : 'Mostrar solución';
      btn.classList.toggle('primary', mostrar);
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
