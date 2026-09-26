// ─────────────────────────────────────────────
// ELEVALAB — datos y componentes compartidos del sitio público.
// Todo lo editable (redes, proyectos, navegación) vive ACÁ, en un
// solo lugar, para no tener que tocar los archivos .html.
// ─────────────────────────────────────────────

// Redes / enlaces externos.
// Completar github, linkedin y cv apenas existan esas URLs.
// Mientras estén vacíos ("") el sitio muestra "Próximamente".
const REDES = {
  instagram: 'https://instagram.com/elevalab.ar',
  github: '',
  linkedin: '',
  cv: ''
};

// Texto descriptivo de cada canal (se usa en Contacto).
const REDES_INFO = [
  { clave: 'instagram', nombre: 'Instagram', detalle: '@elevalab.ar' },
  { clave: 'github', nombre: 'GitHub', detalle: 'Repositorios de ElevaLab' },
  { clave: 'linkedin', nombre: 'LinkedIn', detalle: 'Sebastián Quiven' },
  { clave: 'cv', nombre: 'CV', detalle: 'Currículum de Sebastián Quiven' }
];

// Logo (relativo a la raíz del sitio; se le antepone `base`).
const LOGO = 'assets/img/logo-oscuro.png';

// Navegación principal.
const NAV = [
  { id: 'inicio', texto: 'Inicio', ruta: 'index.html' },
  { id: 'sobre', texto: 'Sobre', ruta: 'sobre/index.html' },
  { id: 'proyectos', texto: 'Proyectos', ruta: 'proyectos/index.html' },
  { id: 'contacto', texto: 'Contacto', ruta: 'contacto/index.html' }
];

