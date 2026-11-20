# Conectar las reservas de la web con Google (10 minutos)

Hazlo con **la cuenta de Google de Jandre**, la del calendario donde quiere recibir las citas.

## 1. Crear la hoja de reservas
1. Entra en [sheets.google.com](https://sheets.google.com) y crea una hoja en blanco.
2. Ponle de nombre **Reservas JM Aesthetic**.

## 2. Pegar el script
1. En la hoja, menú **Extensiones → Apps Script**.
2. Borra todo lo que aparece en el editor y pega el contenido del archivo `reservas.gs`.
3. Si hace falta, cambia el horario en el bloque `HORARIO` (la web lo leerá automáticamente).
4. Pulsa el icono de **Guardar** (disquete).

## 3. Dar permisos (solo la primera vez)
1. Arriba, en el desplegable de funciones, elige **configurar** y pulsa **Ejecutar**.
2. Google pedirá permisos → **Revisar permisos** → elige la cuenta de Jandre.
3. Si sale "Google no ha verificado esta aplicación": **Configuración avanzada → Ir a … (no seguro)** → **Permitir**. Es normal: el script es suyo y solo lo usa ella.
4. Abajo debería aparecer: *"Todo listo. Calendario: … · Avisos a: …"*. En la hoja se habrá creado la pestaña **Reservas** con sus columnas.

## 4. Publicarlo
1. Botón azul **Implementar → Nueva implementación**.
2. En el engranaje ⚙️ elige **Aplicación web**.
3. *Ejecutar como*: **Yo**. *Quién tiene acceso*: **Cualquier usuario**.
4. **Implementar** y copia la **URL de la aplicación web** (termina en `/exec`).

## 5. Conectarlo a la web
Pega esa URL en `main.js`, en la línea:

```js
bookingApi: "",
```

quedando así: `bookingApi: "https://script.google.com/macros/s/…/exec",`

Sube el cambio a GitHub y Vercel publicará la web. Desde ese momento las reservas son reales.

---

## Cómo funciona en el día a día

| Quiero… | Qué hacer |
|---|---|
| Ver las citas | Aparecen en su **Google Calendar** (en amarillo) y en la hoja **Reservas**. |
| Recibir avisos | Le llega un correo por cada reserva nueva. La clienta recibe su confirmación al momento. |
| Bloquear unas horas | Crea cualquier evento en su calendario a esa hora: la web deja de ofrecerla. |
| Cerrar un día entero | Crea un evento de **todo el día** con el título *Cerrado*, *Vacaciones* o *Festivo*. |
| Cancelar una cita | Borra el evento del calendario (la hora vuelve a quedar libre) y, si quiere, escribe *Cancelada* en la columna **Estado** de la hoja. |
| Tener la lista en Excel | En la hoja: **Archivo → Descargar → Microsoft Excel (.xlsx)**. |
| Cambiar el horario | Edita `HORARIO` en el script, guarda y haz **Implementar → Gestionar implementaciones → ✏️ → Versión: Nueva versión → Implementar**. Así la URL no cambia. |
