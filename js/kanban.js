// US-11 · Tablero Kanban didáctico: arrastrar y soltar o botones, con límites WIP.
// El estado se guarda en el navegador (localStorage) para que el tablero persista al recargar.
(() => {
  const COLUMNAS = [
    { id: 'todo', nombre: 'Por hacer', wip: null },
    { id: 'doing', nombre: 'En proceso', wip: 2 },
    { id: 'review', nombre: 'En revisión', wip: 2 },
    { id: 'done', nombre: 'Hecho', wip: null },
  ];
  const INICIAL = [
    { id: 'c1', titulo: 'Corregir enlaces rotos', tipo: 'Defecto', col: 'todo' },
    { id: 'c2', titulo: 'Agregar términos al glosario', tipo: 'Contenido', col: 'todo' },
    { id: 'c3', titulo: 'Mejorar contraste de botones', tipo: 'Accesibilidad', col: 'todo' },
    { id: 'c4', titulo: 'Buscador del glosario', tipo: 'Funcionalidad', col: 'doing' },
    { id: 'c5', titulo: 'Diagrama del Sprint', tipo: 'Ilustración', col: 'doing' },
    { id: 'c6', titulo: 'Página de preguntas frecuentes', tipo: 'Contenido', col: 'review' },
    { id: 'c7', titulo: 'Pie de página', tipo: 'Diseño', col: 'done' },
  ];
  const CLAVE = 'sgc-kanban-v1';
  const board = document.getElementById('board');
  const msg = document.getElementById('mensaje');
  let tarjetas = cargar();

  function cargar() {
    try {
      const g = JSON.parse(localStorage.getItem(CLAVE));
      if (Array.isArray(g) && g.length === INICIAL.length) return g;
    } catch (e) { /* sin almacenamiento disponible */ }
    return INICIAL.map((t) => ({ ...t }));
  }
  function guardar() {
    try { localStorage.setItem(CLAVE, JSON.stringify(tarjetas)); } catch (e) { /* ignorar */ }
  }
  const enCol = (id) => tarjetas.filter((t) => t.col === id);
  const idx = (id) => COLUMNAS.findIndex((c) => c.id === id);

  function aviso(texto, warn) {
    msg.textContent = texto;
    msg.classList.toggle('warn', !!warn);
  }

  function mover(tarjeta, destino) {
    if (tarjeta.col === destino) return;
    const col = COLUMNAS[idx(destino)];
    if (col.wip !== null && enCol(destino).length >= col.wip) {
      aviso(`«${col.nombre}» alcanzó su límite WIP (${col.wip}). Termina o destraba una tarjeta antes de empezar otra.`, true);
      return;
    }
    tarjeta.col = destino;
    guardar();
    aviso(`«${tarjeta.titulo}» se movió a ${col.nombre}.`);
    render();
    const btn = board.querySelector(`[data-card="${tarjeta.id}"]`);
    if (btn) btn.focus();
  }

  function render() {
    board.innerHTML = '';
    COLUMNAS.forEach((c, i) => {
      const cards = enCol(c.id);
      const col = document.createElement('section');
      col.className = 'column' + (c.wip !== null && cards.length >= c.wip ? ' full' : '');
      col.setAttribute('aria-label', `${c.nombre}, ${cards.length} tarjetas${c.wip ? `, límite ${c.wip}` : ''}`);
      col.dataset.col = c.id;
      col.innerHTML = `<div class="column-head"><span></span><span class="wip">${c.wip ? `WIP ${cards.length}/${c.wip}` : cards.length}</span></div>`;
      col.querySelector('.column-head span').textContent = c.nombre;

      cards.forEach((t) => {
        const card = document.createElement('article');
        card.className = 'k-card';
        card.draggable = true;
        card.dataset.id = t.id;
        card.innerHTML = `<strong></strong><small></small><div class="k-actions">
          <button type="button" data-dir="-1" aria-label="Mover a la columna anterior">←</button>
          <button type="button" data-dir="1" aria-label="Mover a la columna siguiente">→</button></div>`;
        card.querySelector('strong').textContent = t.titulo;
        card.querySelector('small').textContent = t.tipo;
        const [ant, sig] = card.querySelectorAll('button');
        ant.disabled = i === 0;
        sig.disabled = i === COLUMNAS.length - 1;
        sig.dataset.card = t.id;
        ant.addEventListener('click', () => mover(t, COLUMNAS[i - 1].id));
        sig.addEventListener('click', () => mover(t, COLUMNAS[i + 1].id));
        card.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('text/plain', t.id);
          card.classList.add('dragging');
        });
        card.addEventListener('dragend', () => card.classList.remove('dragging'));
        col.appendChild(card);
      });

      col.addEventListener('dragover', (e) => { e.preventDefault(); col.classList.add('over'); });
      col.addEventListener('dragleave', () => col.classList.remove('over'));
      col.addEventListener('drop', (e) => {
        e.preventDefault();
        col.classList.remove('over');
        const t = tarjetas.find((x) => x.id === e.dataTransfer.getData('text/plain'));
        if (t) mover(t, c.id);
      });
      board.appendChild(col);
    });
  }

  document.getElementById('reiniciar').addEventListener('click', () => {
    tarjetas = INICIAL.map((t) => ({ ...t }));
    guardar();
    aviso('El tablero volvió a su estado inicial.');
    render();
  });

  render();
})();
