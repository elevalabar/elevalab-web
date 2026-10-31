/* Santa Vaina — datos de la marca y del catálogo.
   Todo lo comercial vive acá, no en el HTML. Para sumar un producto, agregar un objeto a `productos`
   con publicado: true. No hay productos cargados porque todavía no se recibió el material real. */
window.SV = {
  marca: {
    nombre: "Santa Vaina",
    // Foto de portada: ruta relativa (ej. "img/portada.webp"). null = se muestra el espacio pendiente.
    heroImagen: null,
    heroAlt: ""
  },

  contacto: {
    whatsapp: "5492216719131",
    instagram: "Santavaina_",
    correo: "anitadelmar00@gmail.com",
    horario: "10 a 20 hs"
  },

  // Categorías. imagen: null = espacio pendiente de foto real.
  categorias: [
    { id: "marroquineria-textil", nombre: "Marroquinería textil", imagen: null,
      texto: "Piezas confeccionadas a mano, con variedad de estampados." },
    { id: "accesorios", nombre: "Accesorios", imagen: null,
      texto: "Complementos artesanales para el uso cotidiano y para regalar." },
    { id: "capsulas-cuero", nombre: "Cápsulas en cuero", imagen: null,
      texto: "Pequeñas cápsulas de accesorios en cuero." },
    { id: "proximos", nombre: "Próximos lanzamientos", imagen: null,
      texto: "Nuevas colecciones con una mirada más náutica." }
  ],

  /* Productos. Estructura pensada para crecer a catálogo:
     { id: "SV-001", nombre: "", categoria: "accesorios", descripcion: "", imagenes: ["img/..."],
       precio: 0 (número en ARS, o null), publicado: true,
       disponibilidad: "disponible" | "consultar" | "agotado" | null,
       stock: null, tipoVenta: "stock" | "preventa" | null }
     Hoy solo se muestran los publicados; precio, disponibilidad y tipoVenta aparecen únicamente si están cargados.
     `stock` queda reservado para la etapa de gestión (no se muestra). */
  productos: [],

  // Novedades y campañas (Cyber Monday, preventas, fechas especiales). Vacío = no se muestra nada ficticio.
  // { titulo: "", texto: "", etiqueta: "Preventa", imagen: null, enlace: null }
  novedades: [],

  // Opiniones reales de clientes. Vacío = la sección no se muestra.
  // { texto: "", nombre: "" }
  opiniones: [],

  // Preguntas frecuentes (solo con información confirmada). Vacío = la sección no se muestra.
  preguntas: [
    { p: "¿Cómo consulto por un producto?",
      r: "Escribinos por WhatsApp desde el botón de cada producto o desde Contacto y te respondemos sobre disponibilidad." },
    { p: "¿En qué horario responden?",
      r: "Atendemos consultas de 10 a 20 hs." }
  ]
};