// Catálogo de proyectos. Fuente única para la home y /proyectos/.
//
// estado: 'en-vivo' | 'prototipo' | 'interno'
// pendiente: true mientras el proyecto no tenga información real
//            (el sitio muestra "Ficha en preparación" y no los textos de relleno).
// url: dejar '' si no hay un enlace público real — el sitio NUNCA inventa una URL.
// textoSinEnlace: mensaje opcional para cuando no hay url (ej. "Bot privado, sin acceso público").
//                  Si no se define, el sitio usa el mensaje genérico según el estado.
// tecnologias: dejar [] si todavía no está confirmado.
const PROYECTOS = [
  {
    id: 'eva-spa',
    nombre: 'Eva Spa',
    categoria: 'Categoría a definir',
    estado: 'prototipo',
    pendiente: true,
    descripcionBreve: 'Descripción pendiente de completar.',
    problema: 'Contenido pendiente — completar con el problema u objetivo real del proyecto.',
    construido: 'Contenido pendiente — completar con lo que efectivamente se construyó.',
    tecnologias: [],
    url: ''
  },
  {
    id: 'el-burdel',
    nombre: 'El Burdel',
    categoria: 'Plataforma modular de juegos y dinámicas',
    estado: 'en-vivo',
    pendiente: false,
    descripcionBreve: 'El Burdel es una plataforma web privada de dinámicas y minijuegos para una comunidad cerrada, con usuarios, administración propia, sesiones en vivo, puntuación y contenido.',
    problema: 'Darle a una comunidad un espacio propio para centralizar juego, participación, ranking y contenido, con acceso controlado y administración propia.',
    construido: 'Un dashboard privado con sesiones de juego en vivo (Taboo, Wordle, El Impostor, ¿Quién Soy?, El Millonario y Ruleta), ranking global y tests de personalidad grupal, además de noticias, galería de fotos, reproductor de música y horóscopo diario y mensual. Se completa con un panel de administración modular, herramientas de control de usuarios y sesiones, landing pública y páginas legales.',
    aporte: 'Diagnóstico y resolución de problemas de registro y autenticación, rediseño UX y modularización del panel de administración, desarrollo de los módulos de Tests y Horóscopo —este último automatizado con Google Apps Script y la API de Gemini—, mejoras del sistema de música, rediseño de la landing pública y desarrollo de la galería.',
    potencial: 'El Burdel nació para una comunidad privada concreta, pero su combinación de usuarios, administración, dinámicas en vivo, puntuación, ranking y contenido funciona como una base adaptable a otro tipo de experiencias interactivas: eventos y cumpleaños, encuentros recreativos para grupos, sistemas de puntos y desafíos para gimnasios, dinámicas para clubes o comunidades, o experiencias para salones y otros espacios. Por ahora esto es potencial de la arquitectura, no un servicio que ElevaLab ofrezca hoy.',
    tecnologias: ['HTML5', 'CSS3', 'JavaScript (ES6)', 'Firebase Authentication', 'Firebase Realtime Database', 'Google Apps Script', 'Google Drive', 'Gemini API', 'GitHub Pages'],
    url: 'https://elburdel.com.ar',
    textoEnlace: 'Visitar El Burdel ↗'
  },
  {
    id: 'yca',
    nombre: 'YCA Cerámica',
    categoria: 'Plataforma web y sistema de gestión para un taller de cerámica',
    estado: 'en-vivo',
    pendiente: false,
    descripcionBreve: 'YCA Cerámica es el sitio de un taller de cerámica artesanal en Buenos Aires que combina un catálogo público con un sistema privado de gestión para administrar cursos, alumnos, inventario, pagos y producción.',
    problema: 'Centralizar la gestión de un taller artesanal que necesitaba manejar catálogo, insumos, cursos, alumnos, pagos, documentación y seguimiento de horneados desde un mismo lugar, en vez de procesos dispersos.',
    construido: 'Un sistema con una parte pública y un entorno privado de gestión: catálogo de piezas e insumos con filtros, catálogo de pastas cerámicas con códigos internos, cursos con inscripción y estados, y un área privada para alumnos. El panel de administración cubre inventario, galería y pagos, con generación de contratos y comprobantes en PDF, envío de emails a suscriptores, etiquetas con código QR y seguimiento de pedidos de horneado, además de calculadoras técnicas de yeso, engobes, cocción, contracción, absorción y costos.',
    aporte: 'Desarrollo integral del sistema: la totalidad del frontend, el panel de administración, el panel contable, las calculadoras técnicas y de costos, el seguimiento de horneados mediante QR y el sistema de autenticación, además de la integración del frontend con Google Apps Script y las automatizaciones para PDFs, archivos y Google Drive. También mejoras posteriores como el catálogo de pastas con códigos, el historial de cálculos y las herramientas de comunicación con alumnos y suscriptores.',
    potencial: 'YCA Cerámica nació para un taller artesanal concreto, pero su combinación de catálogo público, panel privado de gestión, administración de alumnos o clientes, inventario, pagos, documentos, automatizaciones y seguimiento de trabajos mediante estados funciona como una base adaptable a otras actividades: talleres y espacios de oficios, academias o centros de formación, estudios o profesionales que trabajan con turnos, alumnos o clientes, y emprendimientos que combinan catálogo con gestión interna. Por ahora esto es potencial de la arquitectura, no un servicio que ElevaLab ofrezca hoy.',
    tecnologias: ['HTML5', 'CSS3', 'JavaScript (ES6)', 'Google Apps Script', 'Google Sheets', 'Google Drive', 'jsPDF', 'Códigos QR', 'GitHub Pages'],
    url: 'https://ycaceramica.com.ar',
    textoEnlace: 'Visitar YCA Cerámica ↗'
  },
  {
    id: 'bot-discord',
    nombre: 'Bot de Discord',
    categoria: 'Automatización',
    estado: 'prototipo',
    pendiente: true,
    descripcionBreve: 'Descripción pendiente de completar.',
    problema: 'Contenido pendiente — completar con el problema u objetivo real del proyecto.',
    construido: 'Contenido pendiente — completar con lo que efectivamente se construyó.',
    tecnologias: [],
    url: ''
  },
  {
    id: 'gestion-comercios',
    nombre: 'Gestión de comercios',
    categoria: 'Herramienta interna · ElevaLab',
    estado: 'interno',
    pendiente: false,
    descripcionBreve: 'Herramienta interna para relevar y dar seguimiento a comercios: fichas, auditorías, diagnóstico y prospección.',
    problema: 'Centralizar el relevamiento y seguimiento de comercios en un solo lugar, en vez de planillas sueltas.',
    construido: 'Una aplicación web con alta y ficha de comercios, cuestionarios de auditoría e inspección, un diagnóstico digital y un módulo de prospección desde datos de Google Maps.',
    tecnologias: ['Google Apps Script', 'Google Sheets', 'JavaScript'],
    url: ''
  },
  {
    id: 'burdel-bot',
    nombre: 'Bot de automatización para Discord',
    categoria: 'Automatización para una comunidad de Discord',
    estado: 'en-vivo',
    pendiente: false,
    descripcionBreve: 'Es un bot privado que funciona 24/7 dentro de una comunidad de Discord, automatizando contenido, membresía y organización del servidor.',
    problema: 'Automatizar tareas que antes requerían intervención manual dentro de una comunidad de Discord: compartir contenido de redes sociales, controlar la actividad de los miembros y evitar que el canal principal se volviera un historial interminable.',
    construido: 'Un bot que detecta y procesa links de Instagram, TikTok, X/Twitter y YouTube para publicarlos dentro de Discord, gestiona automáticamente la membresía —cambiando el estado de usuarios inactivos, reincorporándolos si vuelven a participar y expulsándolos si la inactividad se mantiene— y archiva el canal principal cada mes, creando uno nuevo con los permisos correspondientes. Se completa con funciones sociales como cumpleaños, salas en vivo, roles y agenda deportiva diaria.',
    aporte: 'Desarrollo del sistema de gestión de actividad y membresía, diseño de las reglas de inactividad, reincorporación y expulsión, implementación del archivado automático, migración y evolución de la infraestructura, integración y mantenimiento de los servicios externos, y resolución de incidentes reales en producción.',
    potencial: 'Nació para una comunidad de Discord concreta, pero sus mecanismos de gestión de membresía, archivado y notificaciones funcionan como una base adaptable a otras comunidades privadas, clubes o grupos de socios que necesiten automatizar moderación, recordatorios o seguimiento de actividad. Por ahora esto es potencial de la arquitectura, no un servicio que ElevaLab ofrezca hoy.',
    tecnologias: ['Node.js', 'discord.js v14', 'Discord API', 'ESPN', 'TheSportsDB', 'Cloudflare Tunnel', 'PM2', 'Termux (Android)'],
    url: '',
    textoSinEnlace: 'Bot privado, sin acceso público'
  }
];

