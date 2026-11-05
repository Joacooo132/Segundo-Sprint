// US-18 · Comparador de metodologías: la tabla se arma con los enfoques elegidos (mínimo dos).
(() => {
  const DIMENSIONES = ['Enfoque', 'Requisitos', 'Roles', 'Cadencia', 'Flexibilidad', 'Entregas', 'Validación', 'Contexto adecuado', 'Limitaciones'];

  const ENFOQUES = [
    { id: 'cascada', nombre: 'Cascada', datos: [
      'Secuencial, con fases y entregables definidos.',
      'Se busca definirlos y aprobarlos al inicio; cambios mediante control acordado.',
      'Se definen según la organización; el modelo no prescribe un equipo único.',
      'Avance por fases e hitos de aprobación.',
      'Los cambios tardíos suelen exigir revisar fases y entregables previos.',
      'Habitualmente al completar las fases del ciclo; depende del plan.',
      'Planificada en el ciclo; la comprobación del producto completo suele llegar más tarde.',
      'Requisitos estables, alcance conocido y necesidad de trazabilidad por fases.',
      'Feedback de uso más tardío y alto coste de cambiar decisiones ya aprobadas.',
    ] },
    { id: 'scrum', nombre: 'Scrum', datos: [
      'Marco empírico e iterativo para productos complejos.',
      'Product Backlog emergente y ordenado; el Sprint Goal orienta el trabajo.',
      'Product Owner, Scrum Master y Developers con responsabilidades explícitas.',
      'Sprints de duración fija de un mes o menos.',
      'Se adapta el Product Backlog y el plan; no se pone en riesgo el Sprint Goal.',
      'Incremento utilizable en cada Sprint; puede entregarse antes de la Review.',
      'Feedback frecuente; Review con interesados y calidad según Definition of Done.',
      'Producto complejo, objetivo compartido y equipo multifuncional estable.',
      'Requiere autogestión, colaboración real y objetivos claros; no resuelve por sí solo la ingeniería.',
    ] },
    { id: 'kanban', nombre: 'Kanban', datos: [
      'Gestión del flujo de valor con sistema pull.',
      'Se prioriza la demanda y se incorpora según capacidad y políticas explícitas.',
      'No exige roles nuevos. Puede aplicarse sobre los roles existentes.',
      'Flujo continuo; revisiones y cadencias según contexto.',
      'Se adapta la selección de trabajo cuando hay capacidad; se respetan políticas WIP.',
      'Entregas cuando el trabajo cumple las políticas de terminado.',
      'Feedback y validación integrados en el flujo y en sus políticas de salida.',
      'Demanda continua o variable, soporte, mantenimiento y mejora de procesos.',
      'Un tablero sin políticas ni control WIP no mejora el flujo. No aporta por sí solo una visión de producto.',
    ] },
    { id: 'v', nombre: 'Modelo en V', datos: [
      'Secuencial; cada fase de desarrollo tiene una fase de prueba asociada.',
      'Definidos al inicio y vinculados a las pruebas de aceptación.',
      'Analistas, desarrolladores y testers con responsabilidades por nivel.',
      'Avance por fases; la verificación se planifica desde el comienzo.',
      'Baja: un cambio afecta a la especificación y a sus pruebas correspondientes.',
      'Al final del ciclo, tras superar los niveles de prueba.',
      'Verificación y validación planificadas por nivel: unidad, integración, sistema y aceptación.',
      'Sistemas críticos, regulados o con alta exigencia de trazabilidad.',
      'Poca adaptación al cambio y feedback de usuarios tardío.',
    ] },
    { id: 'iterativo', nombre: 'Iterativo / Incremental', datos: [
      'El producto crece en incrementos que se refinan en iteraciones.',
      'Se priorizan por incremento; pueden ajustarse entre iteraciones.',
      'Según la organización; suele combinar roles de proyecto tradicionales.',
      'Iteraciones planificadas, de duración variable según el plan.',
      'Media: los cambios se incorporan en incrementos siguientes.',
      'Versiones parciales utilizables al cerrar cada incremento.',
      'Revisión al final de cada iteración con usuarios o clientes.',
      'Proyectos medianos o grandes que pueden dividirse en partes con valor.',
      'Requiere una arquitectura que soporte el crecimiento y buena gestión de la integración.',
    ] },
    { id: 'xp', nombre: 'XP', datos: [
      'Prácticas de ingeniería ágiles para responder rápido al cambio con calidad.',
      'Historias de usuario priorizadas por el cliente en cada iteración.',
      'Cliente presente, programadores, coach y tracker.',
      'Iteraciones cortas de una a dos semanas e integración continua.',
      'Alta: diseño simple y refactorización facilitan el cambio.',
      'Pequeñas versiones frecuentes.',
      'Pruebas automatizadas, TDD y pruebas de aceptación del cliente.',
      'Equipos pequeños con requisitos cambiantes y cliente disponible.',
      'Exige disciplina técnica y participación constante del cliente.',
    ] },
  ];

  const seleccion = new Set(['cascada', 'scrum', 'kanban']);
  const $ = (id) => document.getElementById(id);

  function listaNombres(ids) {
    const n = ENFOQUES.filter((e) => ids.includes(e.id)).map((e) => e.nombre);
    return n.length > 1 ? `${n.slice(0, -1).join(', ')} y ${n[n.length - 1]}` : n.join('');
  }
  const NUMEROS = ['Ningún', 'Un', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis'];

  function renderCasillas() {
    const form = $('seleccion');
    ENFOQUES.forEach((e) => {
      const label = document.createElement('label');
      label.className = 'check-option';
      label.innerHTML = `<input type="checkbox" value="${e.id}"><span class="box" aria-hidden="true">✓</span><span></span>`;
      label.lastChild.textContent = e.nombre;
      const input = label.querySelector('input');
      input.checked = seleccion.has(e.id);
      input.addEventListener('change', () => {
        input.checked ? seleccion.add(e.id) : seleccion.delete(e.id);
        actualizar();
      });
      form.appendChild(label);
    });
  }

  function actualizar() {
    const ids = ENFOQUES.filter((e) => seleccion.has(e.id)).map((e) => e.id);
    const n = ids.length;
    const suficiente = n >= 2;

    $('seleccion-etiqueta').textContent = `Selección principal · ${n} ${n === 1 ? 'seleccionado' : 'seleccionados'}`;
    $('aviso').hidden = suficiente;
    $('aside-titulo').textContent = `${NUMEROS[n]} ${n === 1 ? 'enfoque seleccionado' : 'enfoques seleccionados'}`;
    $('aside-texto').textContent = n
      ? `${listaNombres(ids)}. La tabla refleja esta selección; el mínimo para comparar es de dos enfoques.`
      : 'Todavía no elegiste enfoques. El mínimo para comparar es de dos.';

    const btn = $('btn-comparar');
    btn.textContent = suficiente ? `Comparar ${n} enfoques` : 'Comparar · no disponible';
    btn.classList.toggle('is-disabled', !suficiente);
    btn.setAttribute('aria-disabled', String(!suficiente));
    $('seleccion-resumen').textContent = suficiente
      ? `La tabla siguiente corresponde a ${listaNombres(ids)}.`
      : 'Con menos de dos enfoques no se muestra una tabla comparativa.';

    $('comparativa').hidden = !suficiente;
    if (!suficiente) return;
    if (window.Transiciones) Transiciones.reproducir($('tabla-cabecera').closest('table'));

    $('comparativa-titulo').textContent = `${listaNombres(ids)}: diferencias esenciales`;
    const elegidos = ENFOQUES.filter((e) => seleccion.has(e.id));
    const cab = $('tabla-cabecera');
    cab.innerHTML = '<th scope="col">Dimensión</th>';
    elegidos.forEach((e) => {
      const th = document.createElement('th');
      th.scope = 'col';
      th.textContent = e.nombre;
      cab.appendChild(th);
    });
    const cuerpo = $('tabla-cuerpo');
    cuerpo.innerHTML = '';
    DIMENSIONES.forEach((d, i) => {
      const tr = document.createElement('tr');
      const th = document.createElement('td');
      th.textContent = d;
      tr.appendChild(th);
      elegidos.forEach((e) => {
        const td = document.createElement('td');
        td.textContent = e.datos[i];
        tr.appendChild(td);
      });
      cuerpo.appendChild(tr);
    });
  }

  $('btn-comparar').addEventListener('click', (ev) => {
    if (seleccion.size < 2) ev.preventDefault();
  });

  renderCasillas();
  actualizar();
})();
