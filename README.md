# Sistema de Gestión de Calidad · Segundo Sprint

Sitio educativo sobre calidad del software, procesos de desarrollo y metodologías.
Incluye las páginas del primer sprint (US-01 a US-06) y las historias de usuario **US-07 a US-19**,
implementadas a partir del diseño en Figma y del documento *Proyecto SGCS 2026*.

Es HTML, CSS y JavaScript sin dependencias: abrí `index.html` en el navegador
o publicalo con GitHub Pages (Settings → Pages → rama `main`, carpeta raíz).

## Páginas del Sprint 2

| Historia | Página | Funcionalidad JS |
|---|---|---|
| US-07 Ilustraciones de modelos tradicionales | `ilustraciones-tradicionales.html` | Lightbox de diagramas, índice dinámico |
| US-08 Metodologías Ágiles | `metodologias-agiles.html` | Tabla de contenidos que resalta la sección visible |
| US-09 Ilustraciones de metodologías ágiles | `ilustraciones-agiles.html` | Reutiliza el lightbox |
| US-10 Scrum en profundidad | `scrum.html` | Cronograma interactivo del Sprint (1 a 4 semanas) |
| US-11 Kanban en profundidad | `kanban.html` | Tablero con drag-and-drop y botones, límites WIP, estado guardado |
| US-12 Glosario | `glosario.html` | Buscador en tiempo real, índice A-Z, estado "sin resultados" |
| US-13 Preguntas frecuentes | `faq.html` | Acordeón con animación de altura y filtro por categoría |
| US-14 Enlaces de interés | `enlaces.html` | Apertura segura (`target="_blank"` + `rel="noopener noreferrer"`), filtro por tipo |
| US-15 Ejercicios y casos prácticos | `ejercicios.html` | Mostrar/Ocultar solución (ocultas por defecto), filtro por tema |
| US-16 Sobre nosotros | `nosotros.html` | Efectos hover/foco en perfiles |
| US-17 Contacto | `contacto.html` | Validación del lado del cliente y confirmación en pantalla |
| US-18 Comparador de metodologías | `comparador.html` | Tabla dinámica según checkboxes (mínimo 2) |
| US-19 Encuesta de preferencias | `encuesta.html` | Asistente de 5 pasos con barra de progreso y % de coincidencia |

## Estructura

- `sprint2.css` · estilos del Sprint 2 (tokens del diseño de Figma: Inter, paleta azul, tarjetas, tablas).
- `sprint2.js` · menú para celulares.
- `js/` · un script por funcionalidad.
- `img/` · logo e íconos exportados de Figma.
- `index.html` · página de inicio (portada con acceso a todas las secciones). `figma.html` redirige al inicio.
- `style.css`, `extra.css` · estilos del Sprint 1 (sin cambios).

## Pendientes para el equipo

- `nosotros.html`: reemplazar "Integrante del equipo" por el nombre real de cada persona.
- `js/contacto.js`: completar `CORREO_EQUIPO` con el correo que recibirá los mensajes
  (el sitio no tiene servidor; el formulario valida, confirma y ofrece abrir el mensaje en el correo).
