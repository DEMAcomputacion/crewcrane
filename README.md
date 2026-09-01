# Crewcrane — Landing de alquiler de grúa araña

Sitio estático (HTML/CSS/JS, sin build step) para `https://crewcrane.com/alquiler-grua-arana`.

## Previsualizar en local

No requiere instalación. Cualquier servidor estático sirve:

```bash
python -m http.server 8765
# abrir http://localhost:8765/index.html
```

## Estructura

```
index.html      página principal
404.html        página de error
styles.css      estilos (tokens de diseño en :root)
script.js       WhatsApp, menú, validación de formulario, UTM, envío por EmailJS
robots.txt
sitemap.xml
assets/         logo, favicon, videos y posters de "Trabajos reales"
```

## Configurar el envío del formulario (EmailJS)

El formulario de contacto (`#leadForm`) envía por [EmailJS](https://www.emailjs.com) sin backend propio:

1. Crear una cuenta gratuita en EmailJS.
2. Conectar el correo donde Crewcrane quiere recibir las solicitudes ("Email Service").
3. Crear un "Email Template" usando estas variables (coinciden con los `name` de los campos del formulario): `nombre`, `empresa`, `telefono`, `correo`, `ubicacion`, `fecha`, `descripcion`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`.
4. En `script.js`, reemplazar al inicio del archivo:
   - `EMAILJS_PUBLIC_KEY`
   - `EMAILJS_SERVICE_ID`
   - `EMAILJS_TEMPLATE_ID`

Mientras esos valores no se reemplacen, el formulario muestra la confirmación visual pero no envía nada (modo de desarrollo/prueba).

## Medición (pendiente)

GTM + GA4 + Google Ads con eventos de WhatsApp, llamada y formulario (evento `generate_lead` ya se dispara al `dataLayer` en el envío exitoso). Ver el plan de medición del paquete de handoff original para el detalle de tags y triggers.

## Publicación

Sitio 100% estático: subir el contenido de esta carpeta a la raíz del hosting de `crewcrane.com` (o a la ruta `/alquiler-grua-arana` según corresponda) con HTTPS activo. Verificar que `404.html` devuelva estado HTTP 404 real desde el servidor.
