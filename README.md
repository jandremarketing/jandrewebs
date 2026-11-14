# JM Aesthetic · Web

Web de **JM Aesthetic** (Belleza · Bienestar · Confianza): página principal con animaciones, sección "Sobre mí", página de servicios con filtros y formulario de reserva por WhatsApp.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | Página principal: portada, sobre mí, categorías, experiencia, preguntas frecuentes y reservas |
| `servicios.html` | Página de servicios con filtros (Facial / Corporal / Mirada) |
| `styles.css` | Estilos y animaciones |
| `main.js` | Configuración (contacto, servicios) y lógica de la web |
| `logo.png`, `logo-mark.png`, `butterfly.png`, `fondo.jpg` | Imágenes de marca |
| `foto.jpg` | *(añadir)* Foto de la profesional para "Sobre mí", vertical 4:5 |

## Cambiar datos

Todo se edita al principio de `main.js`:

- `CONFIG`: WhatsApp, teléfono, Instagram, dirección, horario, nombre de la profesional y `bookingUrl` (si se usa Fresha, Booksy o Treatwell, todos los botones de reservar irán a ese enlace).
- `SERVICES`: lista de tratamientos (categoría, nombre, descripción y duración).

## Publicar con GitHub Pages

1. Sube estos archivos a la raíz del repositorio.
2. Ve a **Settings → Pages**.
3. En "Source" elige **Deploy from a branch**, rama `main` y carpeta `/ (root)`, y guarda.
4. En un par de minutos la web estará en `https://<usuario>.github.io/<repositorio>/`.
