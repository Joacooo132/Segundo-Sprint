// Transiciones compartidas por todas las páginas.
// 1) Todo elemento que deja de estar oculto (atributo hidden) entra con un fundido.
// 2) Transiciones.alternar(el, mostrar) despliega o pliega un bloque animando su altura.
// 3) Transiciones.reproducir(el) repite el fundido de entrada (contenido que cambia).
(() => {
  function reproducir(el) {
    if (!el) return;
    el.classList.remove('entra');
    void el.offsetWidth; // reinicia la animación
    el.classList.add('entra');
  }

  // Quita la clase al terminar para no interferir con los efectos de hover.
  document.addEventListener('animationend', (e) => {
    if (e.target.classList && e.target.classList.contains('entra')) {
      e.target.classList.remove('entra');
    }
  });

  function alternar(el, mostrar) {
    if (!el) return;
    if (el._animacion) el._animacion.cancel();
    if (typeof el.animate !== 'function') {
      el.hidden = !mostrar;
      return;
    }
    el.dataset.animando = '1';
    if (mostrar) el.hidden = false;

    const cs = getComputedStyle(el);
    const abierto = {
      height: `${el.scrollHeight}px`,
      paddingTop: cs.paddingTop,
      paddingBottom: cs.paddingBottom,
      marginTop: cs.marginTop,
      marginBottom: cs.marginBottom,
      opacity: 1,
    };
    const cerrado = {
      height: '0px', paddingTop: '0px', paddingBottom: '0px',
      marginTop: '0px', marginBottom: '0px', opacity: 0,
    };

    const overflow = el.style.overflow;
    el.style.overflow = 'hidden';
    const anim = el.animate(mostrar ? [cerrado, abierto] : [abierto, cerrado], {
      duration: 350,
      easing: 'cubic-bezier(.25, .8, .25, 1)',
    });
    el._animacion = anim;
    const terminar = () => {
      el.style.overflow = overflow;
      el._animacion = null;
      delete el.dataset.animando;
    };
    anim.onfinish = () => {
      if (!mostrar) el.hidden = true;
      terminar();
    };
    anim.oncancel = terminar;
  }

  // Fundido de entrada automático cuando se quita el atributo hidden.
  const observador = new MutationObserver((cambios) => {
    cambios.forEach((c) => {
      const el = c.target;
      if (el.hidden || c.oldValue === null) return; // no estaba oculto o sigue oculto
      if (el.dataset.animando || el.classList.contains('modelo-panel')) return; // tienen su propia animación
      reproducir(el);
    });
  });
  observador.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['hidden'],
    attributeOldValue: true,
    subtree: true,
  });

  window.Transiciones = { reproducir, alternar };
})();