const ETIQUETAS_ESTADO = {
  'en-vivo': 'En vivo',
  'prototipo': 'Prototipo',
  'interno': 'Interno'
};

const ICONO_MENU = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></svg>';

// ── Helpers ──────────────────────────────────────────────────
function indicadorEstado(estado) {
  const clave = ETIQUETAS_ESTADO[estado] ? estado : 'prototipo';
  return `<span class="estado ${clave}"><i aria-hidden="true"></i>${ETIQUETAS_ESTADO[clave]}</span>`;
}

function numeroProyecto(i) {
  return String(i + 1).padStart(2, '0');
}

function categoriaProyecto(p) {
  return p.categoria === 'Categoría a definir' ? 'Ficha en preparación' : p.categoria;
}

function enlaceProyecto(p) {
  if (p.url) {
    const texto = p.textoEnlace || 'Ver proyecto ↗';
    return `<a class="enlace" href="${p.url}" target="_blank" rel="noopener">${texto}</a>`;
  }
  if (p.textoSinEnlace) {
    return `<span class="sin-enlace">${p.textoSinEnlace}</span>`;
  }
  if (p.estado === 'interno') {
    return `<span class="sin-enlace">Herramienta interna, sin acceso público</span>`;
  }
  return `<span class="sin-enlace">Enlace próximamente</span>`;
}

