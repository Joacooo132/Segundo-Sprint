// US-09 / US-11 · Tablero Kanban: "Mover tarjeta →" pasa la tarjeta a la columna siguiente
// solo si esa columna tiene capacidad (atributo data-wip). Si está llena, se muestra un aviso.
(() => {
  document.querySelectorAll('[data-tablero]').forEach((tablero) => {
    const cols = [...tablero.querySelectorAll('.kb-col')];
    const aviso = document.getElementById(tablero.dataset.aviso || '');

    const tarjetas = (col) => [...col.querySelectorAll('.kb-card')];

    function actualizar() {
      cols.forEach((col) => {
        const n = tarjetas(col).length;
        const cont = col.querySelector('[data-count]');
        const wip = Number(col.dataset.wip || 0);
        if (wip) {
          cont.textContent = `${n} / ${wip} · WIP`;
          const msg = col.querySelector('.kb-msg');
          if (msg) msg.textContent = n >= wip
            ? 'Límite alcanzado: terminar antes de empezar.'
            : 'Hay capacidad: se puede tirar de una tarea preparada.';
        } else {
          cont.textContent = n;
        }
      });
    }

    function terminar(card) {
      const btn = card.querySelector('button');
      if (btn) btn.remove();
      const ok = document.createElement('span');
      ok.className = 'done';
      ok.textContent = '✓ Criterios cumplidos';
      card.appendChild(ok);
    }

    function decir(texto, error) {
      if (!aviso) return;
      aviso.hidden = false;
      aviso.classList.toggle('warn', error);
      aviso.classList.toggle('ok', !error);
      aviso.querySelector('strong').textContent = error ? 'Muestra de aviso · límite WIP alcanzado' : 'Tarjeta movida';
      aviso.querySelector('p').textContent = texto;
      if (window.Transiciones) Transiciones.reproducir(aviso);
    }

    tablero.addEventListener('click', (e) => {
      const btn = e.target.closest('.kb-card button');
      if (!btn) return;
      const card = btn.closest('.kb-card');
      const col = card.closest('.kb-col');
      const destino = cols[cols.indexOf(col) + 1];
      if (!destino) return;
      const nombre = card.querySelector('strong').textContent;
      const wip = Number(destino.dataset.wip || 0);
      if (wip && tarjetas(destino).length >= wip) {
        destino.classList.add('lleno');
        setTimeout(() => destino.classList.remove('lleno'), 1200);
        decir(`No se puede incorporar «${nombre}» a ${destino.dataset.nombre}: hay ${wip} tarjetas y el límite es ${wip}. Primero termina una tarea o ayuda a desbloquearla. No aumentes el límite solo para ocultar el atasco.`, true);
        return;
      }
      const lista = destino.querySelector('.kb-cards');
      lista.appendChild(card);
      if (cols.indexOf(destino) === cols.length - 1) terminar(card);
      else card.querySelector('button').focus();
      if (window.Transiciones) Transiciones.reproducir(card);
      decir(`«${nombre}» pasó a ${destino.dataset.nombre}.`, false);
      actualizar();
    });

    actualizar();
  });
})();
