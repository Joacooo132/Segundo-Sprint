// US-17 · Validación del formulario de contacto en el navegador y confirmación en pantalla.
// No hay servidor: tras validar, se muestra la confirmación y se ofrece abrir el mensaje en el correo.
(() => {
  const form = document.getElementById('form-contacto');
  const conf = document.getElementById('confirmacion');
  const mensaje = document.getElementById('mensaje');
  const cuenta = document.getElementById('mensaje-cuenta');
  const CORREO_EQUIPO = ''; // Completar con el correo del equipo para recibir los mensajes.
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const reglas = {
    nombre: (v) => {
      if (!v.trim()) return 'Escribe tu nombre.';
      if (v.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres.';
      if (!/^[\p{L}\s'.-]+$/u.test(v.trim())) return 'Usa solo letras, espacios, apóstrofos o guiones.';
      return '';
    },
    email: (v) => {
      if (!v.trim()) return 'Escribe tu correo electrónico.';
      if (!EMAIL_RE.test(v.trim())) return 'Escribe un correo válido, por ejemplo nombre@dominio.com.';
      return '';
    },
    motivo: (v) => (v ? '' : 'Selecciona el motivo de tu mensaje.'),
    mensaje: (v) => {
      if (!v.trim()) return 'Escribe tu mensaje.';
      if (v.trim().length < 10) return 'El mensaje debe tener al menos 10 caracteres.';
      return '';
    },
    acepto: (_, el) => (el.checked ? '' : 'Debes aceptar para poder enviar el mensaje.'),
  };

  function validar(campo) {
    const el = form.elements[campo];
    const err = document.getElementById(`${campo}-error`);
    const msg = reglas[campo](el.value, el);
    err.textContent = msg;
    err.hidden = !msg;
    el.setAttribute('aria-invalid', String(!!msg));
    el.classList.toggle('invalid', !!msg);
    return !msg;
  }

  Object.keys(reglas).forEach((campo) => {
    const el = form.elements[campo];
    el.addEventListener('blur', () => { if (el.value || el.type === 'checkbox') validar(campo); });
    el.addEventListener('input', () => { if (el.getAttribute('aria-invalid') === 'true') validar(campo); });
    el.addEventListener('change', () => { if (el.getAttribute('aria-invalid') === 'true') validar(campo); });
  });

  mensaje.addEventListener('input', () => { cuenta.textContent = mensaje.value.length; });

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
    const motivo = datos.get('motivo');
    const email = datos.get('email').trim();
    const asunto = encodeURIComponent(`Contacto web: ${motivo}`);
    const cuerpo = encodeURIComponent(`Nombre: ${nombre}\nCorreo: ${email}\nMotivo: ${motivo}\n\n${datos.get('mensaje').trim()}`);

    conf.innerHTML = '';
    const fuerte = document.createElement('strong');
    fuerte.textContent = `¡Gracias, ${nombre}! `;
    const texto = document.createTextNode(`Recibimos tu mensaje sobre «${motivo}». Te responderemos a ${email}. `);
    const enlace = document.createElement('a');
    enlace.href = `mailto:${CORREO_EQUIPO}?subject=${asunto}&body=${cuerpo}`;
    enlace.innerHTML = '<u>Abrir el mensaje en tu correo</u>';
    conf.append(fuerte, texto, enlace);
    conf.hidden = false;
    form.reset();
    cuenta.textContent = '0';
    conf.focus();
  });

  form.addEventListener('reset', () => {
    Object.keys(reglas).forEach((c) => {
      const err = document.getElementById(`${c}-error`);
      err.hidden = true;
      form.elements[c].removeAttribute('aria-invalid');
      form.elements[c].classList.remove('invalid');
    });
    cuenta.textContent = '0';
  });
})();
