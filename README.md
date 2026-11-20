# JM Aesthetic · Web

Web de **JM Aesthetic** (Belleza · Bienestar · Confianza): página principal con animaciones, sección "Sobre mí", galería, página de servicios con precios y **agenda de reservas online** conectada a Google Calendar, Google Sheets y correo.

Carrer de Pelai 12, 08001 Barcelona · 647 46 64 66

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | Página principal: portada, sobre mí, categorías, experiencia, preguntas frecuentes y reservas |
| `servicios.html` | Página de servicios con filtros (Facial / Corporal / Mirada) |
| `styles.css` | Estilos y animaciones |
| `main.js` | Configuración (contacto, servicios) y lógica de la web |
| `logo.png`, `logo-mark.png`, `butterfly.png`, `fondo.jpg` | Imágenes de marca |
| `foto.jpg` | Foto de la profesional en "Sobre mí" |
| `google-apps-script/` | Script de reservas para Google y guía de instalación (`INSTALAR-RESERVAS.md`) |
| `galeria-1.jpg`, `galeria-2.jpg`, `galeria-3.jpg` | Fotos de la galería "Mi espacio" |

## Cambiar datos

Todo se edita al principio de `main.js`:

- `CONFIG`: WhatsApp, teléfono, Instagram, dirección, nombre de la profesional, horario y `bookingApi` (URL del script de Google; vacío = modo demo).
- `SERVICES`: lista de tratamientos: categoría, nombre, duración en minutos (`min`), precio en euros (`price`, `null` = "Consultar") y descripción.

## Reservas
Las reservas se hacen en la propia web y van a Google Calendar, a una hoja de Google Sheets (descargable en Excel) y por correo a la clienta y al centro. Instalación: `google-apps-script/INSTALAR-RESERVAS.md`.

## Publicar con GitHub Pages

1. Sube estos archivos a la raíz del repositorio.
2. Ve a **Settings → Pages**.
3. En "Source" elige **Deploy from a branch**, rama `main` y carpeta `/ (root)`, y guarda.
4. En un par de minutos la web estará en `https://<usuario>.github.io/<repositorio>/`.
