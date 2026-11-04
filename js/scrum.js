// US-10 · Cronograma interactivo del Sprint (1 a 4 semanas).
// Duraciones máximas de la Guía de Scrum para un Sprint de un mes, escaladas proporcionalmente.
(() => {
  const EVENTOS = {
    planning: {
      nombre: 'Sprint Planning', cuando: 'Día 1 · al inicio del Sprint', maxMes: 8, unidad: 'h',
      objetivo: 'El Scrum Team define por qué el Sprint es valioso (Sprint Goal), qué elementos del Product Backlog se pueden terminar y cómo se hará el trabajo.',
      quienes: 'Todo el Scrum Team', salida: 'Sprint Goal y Sprint Backlog', dias: (n) => [1],
    },
    daily: {
      nombre: 'Daily Scrum', cuando: 'Cada día, a la misma hora y lugar', fijo: '15 min',
      objetivo: 'Los Developers inspeccionan el avance hacia el Sprint Goal y adaptan el Sprint Backlog. No es una reunión de reporte al jefe.',
      quienes: 'Developers', salida: 'Plan para las próximas 24 h', dias: (n) => Array.from({ length: n }, (_, i) => i + 1),
    },
    refinement: {
      nombre: 'Refinamiento del Product Backlog', cuando: 'Actividad continua durante el Sprint', fijo: '≈10 % de la capacidad',
      objetivo: 'Dividir y detallar elementos del Product Backlog, agregar descripciones, orden y estimaciones, para que estén listos para próximos Sprints.',
      quienes: 'Product Owner y Developers', salida: 'Elementos listos para planificar', dias: (n) => Array.from({ length: n }, (_, i) => i + 1).filter((d) => d % 5 === 3),
    },
    review: {
      nombre: 'Sprint Review', cuando: 'Último día · antes de la Retrospective', maxMes: 4, unidad: 'h',
      objetivo: 'Inspeccionar el resultado del Sprint con los interesados y decidir las próximas adaptaciones. Es una sesión de trabajo, no una presentación.',
      quienes: 'Scrum Team e interesados', salida: 'Product Backlog actualizado', dias: (n) => [n],
    },
    retro: {
      nombre: 'Sprint Retrospective', cuando: 'Último día · cierra el Sprint', maxMes: 3, unidad: 'h',
      objetivo: 'Revisar cómo fue el Sprint en personas, interacciones, procesos, herramientas y Definition of Done, y acordar mejoras concretas.',
      quienes: 'Todo el Scrum Team', salida: 'Mejoras para el próximo Sprint', dias: (n) => [n],
    },
  };

  let semanas = 2;
  let evento = 'planning';
  const $ = (id) => document.getElementById(id);

  function duracion(ev) {
    if (ev.fijo) return ev.fijo;
    const horas = (ev.maxMes * semanas) / 4;
    return Number.isInteger(horas) ? `${horas} h` : `${Math.floor(horas)} h ${Math.round((horas % 1) * 60)} min`;
  }

  function render() {
    const dias = semanas * 5;
    const ev = EVENTOS[evento];
    $('duracion-texto').textContent = `Sprint de ${semanas} ${semanas === 1 ? 'semana' : 'semanas'} · ${dias} días hábiles`;
    document.querySelectorAll('#duracion .chip').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.semanas) === semanas)));
    document.querySelectorAll('#cronograma .event-btn').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.evento === evento)));

    const marcados = new Set(ev.dias(dias));
    const cont = $('dias');
    cont.style.setProperty('--days', dias);
    cont.innerHTML = '';
    for (let d = 1; d <= dias; d++) {
      const s = document.createElement('span');
      s.textContent = `D${d}`;
      if (marcados.has(d)) s.className = 'ev';
      cont.appendChild(s);
    }

    $('ev-nombre').textContent = ev.nombre;
    $('ev-cuando').textContent = ev.cuando;
    $('ev-objetivo').textContent = ev.objetivo;
    $('ev-duracion').textContent = duracion(ev);
    $('ev-quienes').textContent = ev.quienes;
    $('ev-salida').textContent = ev.salida;
  }

  document.querySelectorAll('#duracion .chip').forEach((b) => b.addEventListener('click', () => { semanas = Number(b.dataset.semanas); render(); }));
  document.querySelectorAll('#cronograma .event-btn').forEach((b) => b.addEventListener('click', () => { evento = b.dataset.evento; render(); }));
  render();
})();
