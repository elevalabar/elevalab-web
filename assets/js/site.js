// ─────────────────────────────────────────────
// ELEVA LAB — datos y componentes compartidos del sitio público.
// Todo lo editable a futuro (redes, proyectos) vive ACÁ, en un
// solo lugar, para no tener que tocar los 4 archivos .html.
// ─────────────────────────────────────────────

// Redes / enlaces externos.
// Completar github, linkedin y cv apenas existan esas URLs.
// Mientras estén vacíos ("") el sitio los muestra como "Próximamente"
// en vez de inventar un enlace.
const REDES = {
  instagram: 'https://instagram.com/elevalab.ar',
  github: '',
  linkedin: '',
  cv: ''
};

// Catálogo de proyectos. Fuente única para la vista resumida (home)
// y la vista completa (/proyectos/).
//
// estado: 'en-vivo' | 'prototipo' | 'interno'
// url: dejar '' si todavía no hay un enlace público real — el sitio
//      NUNCA inventa una URL, muestra "Enlace próximamente" o
//      "Herramienta interna" según corresponda.
// tecnologias: dejar [] si todavía no está confirmado.
const PROYECTOS = [
  {
    id: 'eva-spa',
    nombre: 'Eva Spa',
    categoria: 'Categoría a definir',
    estado: 'prototipo',
    descripcionBreve: 'Descripción pendiente de completar.',
    problema: 'Contenido pendiente — completar con el problema u objetivo real del proyecto.',
    construido: 'Contenido pendiente — completar con lo que efectivamente se construyó.',
    tecnologias: [],
    url: ''
  },
  {
    id: 'el-burdel',
    nombre: 'El Burdel',
    categoria: 'Categoría a definir',
    estado: 'prototipo',
    descripcionBreve: 'Descripción pendiente de completar.',
    problema: 'Contenido pendiente — completar con el problema u objetivo real del proyecto.',
    construido: 'Contenido pendiente — completar con lo que efectivamente se construyó.',
    tecnologias: [],
    url: ''
  },
  {
    id: 'yca',
    nombre: 'YCA',
    categoria: 'Categoría a definir',
    estado: 'prototipo',
    descripcionBreve: 'Descripción pendiente de completar.',
    problema: 'Contenido pendiente — completar con el problema u objetivo real del proyecto.',
    construido: 'Contenido pendiente — completar con lo que efectivamente se construyó.',
    tecnologias: [],
    url: ''
  },
  {
    id: 'bot-discord',
    nombre: 'Bot de Discord',
    categoria: 'Automatización',
    estado: 'prototipo',
    descripcionBreve: 'Descripción pendiente de completar.',
    problema: 'Contenido pendiente — completar con el problema u objetivo real del proyecto.',
    construido: 'Contenido pendiente — completar con lo que efectivamente se construyó.',
    tecnologias: [],
    url: ''
  },
  {
    id: 'gestion-comercios',
    nombre: 'Gestión de comercios',
    categoria: 'Herramienta interna · Eleva Lab',
    estado: 'interno',
    descripcionBreve: 'Herramienta interna para relevar y dar seguimiento a comercios: fichas, auditorías, diagnóstico y prospección.',
    problema: 'Centralizar el relevamiento y seguimiento de comercios en un solo lugar, en vez de planillas sueltas.',
    construido: 'Una aplicación web con alta y ficha de comercios, cuestionarios de auditoría e inspección, un diagnóstico digital y un módulo de prospección desde datos de Google Maps.',
    tecnologias: ['Google Apps Script', 'Google Sheets', 'JavaScript'],
    url: ''
  }
];

const ICONO_ENLACE_EXTERNO = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/></svg>';

const ETIQUETAS_ESTADO = {
  'en-vivo': { texto: 'En vivo', clase: 'en-vivo' },
  'prototipo': { texto: 'Prototipo', clase: 'prototipo' },
  'interno': { texto: 'Uso interno', clase: 'interno' }
};

function pildoraEstado(estado) {
  const info = ETIQUETAS_ESTADO[estado] || ETIQUETAS_ESTADO.prototipo;
  return `<span class="pildora-estado ${info.clase}"><span class="punto"></span>${info.texto}</span>`;
}

function enlaceProyecto(p) {
  if (p.url) {
    return `<a href="${p.url}" target="_blank" rel="noopener">Ver proyecto ${ICONO_ENLACE_EXTERNO}</a>`;
  }
  if (p.estado === 'interno') {
    return `<span class="sin-enlace">Herramienta interna — sin acceso público</span>`;
  }
  return `<span class="sin-enlace">Enlace próximamente</span>`;
}