// ── Nav ──────────────────────────────────────────────────────
function renderNavSitio(activo, base) {
  base = base || '';
  document.body.insertAdjacentHTML('afterbegin', '<a class="skip" href="#contenido">Ir al contenido</a>');

  const contenedor = document.getElementById('nav-sitio');
  if (!contenedor) return;

  const enlaces = NAV.map(n =>
    `<a href="${base}${n.ruta}"${n.id === activo ? ' aria-current="page"' : ''}>${n.texto}</a>`
  ).join('');

  contenedor.innerHTML = `
    <div class="contenedor">
      <a class="marca" href="${base}index.html">
        <img src="${base}${LOGO}" alt="" width="34" height="34">
        ElevaLab
      </a>
      <button class="btn-menu" id="btnMenu" type="button" aria-label="Abrir menú" aria-expanded="false" aria-controls="enlacesNav">${ICONO_MENU}</button>
      <nav class="enlaces" id="enlacesNav" aria-label="Navegación principal">${enlaces}</nav>
    </div>
  `;

  const btn = document.getElementById('btnMenu');
  const nav = document.getElementById('enlacesNav');
  const fijar = abierto => {
    nav.classList.toggle('abierto', abierto);
    btn.setAttribute('aria-expanded', String(abierto));
    btn.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
  };
  btn.addEventListener('click', () => fijar(!nav.classList.contains('abierto')));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('abierto')) {
      fijar(false);
      btn.focus();
    }
  });
}

// ── Footer ───────────────────────────────────────────────────
function renderFooterSitio(base) {
  base = base || '';
  const contenedor = document.getElementById('pie-sitio');
  if (!contenedor) return;

  const redes = REDES_INFO.map(r => REDES[r.clave]
    ? `<li><a href="${REDES[r.clave]}" target="_blank" rel="noopener">${r.nombre}</a></li>`
    : `<li><span class="pendiente">${r.nombre}, próximamente</span></li>`
  ).join('');
  const explorar = NAV.map(n => `<li><a href="${base}${n.ruta}">${n.texto}</a></li>`).join('');

  contenedor.innerHTML = `
    <div class="contenedor">
      <div class="pie-grid">
        <div>
          <a class="pie-marca" href="${base}index.html">
            <img src="${base}${LOGO}" alt="" width="56" height="56">
            <span>ElevaLab</span>
          </a>
          <p class="pie-frase">Tecnología para que los negocios avancen.</p>
        </div>
        <div>
          <h2 class="pie-tit">Explorar</h2>
          <ul>${explorar}</ul>
        </div>
        <div>
          <h2 class="pie-tit">Redes</h2>
          <ul>${redes}</ul>
        </div>
      </div>
      <div class="pie-base">
        <span>© ${new Date().getFullYear()} ElevaLab</span>
        <span>Un proyecto de Sebastián Quiven</span>
        <span>Marca en construcción</span>
      </div>
    </div>
  `;
}

// ── Franja de estado (home) — calculada desde PROYECTOS ──────
function renderEstadoLab(idContenedor) {
  const cont = document.getElementById(idContenedor);
  if (!cont) return;

  const cuenta = e => PROYECTOS.filter(p => p.estado === e).length;
  const estados = Object.keys(ETIQUETAS_ESTADO)
    .filter(e => cuenta(e) > 0)
    .map(e => `<span class="estado ${e}"><i aria-hidden="true"></i>${ETIQUETAS_ESTADO[e]} <b>${cuenta(e)}</b></span>`)
    .join('');

  cont.innerHTML = `
    <div class="contenedor">
      <span class="mono">${PROYECTOS.length} proyectos registrados</span>
      ${estados}
    </div>
  `;
}

