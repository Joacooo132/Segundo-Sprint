// US-17 · Validación del formulario de contacto en el navegador y confirmación en pantalla.
// No hay servidor: tras validar, se muestra la confirmación y se ofrece abrir el mensaje en el correo.
(() => {
  const form = document.getElementById('form-contacto');
  if (!form) return;
  const conf = document.getElementById('confirmacion');
  const CORREO_EQUIPO = ''; // Completar con el correo del equipo para recibir los mensajes.
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const reglas = {
    nombre: (v) => {
      if (!v.trim()) return 'Escribe tu nombre. Este campo es obligatorio.';
      if (v.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres.';
      if (!/^[\p{L}\s'.-]+$/u.test(v.trim())) return 'Usa solo letras, espacios, apóstrofos o guiones.';
      return '';
    },
    email: (v) => {
      if (!v.trim()) return 'Escribe tu correo electrónico. Este campo es obligatorio.';
      if (!EMAIL_RE.test(v.trim())) return 'Introduce un correo válido, por ejemplo: nombre@dominio.com.';
      return '';
    },
    tipo: (v) => (v ? '' : 'Selecciona el tipo de consulta.'),
    asunto: (v) => {
      if (!v.trim()) return 'Escribe el asunto. Este campo es obligatorio.';
      if (v.trim().length < 3) return 'El asunto debe tener al menos 3 caracteres.';
      return '';
    },
    mensaje: (v) => {
      if (!v.trim()) return 'Escribe tu mensaje. Este campo es obligatorio.';
      if (v.trim().length < 10) return 'El mensaje debe tener al menos 10 caracteres.';
      return '';
    },
  };

  function validar(campo) {
    const el = form.elements[campo];
    const err = document.getElementById(`${campo}-error`);
    const msg = reglas[campo](el.value, el);
    // Ícono + texto: el error no depende solo del color.
    err.innerHTML = msg ? '<span aria-hidden="true">▲</span> ' : '';
    if (msg) err.append(msg);
    err.hidden = !msg;
    el.setAttribute('aria-invalid', String(!!msg));
    el.classList.toggle('invalid', !!msg);
    return !msg;
  }

  Object.keys(reglas).forEach((campo) => {
    const el = form.elements[campo];
    el.addEventListener('blur', () => { if (el.value) validar(campo); });
    el.addEventListener('input', () => { if (el.getAttribute('aria-invalid') === 'true') validar(campo); });
    el.addEventListener('change', () => { if (el.getAttribute('aria-invalid') === 'true') validar(campo); });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const resultados = Object.keys(reglas).map(validar);
    if (resultados.includes(false)) {
      const primero = Object.keys(reglas).find((c) => form.elements[c].getAttribute('aria-invalid') === 'true');
      form.elements[primero].focus();
      conf.hidden = true;
      return;
    }

    const datos = new FormData(form);
    const nombre = datos.get('nombre').trim();
    const tipo = datos.get('tipo');
    const email = datos.get('email').trim();
    const asuntoTxt = datos.get('asunto').trim();
    const asunto = encodeURIComponent(`[${tipo}] ${asuntoTxt}`);
    const cuerpo = encodeURIComponent(`Nombre: ${nombre}\nCorreo: ${email}\nTipo: ${tipo}\n\n${datos.get('mensaje').trim()}`);

    conf.innerHTML = '';
    const titulo = document.createElement('strong');
    titulo.innerHTML = '<span aria-hidden="true">✓</span> ';
    titulo.append(`¡Gracias, ${nombre}! Recibimos tu mensaje`);
    const texto = document.createElement('p');
    texto.append(`Consulta: «${asuntoTxt}» (${tipo}). Te responderemos a ${email}. `);
    const enlace = document.createElement('a');
    enlace.href = `mailto:${CORREO_EQUIPO}?subject=${asunto}&body=${cuerpo}`;
    enlace.innerHTML = '<u>Abrir el mensaje en tu correo</u>';
    texto.append(enlace);
    conf.append(titulo, texto);
    conf.hidden = false;
    form.reset();
    conf.focus();
  });
})();