// ── Nav ──────────────────────────────────────────────────────
function renderNavSitio(activo, base) {
  base = base || '';
  const contenedor = document.getElementById('nav-sitio');
  if (!contenedor) return;

  contenedor.innerHTML = `
    <div class="contenedor">
      <a class="marca-sitio" href="${base}index.html">
        <span class="punto-estado" aria-hidden="true"></span>
        ELEVA LAB
      </a>
      <button class="btn-menu-movil" id="btnMenuMovil" aria-label="Abrir menú" aria-expanded="false" aria-controls="enlacesNav">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <nav class="enlaces-nav" id="enlacesNav" aria-label="Navegación principal">
        <a href="${base}index.html" class="${activo === 'inicio' ? 'activo' : ''}">Inicio</a>
        <a href="${base}proyectos/index.html" class="${activo === 'proyectos' ? 'activo' : ''}">Proyectos</a>
        <a href="${base}sobre/index.html" class="${activo === 'sobre' ? 'activo' : ''}">Sobre</a>
        <a href="${base}contacto/index.html" class="${activo === 'contacto' ? 'activo' : ''}">Contacto</a>
      </nav>
    </div>
  `;

  const btn = document.getElementById('btnMenuMovil');
  const enlaces = document.getElementById('enlacesNav');
  btn.addEventListener('click', () => {
    const abierto = enlaces.classList.toggle('abierto');
    btn.setAttribute('aria-expanded', String(abierto));
  });
}

// ── Footer ───────────────────────────────────────────────────
function celdaRed(nombre, url) {
  if (url) {
    return `<li><a href="${url}" target="_blank" rel="noopener">${nombre}</a></li>`;
  }
  return `<li><span class="pendiente">${nombre} — próximamente</span></li>`;
}

function renderFooterSitio(base) {
  base = base || '';
  const contenedor = document.getElementById('pie-sitio');
  if (!contenedor) return;

  contenedor.innerHTML = `
    <div class="contenedor">
      <div class="pie-grid">
        <div class="pie-marca">
          <a class="marca-sitio" href="${base}index.html">
            <span class="punto-estado" aria-hidden="true"></span>
            ELEVA LAB
          </a>
          <p>Un proyecto de Sebastián Quiven para ayudar a negocios a crecer con tecnología.</p>
        </div>
        <div class="pie-columna">
          <h4>Explorar</h4>
          <ul>
            <li><a href="${base}index.html">Inicio</a></li>
            <li><a href="${base}proyectos/index.html">Proyectos</a></li>
            <li><a href="${base}sobre/index.html">Sobre Eleva Lab</a></li>
            <li><a href="${base}contacto/index.html">Contacto</a></li>
          </ul>
        </div>
        <div class="pie-columna">
          <h4>Redes</h4>
          <ul>
            ${celdaRed('Instagram', REDES.instagram)}
            ${celdaRed('GitHub', REDES.github)}
            ${celdaRed('LinkedIn', REDES.linkedin)}
            ${celdaRed('CV', REDES.cv)}
          </ul>
        </div>
      </div>
      <div class="pie-base">
        © ${new Date().getFullYear()} Eleva Lab. Marca en construcción.
      </div>
    </div>
  `;
}

// ── Tarjetas de proyecto (home — versión resumida) ───────────
function renderTarjetasProyectos(idContenedor) {
  const cont = document.getElementById(idContenedor);
  if (!cont) return;

  cont.innerHTML = PROYECTOS.map(p => `
    <article class="tarjeta-proyecto">
      <div class="cabecera-tarjeta">
        <h3>${p.nombre}</h3>
        ${pildoraEstado(p.estado)}
      </div>
      <div class="categoria-proyecto">${p.categoria}</div>
      <p class="descripcion-proyecto">${p.descripcionBreve}</p>
      <div class="pie-tarjeta">${enlaceProyecto(p)}</div>
    </article>
  `).join('');
}

// ── Listado completo (/proyectos/) ───────────────────────────
function renderListaProyectosCompleta(idContenedor) {
  const cont = document.getElementById(idContenedor);
  if (!cont) return;

  cont.innerHTML = PROYECTOS.map(p => `
    <article class="entrada-proyecto" id="${p.id}">
      <div class="columna-meta">
        <h3>${p.nombre}</h3>
        ${pildoraEstado(p.estado)}
        <div class="categoria-proyecto">${p.categoria}</div>
        ${enlaceProyecto(p)}
      </div>
      <div class="columna-detalle">
        <div class="bloque-campo">
          <div class="titulo-campo">Problema / objetivo</div>
          <p>${p.problema}</p>
        </div>
        <div class="bloque-campo">
          <div class="titulo-campo">Qué se construyó</div>
          <p>${p.construido}</p>
        </div>
        <div class="bloque-campo">
          <div class="titulo-campo">Tecnologías</div>
          ${p.tecnologias.length
            ? `<ul class="lista-tecnologias">${p.tecnologias.map(t => `<li>${t}</li>`).join('')}</ul>`
            : `<p>Por confirmar.</p>`}
        </div>
      </div>
    </article>
  `).join('');
}
