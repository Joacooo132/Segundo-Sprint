// US-12 · Glosario: listado A-Z, índice por letras y buscador en tiempo real.
// La búsqueda ignora mayúsculas, tildes y caracteres especiales.
(() => {
  const TERMINOS = [
    ['Aseguramiento de la calidad (QA)', 'Conjunto de actividades planificadas para dar confianza de que el proceso y el producto cumplirán los requisitos de calidad.'],
    ['Artefacto', 'En Scrum, elemento que representa trabajo o valor: Product Backlog, Sprint Backlog e Incremento.'],
    ['Backlog', 'Lista ordenada de trabajo pendiente. En Scrum existen el Product Backlog y el Sprint Backlog.'],
    ['Bug (defecto)', 'Error en el software que produce un resultado incorrecto o inesperado respecto de lo especificado.'],
    ['Calidad del software', 'Grado en que un producto satisface necesidades explícitas e implícitas cuando se usa en condiciones determinadas.'],
    ['Cascada', 'Modelo de desarrollo secuencial donde cada fase empieza cuando termina y se aprueba la anterior.'],
    ['Ciclo de vida (SDLC)', 'Etapas por las que pasa el software: requisitos, diseño, implementación, pruebas, despliegue y mantenimiento.'],
    ['Cycle time', 'Tiempo que transcurre desde que se empieza a trabajar en un elemento hasta que se termina.'],
    ['Daily Scrum', 'Evento diario de 15 minutos en el que los Developers revisan el avance hacia el Sprint Goal y adaptan el plan.'],
    ['Definition of Done', 'Descripción formal del estado que debe cumplir un Incremento para considerarse terminado.'],
    ['Deuda técnica', 'Costo futuro de retrabajo causado por elegir hoy una solución rápida en lugar de una mejor.'],
    ['Épica', 'Historia de usuario grande que debe dividirse en historias más pequeñas antes de construirse.'],
    ['Estimación', 'Valoración del esfuerzo o la complejidad de un trabajo, por ejemplo en puntos de historia.'],
    ['Historia de usuario', 'Descripción breve de una necesidad desde la perspectiva del usuario: «Como…, quiero…, para…».'],
    ['Incremento', 'Resultado utilizable de un Sprint que suma valor al producto y cumple la Definition of Done.'],
    ['Integración continua', 'Práctica de integrar cambios al repositorio con frecuencia y verificar cada integración con pruebas automáticas.'],
    ['ISO/IEC 25010', 'Norma de la familia ISO 25000 que define el modelo de calidad del producto de software (sucesora de ISO 9126).'],
    ['Iteración', 'Ciclo de trabajo de duración acotada que produce una versión mejorada del producto.'],
    ['Kanban', 'Método para gestionar y mejorar el flujo de trabajo visualizándolo y limitando el trabajo en curso.'],
    ['Lead time', 'Tiempo desde que se solicita un trabajo hasta que se entrega al usuario.'],
    ['Manifiesto Ágil', 'Declaración de 2001 con 4 valores y 12 principios para desarrollar software de forma ágil.'],
    ['Métrica', 'Medida cuantitativa de un atributo del proceso o del producto, como la densidad de defectos.'],
    ['Modelo en V', 'Modelo secuencial que asocia cada fase de desarrollo con un nivel de prueba correspondiente.'],
    ['Product Owner', 'Responsable de maximizar el valor del producto y de gestionar el Product Backlog.'],
    ['Prueba de regresión', 'Prueba que verifica que un cambio no rompió funcionalidades que antes funcionaban.'],
    ['Prueba unitaria', 'Prueba de la unidad más pequeña de código, como una función o un método, de forma aislada.'],
    ['Refactorización', 'Mejora de la estructura interna del código sin cambiar su comportamiento externo.'],
    ['Requisito', 'Condición o capacidad que el sistema debe cumplir para satisfacer una necesidad.'],
    ['Retrospectiva', 'Evento al final del Sprint para inspeccionar cómo trabajó el equipo y acordar mejoras.'],
    ['Scrum', 'Marco de trabajo ligero para resolver problemas complejos mediante Sprints, inspección y adaptación.'],
    ['Scrum Master', 'Responsable de que Scrum se entienda y aplique, y de eliminar impedimentos del equipo.'],
    ['Sprint', 'Periodo fijo de un mes o menos en el que se crea un Incremento utilizable.'],
    ['Sprint Review', 'Evento para inspeccionar el Incremento con los interesados y adaptar el Product Backlog.'],
    ['TDD', 'Desarrollo guiado por pruebas: escribir primero una prueba que falla, luego el código y después refactorizar.'],
    ['Trazabilidad', 'Capacidad de relacionar cada requisito con su diseño, código y pruebas.'],
    ['Usabilidad', 'Facilidad con que un usuario aprende a usar un producto y lo usa de forma eficaz y satisfactoria.'],
    ['Validación', '¿Construimos el producto correcto? Confirma que el software satisface las necesidades del usuario.'],
    ['Verificación', '¿Construimos el producto correctamente? Confirma que el software cumple su especificación.'],
    ['WIP (Work in Progress)', 'Trabajo iniciado y no terminado. Kanban lo limita por columna para mejorar el flujo.'],
    ['XP (Extreme Programming)', 'Metodología ágil centrada en prácticas técnicas: TDD, pareja, integración continua y diseño simple.'],
  ].sort((a, b) => a[0].localeCompare(b[0], 'es'));

  const normalizar = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9ñ ]/g, ' ').replace(/\s+/g, ' ').trim();
  const letra = (t) => normalizar(t).charAt(0).toUpperCase();
  const ABC = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');

  const $ = (id) => document.getElementById(id);
  const input = $('buscar');

  function resaltar(texto, q) {
    const frag = document.createDocumentFragment();
    if (!q) { frag.append(texto); return frag; }
    const norm = texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    const i = norm.indexOf(q);
    if (i < 0) { frag.append(texto); return frag; }
    const m = document.createElement('mark');
    m.textContent = texto.slice(i, i + q.length);
    frag.append(texto.slice(0, i), m, texto.slice(i + q.length));
    return frag;
  }

  function render() {
    const q = normalizar(input.value);
    const soloSimbolos = input.value.trim() !== '' && q === '';
    const visibles = soloSimbolos ? [] : TERMINOS.filter(([t, d]) => !q || normalizar(t).includes(q) || normalizar(d).includes(q));
    const grupos = new Map();
    visibles.forEach((x) => {
      const l = letra(x[0]);
      if (!grupos.has(l)) grupos.set(l, []);
      grupos.get(l).push(x);
    });

    // Índice alfabético
    const az = $('indice');
    az.innerHTML = '';
    ABC.forEach((l) => {
      let el;
      if (grupos.has(l)) {
        el = document.createElement('a');
        el.href = `#letra-${l}`;
        el.setAttribute('aria-label', `Ir a la letra ${l}`);
      } else {
        el = document.createElement('span');
        el.setAttribute('aria-hidden', 'true');
      }
      el.textContent = l;
      az.appendChild(el);
    });

    // Listado
    const lista = $('listado');
    lista.innerHTML = '';
    grupos.forEach((items, l) => {
      const g = document.createElement('section');
      g.className = 'letter-group';
      g.id = `letra-${l}`;
      g.setAttribute('aria-label', `Letra ${l}`);
      const h = document.createElement('h3');
      h.textContent = l;
      const dl = document.createElement('dl');
      dl.className = 'terms';
      items.forEach(([t, d]) => {
        const div = document.createElement('div');
        div.className = 'term';
        const dt = document.createElement('dt');
        dt.appendChild(resaltar(t, q));
        const dd = document.createElement('dd');
        dd.appendChild(resaltar(d, q));
        div.append(dt, dd);
        dl.appendChild(div);
      });
      g.append(h, dl);
      lista.appendChild(g);
    });

    const n = visibles.length;
    $('contador').textContent = (q || soloSimbolos) ?`${n} ${n === 1 ? 'término encontrado' : 'términos encontrados'} para «${input.value.trim()}»` : `${TERMINOS.length} términos`;
    $('sin-resultados').hidden = n > 0;
    $('sin-termino').textContent = input.value.trim();
  }

  input.addEventListener('input', render);
  $('limpiar').addEventListener('click', () => { input.value = ''; render(); input.focus(); });
  render();
})();
