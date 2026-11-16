# Gym Progress · muestra web

Muestra de sitio para **Gym Progress** (Isidoro Dubournais 2611, Punta de Tralca, El Quisco), preparada por Tu Plan Digital como propuesta de **Plan Web**.

Diseño basado en la estructura de la referencia «RevitalizeX Fitness Club» (Dribbble), con el naranja reemplazado por el rojo del logo (`#d20a1c`).

## Stack

- HTML y CSS, sin build ni dependencias.
- CSS para estilos y animaciones; `js/main.js` (sin dependencias) para el menú móvil, el enlace activo según la sección visible y los carruseles de zonas y boxeo (scroll-snap, flechas, pestañas, puntos, teclado y gesto táctil). Sin JavaScript, los carruseles siguen funcionando con scroll horizontal.
- Fuentes: Montserrat, Inter y Roboto Slab (Google Fonts).

## Estructura

```
index.html
css/styles.css
js/main.js
assets/img/   fotos reales del gimnasio (recortes de sus publicaciones), favicon y og
```

## Secciones

Hero · Por qué entrenar · Zonas (pestañas) · Clases de boxeo · Galería · Planes · Preguntas frecuentes · Banner y mapa · Footer.

## Pendiente de confirmar con el cliente

- Contacto: los botones abren el DM de `@gym_progresssssss`. Si tienen WhatsApp, cambiar los enlaces `ig.me`.
- Valores y horarios de la sala (hoy: «Consulta tu valor»).
- Nombres y contenido real de los planes.
- Reseñas de Google Maps, si existen.
- Logo en alta resolución (hoy es una reconstrucción en SVG dentro de `index.html`).

## Imágenes

- Libres de [Unsplash](https://unsplash.com/license), enlazadas desde `images.unsplash.com`: Eser GOAT, Truflava Productions, Ambitious Studio (Rick Barrett), Roman Aguila, David Marioni, Mohamed Fareed, Nathan Dumlao, Temple Noble Art y Alonso Reyes. Cada una tiene una foto local del gimnasio como respaldo si no carga.
- Resto: publicaciones de @gym_progresssssss.

## Opción 2 · `/opcion-2/`

Segunda propuesta, réplica de la referencia «Flexova Fitness Gym» (Dribbble) con el contenido real de Gym Progress. Convive con la opción 1 en el mismo deploy: `https://gym-progress-web-xi.vercel.app/opcion-2/`.

- Proporciones medidas sobre la referencia a 1440 px: contenedor de 1052 px, titular del hero de 66 px y títulos de sección de 44 px.
- Tipografías autoalojadas en `opcion-2/fonts/` (Archivo variable a 108 % de ancho para títulos y Manrope para textos, licencia OFL), sin llamadas a Google Fonts.
- Secciones: Hero · Nosotros y cifras · Zonas (carrusel) · Boxeo con FH Boxing Team (slider) · Planes · Cómo empezar (línea de tiempo) · Comentarios · Preguntas frecuentes · Contacto · Banner · Footer.
- Animaciones en CSS (entrada del hero, destellos de luz, apariciones al hacer scroll, menú a pantalla completa, acordeón). `opcion-2/js/main.js` solo agrega clases: cifras con contador, barra de progreso y arrastre de los carruseles, avance automático del slider de boxeo, línea de tiempo y formulario. Respeta `prefers-reduced-motion`.
- Contacto por WhatsApp: todos los botones abren un chat con el mensaje prellenado según el plan o la clase, y hay un botón flotante. El formulario no tiene backend: arma el mensaje con los datos y abre WhatsApp. Instagram queda para seguir la cuenta.
- Menú hamburguesa solo en mobile; en desktop se usan los enlaces del navbar.

### Pendiente de confirmar con el cliente (opción 2)

- Los comentarios son **de ejemplo** (así están rotulados); reemplazarlos por reseñas reales de Google Maps o Instagram.
- **Número de WhatsApp**: hoy es de muestra (`56900000000`). Reemplazarlo en `opcion-2/index.html` (enlaces `wa.me` y `data-wa` del formulario) por el real, que está en el enlace wa.me de la bio de Instagram.
- Valores de los planes (hoy «Consulta / valor mensual») y horario de la sala.
- Foto real del equipo FH Boxing Team para la tarjeta del nivel avanzado.

## Desarrollo local

```bash
npx serve .
```
