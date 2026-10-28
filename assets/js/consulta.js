// ElevaLab · Formularios de consulta ("Quiero una página" y "No sé qué necesito").
// Todo texto se inserta con textContent (nunca como HTML).
// Cada página indica qué formulario mostrar con data-form="pagina" o data-form="caso".
(function () {
  'use strict';

  // Misma aplicación web (Apps Script de Solicitudes) que usa el cuestionario con invitación.
  const API_URL = 'https://script.google.com/macros/s/AKfycbxKzJlhH59wylg9LX7xW_WbaR_eoOMd0ZT5KQa8pGOj80CPqpS8twSopnyPe0sU-oSdkw/exec';
  const TIMEOUT_MS = 30000;
  const PRIVACIDAD_URL = '../privacidad/';

  const CONTACTO = [
    { id: 'nombre', tipo: 'texto', etiqueta: 'Tu nombre', req: true, auto: 'name', contacto: 'nombre' },
    { id: 'correo', tipo: 'correo', etiqueta: 'Correo electrónico', req: true, auto: 'email', contacto: 'correo' },
    { id: 'telefono', tipo: 'tel', etiqueta: 'Teléfono', ayuda: 'Con código de área. Si tenés WhatsApp, mejor.', req: true, auto: 'tel', contacto: 'telefono' },
    { id: 'preferencia', tipo: 'unica', etiqueta: '¿Cómo preferís que te contactemos?', opciones: ['Por correo', 'Por teléfono o WhatsApp', 'Me da lo mismo'] }
  ];

  const FORMULARIOS = {
    pagina: {
      tipo: 'pagina',
      secciones: [
        { titulo: 'Tu negocio', campos: [
          { id: 'negocio', tipo: 'texto', etiqueta: 'Nombre de tu negocio', req: true, esNegocio: true },
          { id: 'quehace', tipo: 'largo', etiqueta: '¿A qué se dedica y qué ofrece?', ayuda: 'Contanos con tus palabras: qué vendés o qué servicio das, y a quién.', req: true },
          { id: 'zona', tipo: 'texto', etiqueta: '¿Dónde está o en qué zona trabaja?' },
          { id: 'actual', tipo: 'texto', etiqueta: '¿Ya tenés página o redes sociales?', ayuda: 'Pegá el enlace o el usuario si querés. Si no tenés, dejalo vacío.' }
        ] },
        { titulo: 'Tu página', campos: [
          { id: 'objetivos', tipo: 'multiple', etiqueta: '¿Qué necesitás que haga tu página?', ayuda: 'Podés elegir más de una.', req: true,
            opciones: ['Que más gente me conozca', 'Que me contacten fácilmente', 'Mostrar lo que ofrezco (productos o servicios)', 'Mostrar mis trabajos o fotos', 'Dar información práctica (horarios, ubicación)', 'No lo sé, prefiero que me asesoren'] },
          { id: 'info', tipo: 'multiple', etiqueta: '¿Qué información querés mostrar?', ayuda: 'Podés elegir más de una.',
            opciones: ['Productos o servicios', 'Precios', 'Fotos o galería', 'Horarios y ubicación', 'Redes sociales', 'Historia del negocio', 'Opiniones de clientes', 'Preguntas frecuentes'] },
          { id: 'materiales', tipo: 'unica', etiqueta: '¿Tenés logo, fotos y textos para la página?', opciones: ['Sí, tengo casi todo', 'Tengo algo', 'Todavía no', 'No sé'] },
          { id: 'referencia', tipo: 'texto', etiqueta: '¿Hay alguna página que te guste como referencia?', ayuda: 'Opcional. Pegá un enlace o contanos qué te gusta de ella.' },
          { id: 'extra', tipo: 'largo', etiqueta: '¿Algo más que debamos saber para preparar tu propuesta?' }
        ] }
      ]
    },
    caso: {
      tipo: 'caso',
      secciones: [
        { titulo: 'Tu negocio', campos: [
          { id: 'negocio', tipo: 'texto', etiqueta: 'Nombre de tu negocio', req: true, esNegocio: true },
          { id: 'quehace', tipo: 'largo', etiqueta: '¿A qué se dedica tu negocio?', ayuda: 'Qué hacés, a quién le vendés o para quién trabajás.', req: true },
          { id: 'actual', tipo: 'texto', etiqueta: '¿Tenés página o redes sociales?', ayuda: 'Opcional. Pegá el enlace o el usuario.' }
        ] },
        { titulo: 'Cómo trabajás hoy', campos: [
          { id: 'comotrabaja', tipo: 'largo', etiqueta: '¿Cómo trabajan hoy?', ayuda: 'Por ejemplo: cómo reciben pedidos o turnos, cómo llevan los clientes, las ventas, el stock o los pagos.', req: true },
          { id: 'problemas', tipo: 'largo', etiqueta: '¿Qué cosas te cuestan o te generan problemas?', req: true },
          { id: 'mejorar', tipo: 'largo', etiqueta: '¿Qué te gustaría mejorar?', ayuda: 'Aunque no sepas cómo se resuelve: contanos qué te gustaría que fuera distinto.', req: true },
          { id: 'areas', tipo: 'multiple', etiqueta: '¿En qué te gustaría mejorar?', ayuda: 'Opcional. Podés elegir más de una.',
            opciones: ['Que me encuentren en internet', 'Tener una página para mi negocio', 'Ordenar clientes, turnos o pedidos', 'Llevar control de ventas, stock o pagos', 'Comunicarme mejor con mis clientes', 'Ahorrar tiempo en tareas repetitivas', 'No lo sé'] },
          { id: 'extra', tipo: 'largo', etiqueta: '¿Algo más que quieras contarnos?' }
        ] }
      ]
    }
  };

  const ERRORES = {
    red: 'No pudimos conectar. Revisá tu conexión y probá de nuevo: lo que completaste sigue acá.',
    demasiados_intentos: 'Se enviaron muchas consultas en poco tiempo. Esperá unos minutos y probá de nuevo, o escribinos a elevalab.ar@gmail.com.',
    correo_invalido: 'El correo no parece válido. Revisalo y probá de nuevo.',
    telefono_invalido: 'El teléfono no parece válido. Revisalo y probá de nuevo.',
    faltan_datos: 'Falta completar algún dato. Revisá el formulario y probá de nuevo.',
    falta_aceptacion: 'Para enviarlo necesitamos que marques la casilla de privacidad.',
    respuesta_demasiado_grande: 'Alguna respuesta es demasiado larga. Acortala y probá de nuevo.',
    generico: 'Hubo un problema de nuestro lado y no se pudo enviar. Probá de nuevo en un momento: lo que completaste sigue acá. Si sigue fallando, escribinos a elevalab.ar@gmail.com.'
  };

  function el(tag, attrs, hijos) {
    const e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'texto') e.textContent = attrs[k];
      else if (k === 'clase') e.className = attrs[k];
      else e.setAttribute(k, attrs[k]);
    });
    (hijos || []).forEach(function (h) { if (h) e.appendChild(h); });
    return e;
  }

  function nuevaClave() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID().replace(/-/g, '');
    let s = ''; for (let i = 0; i < 32; i++) s += Math.floor(Math.random() * 16).toString(16);
    return s + Date.now().toString(16);
  }

  function iniciar(contenedor) {
    const def = FORMULARIOS[contenedor.getAttribute('data-form')];
    if (!def) return;
    const abierto = Date.now();
    let clave = nuevaClave();
    let enviando = false;

    const form = el('form', { clase: 'fc', novalidate: '', 'aria-label': 'Formulario de consulta' });
    const campos = [];   // { def, leer(), marcar(msg), foco() }

    function crearCampo(c) {
      const idc = 'c-' + c.id;
      const marca = c.req ? el('span', { clase: 'fc-req', 'aria-hidden': 'true', texto: '*' }) : null;
      const ayuda = c.ayuda ? el('p', { clase: 'fc-ayuda', id: idc + '-ay', texto: c.ayuda }) : null;
      const error = el('p', { clase: 'fc-error', id: idc + '-er', role: 'alert', hidden: '' });
      let caja, entradas = [];

      if (c.tipo === 'unica' || c.tipo === 'multiple') {
        caja = el('fieldset', { clase: 'fc-campo' });
        const lg = el('legend', { texto: c.etiqueta }); if (marca) lg.appendChild(marca);
        caja.appendChild(lg);
        if (ayuda) caja.appendChild(ayuda);
        const ops = el('div', { clase: 'fc-opciones' });
        c.opciones.forEach(function (o, i) {
          const inp = el('input', { type: c.tipo === 'unica' ? 'radio' : 'checkbox', name: idc, id: idc + '-' + i, value: o });
          entradas.push(inp);
          ops.appendChild(el('label', { clase: 'fc-op', 'for': idc + '-' + i }, [inp, el('span', { texto: o })]));
        });
        caja.appendChild(ops);
      } else {
        caja = el('div', { clase: 'fc-campo' });
        const lb = el('label', { 'for': idc, texto: c.etiqueta }); if (marca) lb.appendChild(marca);
        caja.appendChild(lb);
        if (ayuda) caja.appendChild(ayuda);
        const attrs = { id: idc, name: idc };
        let inp;
        if (c.tipo === 'largo') { attrs.rows = '4'; attrs.maxlength = '4000'; inp = el('textarea', attrs); }
        else {
          attrs.type = c.tipo === 'correo' ? 'email' : (c.tipo === 'tel' ? 'tel' : 'text');
          attrs.maxlength = c.tipo === 'texto' ? '200' : '120';
          if (c.tipo === 'correo') { attrs.inputmode = 'email'; attrs.autocapitalize = 'none'; attrs.spellcheck = 'false'; }
          if (c.tipo === 'tel') attrs.inputmode = 'tel';
          if (c.auto) attrs.autocomplete = c.auto;
          inp = el('input', attrs);
        }
        entradas.push(inp);
        caja.appendChild(inp);
      }
      caja.appendChild(error);

      const ref = {
        def: c,
        leer: function () {
          if (c.tipo === 'multiple') return entradas.filter(function (x) { return x.checked; }).map(function (x) { return x.value; });
          if (c.tipo === 'unica') { const s = entradas.filter(function (x) { return x.checked; })[0]; return s ? s.value : ''; }
          return entradas[0].value.trim();
        },
        marcar: function (msg) {
          error.textContent = msg || ''; error.hidden = !msg;
          entradas.forEach(function (x) { if (msg) x.setAttribute('aria-invalid', 'true'); else x.removeAttribute('aria-invalid'); });
          if (msg && entradas[0]) entradas[0].setAttribute('aria-describedby', idc + '-er');
        },
        foco: function () { entradas[0].focus(); }
      };
      entradas.forEach(function (x) { x.addEventListener('input', function () { ref.marcar(''); }); x.addEventListener('change', function () { ref.marcar(''); }); });
      campos.push(ref);
      return caja;
    }

    def.secciones.concat([{ titulo: 'Tus datos de contacto', campos: CONTACTO }]).forEach(function (s) {
      const sec = el('section', { clase: 'fc-seccion' }, [el('h2', { texto: s.titulo })]);
      s.campos.forEach(function (c) { sec.appendChild(crearCampo(c)); });
      form.appendChild(sec);
    });

    // Aceptación de privacidad (obligatoria)
    const acepto = el('input', { type: 'checkbox', id: 'c-acepto', name: 'acepto' });
    const aceptoError = el('p', { clase: 'fc-error', role: 'alert', hidden: '' });
    const enlace = el('a', { href: PRIVACIDAD_URL, target: '_blank', rel: 'noopener', texto: 'aviso de privacidad' });
    const aceptoTxt = el('span', {}, [document.createTextNode('Leí el '), enlace, document.createTextNode(' y acepto que ElevaLab use estos datos para responder a mi consulta.')]);
    form.appendChild(el('div', { clase: 'fc-campo' }, [el('label', { clase: 'fc-op', 'for': 'c-acepto' }, [acepto, aceptoTxt]), aceptoError]));
    acepto.addEventListener('change', function () { aceptoError.hidden = true; });

    // Campo trampa para bots (las personas no lo ven ni lo usan)
    const trampa = el('input', { type: 'text', name: 'sitio_web', id: 'c-sitio', tabindex: '-1', autocomplete: 'off' });
    form.appendChild(el('div', { clase: 'fc-trampa', 'aria-hidden': 'true' }, [el('label', { 'for': 'c-sitio', texto: 'No completar este campo' }), trampa]));

    const aviso = el('div', { clase: 'fc-aviso', role: 'alert', hidden: '' });
    const boton = el('button', { type: 'submit', clase: 'btn btn-oro fc-enviar', texto: 'Enviar consulta' });
    form.appendChild(aviso);
    form.appendChild(boton);
    form.appendChild(el('p', { clase: 'fc-legal', texto: 'Los campos con * son obligatorios. Usamos tus datos solo para responderte.' }));

    function mostrarAviso(msg) { aviso.textContent = msg; aviso.hidden = !msg; }

    function validar() {
      let primero = null;
      campos.forEach(function (c) {
        const v = c.leer();
        let msg = '';
        const vacio = Array.isArray(v) ? v.length === 0 : v === '';
        if (c.def.req && vacio) msg = c.def.tipo === 'multiple' ? 'Elegí al menos una opción.' : 'Este dato es obligatorio.';
        else if (!vacio && c.def.tipo === 'correo' && !/^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]{2,}$/.test(v)) msg = 'Escribí un correo válido, por ejemplo nombre@correo.com.';
        else if (!vacio && c.def.tipo === 'tel' && (!/^[+()\d][\d\s().+-]{5,29}$/.test(v) || v.replace(/\D/g, '').length < 6)) msg = 'Escribí un teléfono válido, con código de área.';
        c.marcar(msg);
        if (msg && !primero) primero = c;
      });
      if (!acepto.checked) {
        aceptoError.textContent = 'Necesitamos que aceptes el aviso de privacidad para enviar tu consulta.'; aceptoError.hidden = false;
        if (!primero) primero = { foco: function () { acepto.focus(); } };
      }
      if (primero) { primero.foco(); return false; }
      return true;
    }

    function armarPayload() {
      const contacto = {}; let negocio = ''; const respuestas = [];
      campos.forEach(function (c) {
        const v = c.leer();
        if (c.def.contacto) { contacto[c.def.contacto] = v; return; }
        if (c.def.esNegocio) { negocio = v; return; }
        respuestas.push({ p: c.def.etiqueta, r: v });
      });
      return { action: 'enviarConsulta', tipo: def.tipo, clave: clave, negocio: negocio, contacto: contacto, respuestas: respuestas, acepto: true, hp: trampa.value, tiempoMs: Date.now() - abierto };
    }

    function enviar(payload) {
      const ctrl = new AbortController();
      const to = setTimeout(function () { ctrl.abort(); }, TIMEOUT_MS);
      return fetch(API_URL, { method: 'POST', redirect: 'follow', credentials: 'omit', cache: 'no-store', signal: ctrl.signal, body: JSON.stringify(payload) })
        .then(function (r) { return r.json(); })
        .catch(function () { return { ok: false, error: 'red' }; })
        .then(function (r) { clearTimeout(to); return (r && typeof r === 'object') ? r : { ok: false, error: 'generico' }; });
    }

    function exito(correo) {
      const caja = el('div', { clase: 'fc-exito', role: 'status', tabindex: '-1' }, [
        el('h2', { texto: '¡Listo, recibimos tu consulta!' }),
        el('p', { texto: 'Te vamos a escribir a ' + correo + ' para seguir. Gracias por contarnos de tu negocio.' }),
        el('div', { clase: 'botones' }, [
          el('a', { clase: 'btn btn-oro', href: '../index.html', texto: 'Volver al inicio' })
        ])
      ]);
      contenedor.replaceChildren(caja);
      caja.focus();
      window.scrollTo({ top: contenedor.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
    }

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (enviando) return;
      mostrarAviso('');
      if (!validar()) return;
      enviando = true; boton.disabled = true; boton.textContent = 'Enviando…';
      const payload = armarPayload();
      enviar(payload).then(function (r) {
        enviando = false;
        if (r.ok) { exito(payload.contacto.correo); return; }
        boton.disabled = false; boton.textContent = 'Reintentar envío';
        mostrarAviso(ERRORES[r.error] || ERRORES.generico);
        aviso.scrollIntoView({ block: 'center', behavior: 'smooth' });
      });
    });

    contenedor.replaceChildren(form);
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-form]').forEach(iniciar);
  });
})();
