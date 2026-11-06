// US-10 · Cronograma de referencia: cada semana del Sprint muestra el evento que la caracteriza.
(() => {
  const SEMANAS = {
    1: {
      label: 'Evento seleccionado · Sprint Planning',
      titulo: '¿Por qué es valioso este Sprint y cómo lo lograremos?',
      texto: 'Todo el Scrum Team acuerda un Sprint Goal, selecciona trabajo del Product Backlog y define un plan inicial. Los Developers deciden cuánto pueden realizar según capacidad, desempeño pasado y Definition of Done.',
      resultado: 'Sprint Backlog: objetivo, elementos seleccionados y plan de entrega.',
      max: 'Máximo 8 horas', maxTexto: 'Para un Sprint de un mes; normalmente menos para Sprints más cortos.',
    },
    2: {
      label: 'Evento seleccionado · Daily Scrum',
      titulo: '¿Cómo avanzamos hoy hacia el Sprint Goal?',
      texto: 'Los Developers construyen y prueban los elementos seleccionados. Cada día inspeccionan el avance y adaptan el Sprint Backlog; los impedimentos se hacen visibles para resolverlos pronto.',
      resultado: 'Plan actualizado para el siguiente día de trabajo y trabajo que cumple la Definition of Done.',
      max: 'Máximo 15 minutos', maxTexto: 'Cada día de trabajo, a la misma hora y en el mismo lugar.',
    },
    3: {
      label: 'Actividad seleccionada · Refinamiento',
      titulo: '¿Qué debemos ajustar para cumplir el objetivo?',
      texto: 'El equipo integra lo construido y adapta el plan sin poner en riesgo el Sprint Goal. En paralelo, Product Owner y Developers refinan elementos del Product Backlog para próximos Sprints.',
      resultado: 'Incremento integrado y elementos del Product Backlog más claros, ordenados y estimados.',
      max: 'Actividad continua', maxTexto: 'No es un evento formal; suele ocupar una parte pequeña de la capacidad.',
    },
    4: {
      label: 'Eventos seleccionados · Sprint Review y Retrospective',
      titulo: '¿Qué logramos y cómo trabajaremos mejor?',
      texto: 'En la Review, el equipo y los interesados inspeccionan el Incremento y adaptan el Product Backlog. En la Retrospective, el Scrum Team acuerda mejoras de calidad y eficacia para el siguiente Sprint.',
      resultado: 'Product Backlog adaptado y mejoras concretas para el próximo Sprint.',
      max: 'Máximo 4 h + 3 h', maxTexto: 'Review y Retrospective para un Sprint de un mes; menos para Sprints más cortos.',
    },
  };

  const botones = document.querySelectorAll('#semanas .week');
  if (!botones.length) return;
  const $ = (id) => document.getElementById(id);

  function mostrar(n) {
    const s = SEMANAS[n];
    botones.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.semana === String(n))));
    $('ev-label').textContent = s.label;
    $('ev-titulo').textContent = s.titulo;
    $('ev-texto').textContent = s.texto;
    $('ev-resultado').textContent = s.resultado;
    $('ev-max').textContent = s.max;
    $('ev-max-texto').textContent = s.maxTexto;
    if (window.Transiciones) Transiciones.reproducir($('evento'));
  }

  botones.forEach((b) => b.addEventListener('click', () => mostrar(b.dataset.semana)));
})();
