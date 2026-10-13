# Canelo

Sitio de la agencia. Astro, estático, sin frameworks de interfaz.

- `npm run dev` levanta el sitio; `npm run build` lo compila en `dist/`.
- Todo el contenido y los datos de contacto están en `src/datos/sitio.ts`.
- `PUBLICAR` en ese archivo está en `false`: el sitio pide no ser indexado hasta que se cambie.
- Mientras `contacto.whatsapp` esté vacío, la página muestra un aviso de borrador y el formulario no envía.

## Pendiente antes de publicar
- Cargar WhatsApp, email e Instagram, y el dominio en `negocio.url`.
- Confirmar los textos marcados "A confirmar" en `src/datos/sitio.ts`.
- Acuerdo de cada negocio que aparece en Trabajos, y de El Bahiense para mostrar su logo y fotos.
- Imagen para compartir en redes, sitemap y medición de clics y envíos.