// ── Índice de proyectos (home y arriba de /proyectos/) ───────
// prefijo: '' en /proyectos/ (ancla local) o 'proyectos/index.html' desde la home.
function renderIndiceProyectos(idContenedor, prefijo) {
  const cont = document.getElementById(idContenedor);
  if (!cont) return;
  prefijo = prefijo || '';

  cont.innerHTML = PROYECTOS.map((p, i) => `
    <li>
      <a class="fila-proy" href="${prefijo}#${p.id}">
        <span class="fp-num mono">${numeroProyecto(i)}</span>
        <span class="fp-nombre">${p.nombre}</span>
        <span class="fp-cat">${categoriaProyecto(p)}</span>
        ${indicadorEstado(p.estado)}
        <span class="fp-flecha" aria-hidden="true">↗</span>
      </a>
    </li>
  `).join('');
}

// ── Listado completo (/proyectos/) ───────────────────────────
function renderListaProyectosCompleta(idContenedor) {
  const cont = document.getElementById(idContenedor);
  if (!cont) return;

  cont.innerHTML = PROYECTOS.map((p, i) => {
    const tecnologias = p.tecnologias.length
      ? `<ul class="tec">${p.tecnologias.map(t => `<li>${t}</li>`).join('')}</ul>`
      : 'Por confirmar.';

    const aporte = p.aporte
      ? `<div><dt>Mi aporte</dt><dd>${p.aporte}</dd></div>`
      : '';
    const potencial = p.potencial
      ? `<div><dt>Potencial de adaptación</dt><dd>${p.potencial}</dd></div>`
      : '';

    const cuerpo = p.pendiente
      ? `<p class="pr-pend">Ficha en preparación. Este proyecto todavía no tiene descripción pública.</p>`
      : `
        <p class="pr-desc">${p.descripcionBreve}</p>
        <dl class="pr-datos">
          <div><dt>Problema / objetivo</dt><dd>${p.problema}</dd></div>
          <div><dt>Qué se construyó</dt><dd>${p.construido}</dd></div>
          <div><dt>Tecnologías</dt><dd>${tecnologias}</dd></div>
          ${aporte}
          ${potencial}
        </dl>`;

    return `
      <article class="proyecto" id="${p.id}">
        <div class="pr-num" aria-hidden="true">${numeroProyecto(i)}</div>
        <div class="pr-cuerpo">
          <div class="pr-top">
            ${indicadorEstado(p.estado)}
            <span class="pr-cat">${categoriaProyecto(p)}</span>
          </div>
          <h2>${p.nombre}</h2>
          ${cuerpo}
          <div>${enlaceProyecto(p)}</div>
        </div>
      </article>
    `;
  }).join('');
}

// ── Contacto ─────────────────────────────────────────────────
function renderContactoSitio(idContenedor) {
  const cont = document.getElementById(idContenedor);
  if (!cont) return;

  const [principal, ...resto] = REDES_INFO;
  const destacado = REDES[principal.clave]
    ? `<a class="ig" href="${REDES[principal.clave]}" target="_blank" rel="noopener">
         <span class="mono">Canal directo hoy: ${principal.nombre}</span>
         <span class="ig-nombre">${principal.detalle}</span>
         <span class="ig-flecha" aria-hidden="true">↗</span>
       </a>`
    : '';

  const filas = (destacado ? resto : REDES_INFO).map(r => {
    const valor = REDES[r.clave]
      ? `<a class="enlace" href="${REDES[r.clave]}" target="_blank" rel="noopener">Abrir ↗</a>`
      : `<span class="pendiente">Próximamente</span>`;
    return `<li><div><b>${r.nombre}</b><small>${r.detalle}</small></div>${valor}</li>`;
  }).join('');

  cont.innerHTML = destacado + `<ul class="canales">${filas}</ul>`;
}
