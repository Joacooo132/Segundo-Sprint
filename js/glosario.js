// US-12 · Glosario: listado A-Z, índice por letras y buscador en tiempo real.
// La búsqueda ignora mayúsculas, tildes y signos.
(() => {
  const TERMINOS = [
    ['Aseguramiento de calidad', 'Actividades planificadas que dan confianza en que los procesos permiten cumplir los requisitos de calidad. No se limita a ejecutar pruebas.'],
    ['Backlog', 'Lista ordenada de trabajo pendiente. En Scrum, el Product Backlog evoluciona con el producto y el aprendizaje.'],
    ['Caja blanca', 'Enfoque de prueba basado en la estructura interna del software, como instrucciones, decisiones y caminos.'],
    ['Caja negra', 'Enfoque de prueba basado en entradas, salidas y comportamiento observable, sin depender de la estructura del código.'],
    ['Cycle time', 'Tiempo transcurrido desde que un trabajo se inicia hasta que se termina, con puntos de medición acordados.'],
    ['Defecto', 'Imperfección de un producto de trabajo que puede provocar que un componente o sistema no cumpla lo esperado.'],
    ['Definition of Done', 'Descripción compartida del estado de calidad que debe cumplir un Incremento para considerarse terminado.'],
    ['Empirismo', 'Construcción de conocimiento a partir de la experiencia y de decisiones basadas en lo observado.'],
    ['Incremento', 'Paso concreto y utilizable hacia la meta del producto; se suma a los incrementos anteriores y funciona con ellos.'],
    ['Integración continua', 'Práctica de integrar cambios con frecuencia y comprobarlos mediante compilación y pruebas automatizadas.'],
    ['Kanban', 'Estrategia para optimizar el flujo de valor mediante un sistema visual y pull que limita el trabajo en curso.'],
    ['Lead time', 'Tiempo desde una solicitud hasta su entrega, incluyendo la espera previa al inicio del trabajo.'],
    ['Métrica', 'Medida cuantitativa usada para describir, evaluar o seguir un atributo de un proceso o producto.'],
    ['Product Goal', 'Objetivo de largo plazo del Scrum Team que describe un estado futuro del producto y orienta el Product Backlog.'],
    ['Prueba de aceptación', 'Prueba centrada en determinar si el sistema satisface las necesidades y los criterios acordados con usuarios o clientes.'],
    ['Refactorización', 'Cambio de la estructura interna del código para mejorar su diseño sin alterar su comportamiento observable.'],
    ['Scrum', 'Marco ligero que ayuda a equipos y organizaciones a generar valor mediante soluciones adaptativas a problemas complejos.'],
    ['Sprint', 'Evento de duración fija de un mes o menos que contiene el trabajo y los eventos de Scrum.'],
    ['Sprint Goal', 'Objetivo único del Sprint que da coherencia al trabajo seleccionado y permite flexibilidad en el alcance.'],
    ['Throughput', 'Cantidad de unidades de trabajo terminadas por unidad de tiempo, usando una definición consistente de terminado.'],
    ['Validación', 'Comprobación de que el producto satisface las necesidades de uso: ¿construimos el producto adecuado?'],
    ['Verificación', 'Comprobación de que el producto de trabajo cumple los requisitos especificados: ¿lo construimos correctamente?'],
    ['WIP (Work in Progress)', 'Trabajo iniciado que todavía no está terminado. Limitarlo ayuda a reducir multitarea y hacer visibles los atascos.'],
  ];

  const sinTildes = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  const normalizar = (s) => sinTildes(s).toLowerCase().replace(/[^a-z0-9ñ ]/g, ' ').replace(/\s+/g, ' ').trim();
  const letra = (t) => sinTildes(t).charAt(0).toUpperCase();
  const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const $ = (id) => document.getElementById(id);
  const input = $('buscar');
  if (!input) return;

  function resaltar(texto, q) {
    const frag = document.createDocumentFragment();
    if (!q) { frag.append(texto); return frag; }
    const i = sinTildes(texto).toLowerCase().indexOf(q);
    if (i < 0) { frag.append(texto); return frag; }
    const m = document.createElement('mark');
    m.textContent = texto.slice(i, i + q.length);
    frag.append(texto.slice(0, i), m, texto.slice(i + q.length));
    return frag;
  }

  function render() {
    const crudo = input.value.trim();
    const q = normalizar(crudo);
    const visibles = crudo && !q ? [] : TERMINOS.filter(([t, d]) => !q || normalizar(t).includes(q) || normalizar(d).includes(q));
    const grupos = new Map();
    visibles.forEach((x) => {
      const l = letra(x[0]);
      if (!grupos.has(l)) grupos.set(l, []);
      grupos.get(l).push(x);
    });

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

    const lista = $('listado');
    lista.innerHTML = '';
    grupos.forEach((items, l) => {
      const g = document.createElement('section');
      g.className = 'g-group';
      g.id = `letra-${l}`;
      g.setAttribute('aria-label', `Letra ${l}`);
      const h = document.createElement('h3');
      h.className = 'g-letter';
      h.textContent = l;
      const dl = document.createElement('dl');
      dl.className = 'g-terms';
      items.forEach(([t, d]) => {
        const div = document.createElement('div');
        div.className = 'g-term';
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
    $('contador').textContent = crudo
      ? `Listado alfabético · ${n} ${n === 1 ? 'resultado' : 'resultados'} para «${crudo}»`
      : `Listado alfabético · ${TERMINOS.length} entradas`;
    const vacio = $('sin-resultados');
    vacio.hidden = n > 0;
    $('sin-termino').textContent = crudo;
    if (window.Transiciones) Transiciones.reproducir(lista);
  }

  input.addEventListener('input', render);
  document.querySelectorAll('[data-limpiar]').forEach((b) => b.addEventListener('click', () => {
    input.value = '';
    render();
    input.focus();
  }));
  render();
})();
