// ElevaLab · Formulario de solicitud.
// Todo texto que viene del servidor se inserta con textContent (nunca como HTML).
(function () {
  'use strict';

  // Dirección de la aplicación web del Apps Script (termina en /exec). Se pega una sola vez.
  const API_URL = 'PEGAR_AQUI_LA_DIRECCION_EXEC_DEL_SCRIPT';
  const PRIVACIDAD_URL = '../privacidad/';
  const TIMEOUT_MS = 30000;

  // Textos de respaldo, por si el servidor no los trae (por ejemplo, enlace inválido).
  const POR_DEFECTO = {
    enlace_no_disponible: 'Este enlace no está disponible. Si creés que es un error, escribinos a elevalab.ar@gmail.com.',
    ya_enviado: 'Ya recibimos tus respuestas. Si querés cambiar algo, escribinos a elevalab.ar@gmail.com.',
    inicio_boton: 'Empezar', boton_atras: 'Atrás', boton_siguiente: 'Siguiente', boton_enviar: 'Enviar',
    etiqueta_no_se: 'No lo sé todavía / prefiero que me asesoren',
    aviso_validacion: 'Parece que falta algo, ¿está bien así?',
    sin_aceptacion: 'Sin esta aceptación no podemos recibir tus respuestas. Se guardaron igual, así que podés volver cuando quieras con el mismo enlace, o escribirnos a elevalab.ar@gmail.com.',
    guardado_ok: 'Guardado',
    enlace_privacidad: 'Aviso de privacidad',
    sidebar_nota: 'Tus respuestas se guardan cada vez que pasás al siguiente bloque. Podés cerrar y volver con el mismo enlace.',
    boton_guardar: 'Guardar y seguir más tarde',
    guardado_salir: 'Guardado. Podés cerrar esta página y volver cuando quieras con el mismo enlace.',
    faltan_respuestas: 'Falta responder algunas preguntas. Están marcadas. Si no sabés qué responder, elegí «No lo sé» o marcá la casilla de abajo.',
    faltan_en_otro_bloque: 'Quedaron preguntas sin responder en un bloque anterior. Te llevamos hasta ahí.',
    error_red: 'No pudimos conectar. Revisá tu conexión y probá de nuevo: tus respuestas siguen en esta página.',
    error_generico: 'Hubo un problema de nuestro lado. Probá de nuevo en un momento.',
    guardando: 'Guardando…', enviando: 'Enviando tus respuestas…',
    config_pendiente: 'Falta configurar la dirección del script en solicitar.js (constante API_URL).'
  };
  const ERRORES = {
    demasiados_intentos: 'Estás guardando muy seguido. Esperá un minuto y probá de nuevo.',
    ocupado: 'El sistema está ocupado. Probá de nuevo en unos segundos.',
    respuesta_demasiado_grande: 'Alguna respuesta es demasiado larga. Acortala y probá de nuevo.',
    respuesta_invalida: 'Alguna respuesta no es válida. Revisala y probá de nuevo.',
    pregunta_invalida: 'Alguna respuesta no es válida. Revisala y probá de nuevo.',
    bloque_invalido: 'Hubo un problema de nuestro lado. Probá de nuevo en un momento.'
  };

  const S = {
    token: '', textos: {}, bloques: [], pregunta: {}, resp: {}, guardado: {}, idx: 0, ocupado: false, enviado: false
  };

  const $ = (id) => document.getElementById(id);
  const t = (clave) => (S.textos && S.textos[clave]) || POR_DEFECTO[clave] || '';

  function el(tag, props, ...hijos) {
    const e = document.createElement(tag);
    if (props) Object.keys(props).forEach(function (k) {
      if (k === 'className') e.className = props[k];
      else e.setAttribute(k, props[k]);
    });
    hijos.forEach(function (h) { if (h !== null && h !== undefined && h !== false) e.appendChild(typeof h === 'string' ? document.createTextNode(h) : h); });
    return e;
  }

  // ---------------- Pantallas ----------------
  const PANTALLAS = ['pantalla-cargando', 'pantalla-mensaje', 'pantalla-intro', 'wizard', 'pantalla-final'];
  function mostrar(id) {
    PANTALLAS.forEach(function (p) { $(p).classList.toggle('oculto', p !== id); });
    window.scrollTo(0, 0);
  }
  function pantallaMensaje(titulo, texto) {
    $('mensaje-titulo').textContent = titulo;
    $('mensaje-texto').textContent = texto;
    mostrar('pantalla-mensaje');
  }
  function mensaje(tipo, texto) {
    const m = $('mensaje');
    m.className = 'mensaje visible ' + tipo;
    m.textContent = texto;
    m.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  function ocultarMensaje() { $('mensaje').className = 'mensaje'; $('mensaje').textContent = ''; }
  function overlay(visible, titulo) {
    $('overlay-titulo').textContent = titulo || t('guardando');
    $('overlay').classList.toggle('visible', visible);
  }

  // ---------------- Servidor ----------------
  function llamar(accion, extra) {
    const ctrl = new AbortController();
    const to = setTimeout(function () { ctrl.abort(); }, TIMEOUT_MS);
    return fetch(API_URL, {
      method: 'POST', redirect: 'follow', credentials: 'omit', cache: 'no-store', signal: ctrl.signal,
      body: JSON.stringify(Object.assign({ action: accion, token: S.token }, extra || {}))
    }).then(function (r) { return r.json(); })
      .catch(function () { return { ok: false, error: 'red' }; })
      .then(function (r) { clearTimeout(to); return (r && typeof r === 'object') ? r : { ok: false, error: 'error_interno' }; });
  }
  function textoError(cod) {
    if (cod === 'red') return t('error_red');
    return ERRORES[cod] || t('error_generico');
  }

  // ---------------- Estado de respuestas ----------------
  const vacia = function () { return { opciones: [], texto: '', noSe: false }; };
  const snap = function (r) { return JSON.stringify({ o: (r.opciones || []).slice().sort(), t: (r.texto || '').trim(), n: !!r.noSe }); };
  const resp = function (p) { return S.resp[p.id] || (S.resp[p.id] = vacia()); };
  const respondida = function (r) { return !!r && (r.opciones.length > 0 || r.texto.trim() !== '' || r.noSe); };

  function visible(p) {
    if (!p.condicionalDe) return true;
    const padre = S.pregunta[p.condicionalDe];
    if (!padre || !visible(padre)) return false;
    const r = S.resp[padre.id];
    return !!r && r.opciones.some(function (x) { return p.condicionalValores.indexOf(x) >= 0; });
  }
  const faltantes = (b) => b.preguntas.filter(function (p) { return visible(p) && p.obligatoria && !respondida(S.resp[p.id]); });

  function toggleOpcion(p, o) {
    const r = resp(p);
    const i = r.opciones.indexOf(o.id);
    if (p.tipo === 'unica' || p.tipo === 'casilla') r.opciones = i >= 0 ? [] : [o.id];
    else if (i >= 0) r.opciones.splice(i, 1);
    else if (o.esExcluyente) r.opciones = [o.id];
    else {
      r.opciones = r.opciones.filter(function (x) { return !p.opciones.some(function (q) { return q.id === x && q.esExcluyente; }); });
      if (!p.max || r.opciones.length < p.max) r.opciones.push(o.id);
    }
    const hayOtro = r.opciones.some(function (x) { return p.opciones.some(function (q) { return q.id === x && q.esOtro; }); });
    if (!hayOtro) r.texto = '';
  }

  // ---------------- Dibujo de preguntas ----------------
  function tarjeta(p) {
    const r = resp(p);
    const card = el('div', { className: 'pregunta-card', 'data-p': p.id });
    const titulo = el('div', { className: 'pregunta-texto' });
    if (p.tipo !== 'casilla') {
      titulo.appendChild(document.createTextNode(p.texto));
      if (!p.obligatoria) titulo.appendChild(el('span', { className: 'pregunta-opcional' }, 'Opcional'));
      card.appendChild(titulo);
      if (p.ayuda) card.appendChild(el('div', { className: 'pregunta-ayuda' }, p.ayuda));
    }
    const cuerpo = el('div', { className: 'pregunta-cuerpo' });
    card.appendChild(cuerpo);

    if (p.tipo === 'unica' || p.tipo === 'multiple' || p.tipo === 'casilla') {
      if (p.tipo === 'casilla') {
        cuerpo.appendChild(el('p', { className: 'casilla-texto' }, p.texto));
        if (p.ayuda) cuerpo.appendChild(el('p', { className: 'pregunta-ayuda' }, el('a', { href: PRIVACIDAD_URL, target: '_blank', rel: 'noopener' }, t('enlace_privacidad'))));
      }
      if (p.tipo === 'multiple' && p.max) cuerpo.appendChild(el('div', { className: 'pregunta-ayuda' }, 'Podés elegir hasta ' + p.max + '.'));
      const grupo = el('div', { className: 'opciones-cards tipo-' + (p.tipo === 'unica' ? 'unica' : 'multiple') + (p.opciones.length === 1 ? ' una-columna' : '') });
      grupo.setAttribute('role', p.tipo === 'unica' ? 'radiogroup' : 'group');
      p.opciones.forEach(function (o) {
        const sel = r.opciones.indexOf(o.id) >= 0;
        const b = el('button', { type: 'button', className: 'opcion-card' + (sel ? ' seleccionada' : ''), 'data-op': o.id });
        b.setAttribute('role', p.tipo === 'unica' ? 'radio' : 'checkbox');
        b.setAttribute('aria-checked', sel ? 'true' : 'false');
        if (p.tipo === 'multiple' && p.max && !sel && !o.esExcluyente && r.opciones.length >= p.max) b.disabled = true;
        b.appendChild(el('span', { className: 'check', 'aria-hidden': 'true' }, sel ? '✓' : ''));
        b.appendChild(el('span', null, o.texto));
        b.addEventListener('click', function () {
          toggleOpcion(p, o); ocultarMensaje(); dibujarBloque(p.id + '|' + o.id);
        });
        grupo.appendChild(b);
      });
      cuerpo.appendChild(grupo);
      const op = p.opciones.filter(function (o) { return o.esOtro && r.opciones.indexOf(o.id) >= 0; })[0];
      if (op) {
        const inp = el('input', { type: 'text', className: 'otro-texto', maxlength: '300', 'aria-label': op.texto });
        inp.value = r.texto;
        inp.addEventListener('input', function () { r.texto = inp.value; });
        cuerpo.appendChild(inp);
      }
    } else {
      const largo = p.tipo === 'texto_largo';
      const tipoInput = p.tipo === 'telefono' ? 'tel' : (p.tipo === 'correo' ? 'email' : 'text');
      const campo = largo ? el('textarea', { rows: '4', 'aria-label': p.texto }) : el('input', { type: tipoInput, 'aria-label': p.texto, maxlength: p.tipo === 'texto_corto' ? '300' : '160' });
      if (p.tipo === 'telefono') campo.setAttribute('inputmode', 'tel');
      if (p.tipo === 'correo') { campo.setAttribute('inputmode', 'email'); campo.setAttribute('autocomplete', 'off'); }
      campo.value = r.texto;
      campo.disabled = r.noSe;
      campo.addEventListener('input', function () { r.texto = campo.value; card.classList.remove('falta'); const av = card.querySelector('.pregunta-aviso'); if (av) av.remove(); });
      if (p.tipo === 'telefono' || p.tipo === 'correo') {
        campo.addEventListener('blur', function () {
          const v = campo.value.trim();
          const mal = v !== '' && (p.tipo === 'telefono' ? !/^[+()\d\s.\-]{6,}$/.test(v) : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
          const prev = card.querySelector('.pregunta-aviso'); if (prev) prev.remove();
          if (mal) cuerpo.appendChild(el('div', { className: 'pregunta-aviso', role: 'status' }, t('aviso_validacion')));
        });
      }
      cuerpo.appendChild(campo);
      if (p.permiteNoSe) {
        const cb = el('input', { type: 'checkbox', id: 'nose-' + p.id });
        cb.checked = r.noSe;
        cb.addEventListener('change', function () {
          r.noSe = cb.checked;
          if (r.noSe) { r.texto = ''; campo.value = ''; }
          campo.disabled = r.noSe; card.classList.remove('falta');
        });
        cuerpo.appendChild(el('label', { className: 'no-se', 'for': 'nose-' + p.id }, cb, el('span', null, t('etiqueta_no_se'))));
      }
    }
    return card;
  }

  function dibujarBloque(enfocar) {
    const b = S.bloques[S.idx];
    $('titulo-bloque').textContent = b.nombre;
    $('subtitulo-bloque').textContent = b.descripcion || '';
    const cont = $('contenido-bloque');
    const y = window.scrollY;
    cont.textContent = '';
    b.preguntas.filter(visible).forEach(function (p) { cont.appendChild(tarjeta(p)); });
    if (enfocar) {
      const partes = enfocar.split('|');
      const card = cont.querySelector('[data-p="' + partes[0] + '"]');
      const btn = card && card.querySelector('[data-op="' + partes[1] + '"]');
      if (btn) btn.focus({ preventScroll: true });
      window.scrollTo(0, y);
    }
    dibujarProgreso();
    actualizarNav();
  }

  function dibujarProgreso() {
    const total = S.bloques.length;
    const pct = Math.round((S.idx / total) * 100);
    $('relleno').style.width = pct + '%';
    $('relleno-mobile').style.width = pct + '%';
    $('progreso-texto').textContent = pct + '% completado';
    const nav = $('sidebar-bloques');
    nav.textContent = '';
    S.bloques.forEach(function (b, i) {
      const estado = i < S.idx ? 'completado' : (i === S.idx ? 'actual' : 'pendiente');
      nav.appendChild(el('div', { className: 'item-bloque ' + estado }, el('span', { className: 'marca' }, i < S.idx ? '✓' : String(i + 1)), el('span', null, b.nombre)));
    });
  }

  function actualizarNav() {
    const ultimo = S.idx === S.bloques.length - 1;
    $('btn-anterior').textContent = '← ' + t('boton_atras');
    $('btn-anterior').classList.toggle('oculto', S.idx === 0);
    $('btn-siguiente').textContent = ultimo ? t('boton_enviar') : t('boton_siguiente') + ' →';
    $('btn-guardar').textContent = t('boton_guardar');
    let bloqueada = false;
    if (ultimo) {
      bloqueada = S.bloques[S.idx].preguntas.some(function (p) { return p.tipo === 'casilla' && p.obligatoria && visible(p) && !respondida(S.resp[p.id]); });
    }
    $('btn-siguiente').disabled = bloqueada;
    $('nota-envio').classList.toggle('oculto', !bloqueada);
    $('nota-envio').textContent = bloqueada ? t('sin_aceptacion') : '';
  }

  // ---------------- Guardado ----------------
  async function guardarBloque(b) {
    const entradas = [];
    b.preguntas.forEach(function (p) {
      const r = S.resp[p.id] || vacia();
      if (snap(r) !== (S.guardado[p.id] || snap(vacia()))) {
        entradas.push({ idPregunta: p.id, opciones: r.opciones.slice(), texto: r.texto.trim(), noSe: !!r.noSe });
      }
    });
    if (!entradas.length) return { ok: true };
    const res = await llamar('guardarBloque', { bloque: b.orden, respuestas: entradas });
    if (res.ok) entradas.forEach(function (e) { S.guardado[e.idPregunta] = snap(e); });
    return res;
  }

  function errorFatal(cod) {
    if (cod === 'enlace_no_disponible') { pantallaMensaje('Enlace no disponible', t('enlace_no_disponible')); return true; }
    if (cod === 'ya_enviada') { pantallaMensaje('Respuestas recibidas', t('ya_enviado')); return true; }
    return false;
  }

  function marcarFaltantes(lista) {
    lista.forEach(function (p) { const c = document.querySelector('[data-p="' + p.id + '"]'); if (c) c.classList.add('falta'); });
    if (lista.length) {
      const c = document.querySelector('[data-p="' + lista[0].id + '"]');
      if (c) c.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }

  async function siguiente() {
    if (S.ocupado) return;
    ocultarMensaje();
    const b = S.bloques[S.idx];
    const falta = faltantes(b);
    if (falta.length) { mensaje('error', t('faltan_respuestas')); marcarFaltantes(falta); return; }
    S.ocupado = true; overlay(true, t('guardando'));
    const g = await guardarBloque(b);
    overlay(false); S.ocupado = false;
    if (!g.ok) { if (!errorFatal(g.error)) mensaje('error', textoError(g.error)); return; }
    if (S.idx === S.bloques.length - 1) return enviar();
    S.idx++; irArriba();
  }

  async function enviar() {
    S.ocupado = true; overlay(true, t('enviando'));
    const e = await llamar('enviarSolicitud');
    overlay(false); S.ocupado = false;
    if (e.ok) {
      S.enviado = true;
      $('final-titulo').textContent = t('final_titulo');
      $('final-texto').textContent = t('final_texto');
      mostrar('pantalla-final');
      return;
    }
    if (errorFatal(e.error)) return;
    if (e.error === 'falta_aceptacion') { mensaje('error', t('sin_aceptacion')); return; }
    if (e.error === 'faltan' && Array.isArray(e.faltan) && e.faltan.length) {
      const idx = S.bloques.findIndex(function (bl) { return bl.preguntas.some(function (p) { return e.faltan.indexOf(p.id) >= 0; }); });
      const otroBloque = idx >= 0 && idx !== S.idx;
      if (otroBloque) { S.idx = idx; irArriba(); }
      mensaje('error', otroBloque ? t('faltan_en_otro_bloque') : t('faltan_respuestas'));
      marcarFaltantes(S.bloques[S.idx].preguntas.filter(function (p) { return e.faltan.indexOf(p.id) >= 0; }));
      return;
    }
    mensaje('error', textoError(e.error));
  }

  async function atras() {
    if (S.ocupado || S.idx === 0) return;
    ocultarMensaje();
    guardarBloque(S.bloques[S.idx]);   // mejor esfuerzo, sin bloquear
    S.idx--; irArriba();
  }

  async function guardarYSalir() {
    if (S.ocupado) return;
    ocultarMensaje();
    S.ocupado = true; overlay(true, t('guardando'));
    const g = await guardarBloque(S.bloques[S.idx]);
    overlay(false); S.ocupado = false;
    if (!g.ok) { if (!errorFatal(g.error)) mensaje('error', textoError(g.error)); return; }
    mensaje('exito', t('guardado_salir'));
  }

  function irArriba() {
    dibujarBloque();
    window.scrollTo(0, 0);
    $('titulo-bloque').focus({ preventScroll: true });
  }

  // ---------------- Inicio ----------------
  function indiceInicial() {
    for (let i = 0; i < S.bloques.length; i++) if (faltantes(S.bloques[i]).length) return i;
    return S.bloques.length - 1;
  }

  function prepararFormulario(r) {
    S.textos = r.textos || {};
    S.bloques = r.bloques || [];
    S.pregunta = {};
    S.bloques.forEach(function (b) { b.preguntas.forEach(function (p) { S.pregunta[p.id] = p; }); });
    S.resp = {}; S.guardado = {};
    Object.keys(r.respuestas || {}).forEach(function (id) {
      const x = r.respuestas[id];
      S.resp[id] = { opciones: (x.opciones || []).slice(), texto: x.texto || '', noSe: !!x.noSe };
      S.guardado[id] = snap(S.resp[id]);
    });
    if (r.borrador) { const b = $('banner-borrador'); b.textContent = t('borrador_banner') || 'BORRADOR · Formulario en revisión. No usar con clientes reales.'; b.classList.remove('oculto'); }
    $('intro-titulo').textContent = t('inicio_titulo');
    $('intro-texto').textContent = t('inicio_texto');
    $('intro-pill-1').textContent = '⏱ ' + t('inicio_indicador_1');
    $('intro-pill-2').textContent = '💾 ' + t('inicio_indicador_2');
    $('intro-pill-3').textContent = '🔒 ' + t('inicio_indicador_3');
    $('btn-empezar').textContent = t('inicio_boton');
    $('intro-privacidad').textContent = t('enlace_privacidad');
    $('sidebar-nota').textContent = t('sidebar_nota');
    document.title = (t('inicio_titulo') || 'Solicitud') + ' · ElevaLab';
  }

  async function iniciar() {
    if (API_URL.indexOf('PEGAR_AQUI') === 0) { pantallaMensaje('Formulario en preparación', t('config_pendiente')); return; }
    const hash = (location.hash || '').replace(/^#/, '');
    if (!/^[0-9a-f]{64}$/.test(hash)) { pantallaMensaje('Enlace no disponible', t('enlace_no_disponible')); return; }
    S.token = hash;
    const r = await llamar('obtenerFormulario');
    if (!r.ok) {
      if (r.error === 'red') { pantallaMensaje('No pudimos conectar', t('error_red')); return; }
      if (!errorFatal(r.error)) pantallaMensaje('Algo salió mal', textoError(r.error));
      return;
    }
    if (r.estado === 'Enviada') {
      S.textos = r.textos || {};
      if (r.borrador) { const b = $('banner-borrador'); b.textContent = t('borrador_banner'); b.classList.remove('oculto'); }
      pantallaMensaje('Respuestas recibidas', t('ya_enviado'));
      return;
    }
    prepararFormulario(r);
    mostrar('pantalla-intro');
  }

  $('btn-empezar').addEventListener('click', function () {
    S.idx = indiceInicial();
    mostrar('wizard');
    irArriba();
  });
  $('btn-siguiente').addEventListener('click', siguiente);
  $('btn-anterior').addEventListener('click', atras);
  $('btn-guardar').addEventListener('click', guardarYSalir);

  // Si cambia el enlace (por ejemplo, se pega otro en la misma pestaña), se vuelve a empezar.
  window.addEventListener('hashchange', function () { location.reload(); });

  iniciar();
})();
