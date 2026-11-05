// US-19 · Encuesta de preferencias metodológicas.
// Asistente de 5 pasos + rúbrica didáctica (0 a 2 puntos por criterio, hasta 10 por enfoque).
// Las respuestas solo viven en la página: no se guardan ni se envían.
(() => {
  const ENFOQUES = ['Scrum', 'Kanban', 'Cascada'];

  // puntos: [Scrum, Kanban, Cascada]
  const PASOS = [
    {
      corto: 'Equipo', titulo: 'Tamaño del equipo', resumen: '¿Cuántas personas colaboran?',
      pregunta: '¿Cuántas personas colaboran en el proyecto?',
      ayuda: 'Cuenta a quienes trabajan en el producto de forma habitual, no a todas las áreas de la organización.',
      opciones: [
        { r: 'Entre 1 y 5 personas', d: 'Un equipo pequeño que se coordina de forma directa.', corta: 'entre 1 y 5 personas', fila: 'Equipo pequeño de 1 a 5 personas', p: [1, 2, 1] },
        { r: 'Entre 6 y 9 personas', d: 'Un equipo colaborativo con roles variados.', corta: 'entre 6 y 9 personas', fila: 'Equipo colaborativo de 6 a 9 personas', p: [2, 1, 1] },
        { r: 'Más de 10 personas', d: 'Varios perfiles que necesitan coordinar dependencias.', corta: 'más de 10 personas', fila: 'Equipo grande de más de 10 personas', p: [1, 1, 2] },
        { r: 'Varios equipos en paralelo', d: 'Distintos equipos aportan a un mismo producto.', corta: 'varios equipos', fila: 'Varios equipos en paralelo', p: [1, 2, 1] },
      ],
    },
    {
      corto: 'Complejidad', titulo: 'Complejidad', resumen: '¿Qué incertidumbre tiene el trabajo?',
      pregunta: '¿Cuánta incertidumbre tiene el trabajo?',
      ayuda: 'Piensa en lo técnico y en el negocio: ¿sabemos cómo construirlo y qué necesita el usuario?',
      opciones: [
        { r: 'Baja; ya hicimos algo parecido', d: 'Conocemos la tecnología y el dominio.', corta: 'baja; ya lo conocemos', fila: 'Complejidad baja y conocida', p: [0, 1, 2] },
        { r: 'Media; hay algunas dudas', d: 'Partes conocidas y otras por descubrir.', corta: 'media; algunas dudas', fila: 'Complejidad media', p: [1, 2, 1] },
        { r: 'Alta; necesitamos aprender', d: 'Habrá que experimentar para encontrar la solución.', corta: 'alta; necesitamos aprender', fila: 'Complejidad alta e incertidumbre', p: [2, 1, 0] },
        { r: 'Todavía no lo sabemos', d: 'La incertidumbre es parte del contexto a explorar.', corta: 'todavía no lo sabemos', fila: 'Complejidad aún desconocida', p: [2, 1, 0] },
      ],
    },
    {
      corto: 'Requisitos', titulo: 'Requisitos', resumen: '¿Cuánto pueden cambiar?',
      pregunta: '¿Qué tan estables son las necesidades del proyecto?',
      ayuda: 'Piensa en lo que puede cambiar al recibir feedback de usuarios, no solo en si existe un documento inicial.',
      opciones: [
        { r: 'Son estables y están bien definidas', d: 'Esperamos pocos cambios durante la construcción.', corta: 'estables y definidas', fila: 'Requisitos estables y definidos', p: [0, 1, 2] },
        { r: 'Pueden cambiar de forma puntual', d: 'La base está clara y habrá ajustes moderados.', corta: 'cambios puntuales', fila: 'Requisitos con cambios puntuales', p: [1, 2, 1] },
        { r: 'Cambian con frecuencia al aprender', d: 'Necesitamos probar ideas con usuarios y adaptar prioridades.', corta: 'cambios frecuentes', fila: 'Requisitos que cambian frecuentemente', p: [2, 1, 0] },
        { r: 'Todavía no lo sabemos', d: 'La incertidumbre es parte del contexto a explorar.', corta: 'todavía no lo sabemos', fila: 'Requisitos aún inciertos', p: [2, 1, 0] },
      ],
    },
    {
      corto: 'Entregas', titulo: 'Frecuencia de entrega', resumen: '¿Cada cuánto necesitas entregar?',
      pregunta: '¿Cada cuánto necesitas entregar algo utilizable?',
      ayuda: 'Considera cuándo los usuarios o clientes esperan ver avances que puedan probar.',
      opciones: [
        { r: 'Una única entrega al final', d: 'El valor se recibe cuando todo está terminado.', corta: 'una entrega final', fila: 'Una única entrega al final', p: [0, 0, 2] },
        { r: 'Cada dos a cuatro semanas', d: 'Incrementos regulares para revisar con usuarios.', corta: 'cada dos a cuatro semanas', fila: 'Entrega prevista cada dos semanas', p: [2, 2, 1] },
        { r: 'De forma continua', d: 'Publicamos cada mejora apenas está lista.', corta: 'de forma continua', fila: 'Entrega continua', p: [1, 2, 0] },
        { r: 'Todavía no está definido', d: 'Lo acordaremos según el avance.', corta: 'sin definir', fila: 'Frecuencia de entrega sin definir', p: [1, 1, 1] },
      ],
    },
    {
      corto: 'Flujo', titulo: 'Tipo de flujo', resumen: '¿Cómo llega el trabajo?',
      pregunta: '¿Cómo llega el trabajo al equipo?',
      ayuda: 'Observa si el trabajo se puede planificar por bloques o si aparece de forma imprevista.',
      opciones: [
        { r: 'Funcionalidades planificables', d: 'Podemos agrupar trabajo alrededor de un objetivo.', corta: 'funcionalidades planificables', fila: 'Flujo de funcionalidades planificables', p: [1, 1, 1] },
        { r: 'Pedidos imprevistos y soporte', d: 'Llegan tareas urgentes que no podemos anticipar.', corta: 'pedidos imprevistos', fila: 'Flujo de pedidos imprevistos y soporte', p: [0, 2, 0] },
        { r: 'Fases con hitos documentados', d: 'Cada etapa se aprueba antes de pasar a la siguiente.', corta: 'fases con hitos', fila: 'Flujo por fases con hitos documentados', p: [0, 0, 2] },
        { r: 'Una mezcla de ambos', d: 'Funcionalidades nuevas y pedidos de mantenimiento.', corta: 'una mezcla', fila: 'Flujo mixto de proyecto y soporte', p: [1, 2, 0] },
      ],
    },
  ];

  // Recorrido de muestra del diseño: 6–9 personas, alta, frecuentes, quincenal, planificables.
  const MUESTRA = [1, 2, 2, 1, 0];

  const INTERPRETACION = {
    0: ['Mayor afinidad en este ejemplo', 'Complemento útil para el flujo', 'Menor ajuste al cambio frecuente'],
  };

  const $ = (id) => document.getElementById(id);
  const respuestas = Array(PASOS.length).fill(null);
  let actual = 0;

  function renderPaso() {
    const paso = PASOS[actual];
    $('paso-etiqueta').textContent = `Asistente de preferencias · Paso ${actual + 1} de ${PASOS.length}`;
    $('paso-ruta').textContent = PASOS.map((p, i) => p.corto + (respuestas[i] !== null && i !== actual ? ' ✓' : '')).join(' · ');
    $('paso-contador').textContent = `Paso ${actual + 1} / ${PASOS.length}`;
    $('paso-barra').style.width = `${((actual + 1) / PASOS.length) * 100}%`;
    $('paso-barra').parentElement.setAttribute('aria-valuenow', String(actual + 1));

    $('pregunta-etiqueta').textContent = `${paso.corto} · Una sola opción`;
    $('pregunta-titulo').textContent = paso.pregunta;
    $('pregunta-legend').textContent = paso.pregunta;
    $('pregunta-ayuda').textContent = paso.ayuda;
    $('pregunta-error').hidden = true;

    const fs = $('opciones');
    fs.querySelectorAll('.option').forEach((n) => n.remove());
    paso.opciones.forEach((op, i) => {
      const label = document.createElement('label');
      label.className = 'option';
      label.innerHTML = `
        <input type="radio" name="opcion" value="${i}">
        <span class="radio" aria-hidden="true"></span>
        <span><strong></strong><small></small></span>`;
      label.querySelector('strong').textContent = op.r;
      label.querySelector('small').textContent = op.d;
      const input = label.querySelector('input');
      input.checked = respuestas[actual] === i;
      input.addEventListener('change', () => {
        respuestas[actual] = i;
        $('pregunta-error').hidden = true;
        renderRecorrido();
      });
      fs.appendChild(label);
    });

    if (window.Transiciones) Transiciones.reproducir($('pregunta'));
    $('btn-anterior').disabled = actual === 0;
    $('btn-siguiente').textContent = actual === PASOS.length - 1 ? 'Ver resultado →' : 'Siguiente →';
    renderRecorrido();
  }

  function renderRecorrido() {
    const ol = $('recorrido');
    ol.innerHTML = '';
    PASOS.forEach((p, i) => {
      const li = document.createElement('li');
      const hecho = respuestas[i] !== null && i !== actual;
      const dot = document.createElement('span');
      dot.className = 'step-dot' + (i === actual ? ' current' : hecho ? ' done' : '');
      dot.textContent = hecho ? '✓' : String(i + 1);
      dot.setAttribute('aria-hidden', 'true');

      const box = document.createElement('div');
      const titulo = document.createElement('button');
      titulo.type = 'button';
      titulo.className = 'jump';
      titulo.innerHTML = '<strong></strong>';
      titulo.querySelector('strong').textContent = p.titulo;
      titulo.addEventListener('click', () => { actual = i; renderPaso(); });
      const desc = document.createElement('p');
      desc.textContent = p.resumen;
      const ans = document.createElement('span');
      ans.className = 'answer';
      const elegida = respuestas[i] !== null ? p.opciones[respuestas[i]].corta : null;
      if (i === actual) {
        ans.classList.add('now');
        ans.textContent = elegida ? `Paso actual: ${elegida}` : 'Paso actual';
      } else if (elegida) {
        ans.classList.add('has');
        ans.textContent = `Respuesta: ${elegida}`;
      } else {
        ans.textContent = 'Pendiente en el asistente';
      }
      box.append(titulo, desc, ans);
      li.append(dot, box);
      ol.appendChild(li);
    });
  }

  function calcular(resp) {
    const filas = resp.map((r, i) => PASOS[i].opciones[r]);
    const totales = ENFOQUES.map((_, k) => filas.reduce((s, f) => s + f.p[k], 0));
    return { filas, totales };
  }

  function renderResultado(resp, esMuestra) {
    const { filas, totales } = calcular(resp);
    const orden = ENFOQUES.map((n, k) => ({ n, k, t: totales[k] })).sort((a, b) => b.t - a.t || a.k - b.k);
    const mejor = orden[0];

    if (!esMuestra) {
      $('resultado-etiqueta').textContent = 'Tu resultado · Recorrido completo';
      $('resultado-titulo').textContent = `Tu resultado · afinidad con ${mejor.n}`;
      $('nota-texto').textContent = 'Este resultado se calcula con una rúbrica didáctica manual a partir de tus cinco respuestas. Es una orientación para reflexionar con tu equipo, no un diagnóstico ni evidencia científica.';
    }

    // Tarjetas de puntaje, de mayor a menor afinidad.
    const cont = $('puntajes');
    cont.innerHTML = '';
    orden.forEach((o, pos) => {
      const card = document.createElement('article');
      card.className = 'card' + (pos === 0 ? ' dark' : '');
      const interp = esMuestra
        ? INTERPRETACION[0][o.k]
        : pos === 0 ? 'Mayor afinidad con tus respuestas'
        : pos === 1 ? 'Puede complementar tu forma de trabajo'
        : 'Menor ajuste a tu contexto actual';
      card.innerHTML = `<h3></h3><p class="score-value">${o.t} / 10</p>
        <p class="score-pct">${o.t * 10} % de coincidencia</p>
        <div class="meter" aria-hidden="true"><span style="width:${o.t * 10}%"></span></div><p></p>`;
      card.querySelector('h3').textContent = o.n;
      card.querySelector('p:last-child').textContent = interp;
      cont.appendChild(card);
    });

    // Explicación.
    if (!esMuestra) {
      const seg = orden[1], ter = orden[2];
      const texto = {
        Scrum: 'Un objetivo de Sprint compartido, entregas regulares y la inspección con usuarios pueden ayudar a aprender sin perder foco cuando hay incertidumbre y requisitos que cambian.',
        Kanban: 'Visualizar el flujo, limitar el trabajo en curso y entregar de forma continua puede ayudar cuando el trabajo llega de manera variable o hay pedidos imprevistos.',
        Cascada: 'Planificar por fases con hitos documentados puede ser útil cuando las necesidades son estables, el dominio es conocido y se espera una entrega principal.',
      };
      $('explicacion-titulo').textContent = `Por qué explorar ${mejor.n} en este caso`;
      $('explicacion-1').textContent = `Tus respuestas: ${filas.map((f) => f.corta).join(', ')}. ${texto[mejor.n]}`;
      $('explicacion-2').textContent = `${seg.n} (${seg.t}/10) puede aportar prácticas complementarias, mientras que ${ter.n} (${ter.t}/10) encaja menos con este contexto. Antes de decidir, revisa autonomía, colaboración con usuarios y prácticas de calidad.`;
    }

    // Tabla de la rúbrica.
    const tbody = $('rubrica');
    tbody.innerHTML = '';
    filas.forEach((f) => {
      const tr = document.createElement('tr');
      tr.innerHTML = '<td></td>' + f.p.map((v) => `<td>${v}</td>`).join('');
      tr.firstChild.textContent = f.fila;
      tbody.appendChild(tr);
    });
    const total = document.createElement('tr');
    total.innerHTML = '<td>Total ilustrativo</td>' + totales.map((t) => `<td>${t} / 10</td>`).join('');
    tbody.appendChild(total);
    document.querySelector('.rubric thead th').textContent = esMuestra ? 'Respuestas de muestra' : 'Tus respuestas';
  }

  $('pregunta').addEventListener('submit', (e) => {
    e.preventDefault();
    if (respuestas[actual] === null) {
      $('pregunta-error').hidden = false;
      return;
    }
    if (actual < PASOS.length - 1) {
      actual += 1;
      renderPaso();
      $('pregunta-titulo').focus?.();
    } else {
      renderResultado(respuestas, false);
      $('resultado').scrollIntoView({ behavior: 'smooth' });
    }
  });

  $('btn-anterior').addEventListener('click', () => {
    if (actual > 0) { actual -= 1; renderPaso(); }
  });

  $('btn-reiniciar').addEventListener('click', () => {
    respuestas.fill(null);
    actual = 0;
    renderPaso();
    $('asistente').scrollIntoView({ behavior: 'smooth' });
  });

  renderPaso();
  renderResultado(MUESTRA, true);
})();
