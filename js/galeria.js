// US-07 / US-09 · Lightbox reutilizable: cualquier botón [data-zoom] amplía su <figure> en pantalla completa.
(() => {
  let ultimoFoco = null;

  function cerrar(box) {
    box.remove();
    document.body.classList.remove('no-scroll');
    if (ultimoFoco) ultimoFoco.focus();
  }

  function abrir(figure, boton) {
    ultimoFoco = boton;
    const box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    const titulo = figure.querySelector('h3');
    box.setAttribute('aria-label', titulo ? `Vista ampliada: ${titulo.textContent}` : 'Vista ampliada');

    const inner = document.createElement('div');
    inner.className = 'lightbox-inner';
    const cerrarBtn = document.createElement('button');
    cerrarBtn.type = 'button';
    cerrarBtn.className = 'btn lightbox-close';
    cerrarBtn.textContent = 'Cerrar ✕';
    const copia = figure.cloneNode(true);
    copia.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
    inner.append(cerrarBtn, copia);
    box.appendChild(inner);

    cerrarBtn.addEventListener('click', () => cerrar(box));
    box.addEventListener('click', (e) => { if (e.target === box) cerrar(box); });
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') cerrar(box);
      if (e.key === 'Tab') { e.preventDefault(); cerrarBtn.focus(); }
    });

    document.body.appendChild(box);
    document.body.classList.add('no-scroll');
    cerrarBtn.focus();
  }

  document.querySelectorAll('[data-zoom]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const fig = btn.closest('figure') || document.getElementById(btn.dataset.zoom);
      if (fig) abrir(fig, btn);
    });
    // Clic directo sobre el diagrama también amplía.
    const fig = btn.closest('figure');
    const diag = fig && fig.querySelector('.diagram-area');
    if (diag) {
      diag.style.cursor = 'zoom-in';
      diag.addEventListener('click', () => abrir(fig, btn));
    }
  });
})();
