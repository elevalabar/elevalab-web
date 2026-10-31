/* Santa Vaina — renderiza la página desde datos.js. Sin dependencias. */
(function () {
  var D = window.SV, C = D.contacto;
  var $ = function (s, r) { return (r || document).querySelector(s); };

  function wa(texto) {
    return "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(texto);
  }
  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt) e.textContent = txt;
    return e;
  }
  function slot(imagen, alt, etiqueta) {
    var f = el("div", "slot");
    if (imagen) {
      var i = new Image(); i.src = imagen; i.alt = alt || ""; i.loading = "lazy"; i.decoding = "async";
      f.appendChild(i);
    } else {
      f.classList.add("pendiente");
      f.appendChild(el("span", null, etiqueta || "Foto pendiente"));
    }
    return f;
  }

  // Enlaces de contacto
  document.querySelectorAll("[data-wa]").forEach(function (a) {
    a.href = wa(a.getAttribute("data-wa") || "Hola Santa Vaina! Quisiera hacer una consulta.");
  });
  var ig = "https://instagram.com/" + C.instagram;
  document.querySelectorAll("[data-ig]").forEach(function (a) { a.href = ig; });
  document.querySelectorAll("[data-mail]").forEach(function (a) { a.href = "mailto:" + C.correo; });
  document.querySelectorAll("[data-t=correo]").forEach(function (n) { n.textContent = C.correo; });
  document.querySelectorAll("[data-t=ig]").forEach(function (n) { n.textContent = "@" + C.instagram; });
  document.querySelectorAll("[data-t=horario]").forEach(function (n) { n.textContent = C.horario; });
  document.querySelectorAll("[data-t=wa]").forEach(function (n) { n.textContent = "+" + C.whatsapp.replace(/^549(\d{3})(\d{3})(\d{4})$/, "54 9 $1 $2-$3"); });

  // Portada
  var hero = $("#hero-foto");
  if (hero) hero.appendChild(slot(D.marca.heroImagen, D.marca.heroAlt, "Foto de portada pendiente"));

  // Colecciones
  var lc = $("#lista-colecciones");
  D.categorias.forEach(function (c, n) {
    var li = el("li", "col");
    li.appendChild(slot(c.imagen, c.nombre, "Foto pendiente"));
    li.appendChild(el("span", "num", "Nº 0" + (n + 1)));
    li.appendChild(el("h3", null, c.nombre));
    li.appendChild(el("p", null, c.texto));
    var a = el("a", "enlace", "Consultar");
    a.href = wa("Hola Santa Vaina! Quisiera consultar por: " + c.nombre + ".");
    a.target = "_blank"; a.rel = "noopener";
    li.appendChild(a);
    lc.appendChild(li);
  });

  // Productos publicados
  var pub = D.productos.filter(function (p) { return p.publicado === true; });
  var lp = $("#lista-productos");
  if (!pub.length) {
    var v = el("li", "prod vacio");
    v.appendChild(slot(null, "", "Producto destacado pendiente"));
    v.appendChild(el("h3", null, "Productos en preparación"));
    v.appendChild(el("p", null, "Estamos cargando el catálogo. Mientras tanto, consultá por lo que estés buscando."));
    var b = el("a", "btn", "Consultar por WhatsApp");
    b.href = wa("Hola Santa Vaina! Quisiera consultar por sus productos."); b.target = "_blank"; b.rel = "noopener";
    v.appendChild(b); lp.appendChild(v);
  }
  var etiquetas = { disponible: "Disponible", consultar: "Consultar disponibilidad", agotado: "Agotado" };
  pub.forEach(function (p) {
    var li = el("li", "prod");
    li.appendChild(slot(p.imagenes && p.imagenes[0], p.nombre));
    if (p.tipoVenta === "preventa") li.appendChild(el("span", "etq", "Preventa"));
    li.appendChild(el("h3", null, p.nombre));
    if (p.descripcion) li.appendChild(el("p", null, p.descripcion));
    if (typeof p.precio === "number")
      li.appendChild(el("p", "precio", p.precio.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 })));
    if (etiquetas[p.disponibilidad]) li.appendChild(el("span", "disp", etiquetas[p.disponibilidad]));
    var a = el("a", "btn", p.tipoVenta === "preventa" ? "Reservar por WhatsApp" : "Consultar por WhatsApp");
    a.href = wa("Hola Santa Vaina! Quisiera consultar por: " + p.nombre + " (ref. " + p.id + ").");
    a.target = "_blank"; a.rel = "noopener";
    li.appendChild(a); lp.appendChild(li);
  });

  // Novedades
  var ln = $("#lista-novedades");
  D.novedades.forEach(function (n) {
    var li = el("li", "nov");
    if (n.etiqueta) li.appendChild(el("span", "etq", n.etiqueta));
    li.appendChild(el("h3", null, n.titulo));
    if (n.texto) li.appendChild(el("p", null, n.texto));
    if (n.enlace) { var a = el("a", "enlace", "Ver más"); a.href = n.enlace; li.appendChild(a); }
    ln.appendChild(li);
  });
  if (D.novedades.length) $("#novedades-vacio").hidden = true;

  // Opiniones y preguntas: solo si hay contenido real
  var so = $("#opiniones");
  if (D.opiniones.length) {
    D.opiniones.forEach(function (o) {
      var q = el("blockquote"); q.appendChild(el("p", null, o.texto)); q.appendChild(el("cite", null, o.nombre));
      $("#lista-opiniones").appendChild(q);
    });
    so.hidden = false;
  }
  var sp = $("#preguntas");
  if (D.preguntas.length) {
    D.preguntas.forEach(function (x) {
      var d = el("details"); d.appendChild(el("summary", null, x.p)); d.appendChild(el("p", null, x.r));
      $("#lista-preguntas").appendChild(d);
    });
    sp.hidden = false;
  }

  // Menú móvil
  var btn = $(".menu-btn"), nav = $("#nav");
  btn.addEventListener("click", function () {
    var o = nav.classList.toggle("abierto");
    btn.setAttribute("aria-expanded", o);
    btn.setAttribute("aria-label", o ? "Cerrar menú" : "Abrir menú");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") { nav.classList.remove("abierto"); btn.setAttribute("aria-expanded", "false"); }
  });
  $("#anio").textContent = new Date().getFullYear();
})();
