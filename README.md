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

- Contacto: los botones abren el DM de `@gym_progressssss`. Si tienen WhatsApp, cambiar los enlaces `ig.me`.
- Valores y horarios de la sala (hoy: «Consulta tu valor»).
- Nombres y contenido real de los planes.
- Reseñas de Google Maps, si existen.
- Logo en alta resolución (hoy es una reconstrucción en SVG dentro de `index.html`).

## Imágenes

- Libres de [Unsplash](https://unsplash.com/license), enlazadas desde `images.unsplash.com`: Eser GOAT, Truflava Productions, Ambitious Studio (Rick Barrett), Roman Aguila, David Marioni, Mohamed Fareed, Nathan Dumlao, Temple Noble Art y Alonso Reyes. Cada una tiene una foto local del gimnasio como respaldo si no carga.
- Resto: publicaciones de @gym_progressssss.

## Desarrollo local

```bash
npx serve .
```
