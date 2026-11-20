/**
 * JM Aesthetic · Reservas online
 * ------------------------------------------------------------
 * Conecta la agenda de la web con:
 *   - Google Calendar  → cada reserva crea un evento y las horas ocupadas dejan de ofrecerse
 *   - Google Sheets    → cada reserva se guarda en la hoja "Reservas" (descargable en Excel)
 *   - Correo           → confirmación a la clienta y aviso al centro
 *
 * Instalación: ver INSTALAR-RESERVAS.md
 */

const CONFIG = {
  NEGOCIO: 'JM Aesthetic',
  DIRECCION: 'Carrer de Pelai 12, 08001 Barcelona',
  TELEFONO: '647 46 64 66',
  WHATSAPP: '34647464466',

  CALENDARIO_ID: 'primary',  // 'primary' = calendario principal de la cuenta. Puede ser el ID de otro calendario.
  HOJA: 'Reservas',          // nombre de la pestaña donde se guardan las reservas
  AVISAR_A: '',              // correo que recibe el aviso de cada reserva ('' = la cuenta dueña del script)
  ZONA: 'Europe/Madrid',

  // Horario de citas (0 = domingo … 6 = sábado). Varios tramos si hay pausa, p. ej. [['10:00','14:00'],['16:00','20:00']]
  // La web lee este horario automáticamente: solo hay que cambiarlo aquí.
  HORARIO: {
    0: [],
    1: [['10:00', '20:00']],
    2: [['10:00', '20:00']],
    3: [['10:00', '20:00']],
    4: [['10:00', '20:00']],
    5: [['10:00', '20:00']],
    6: [['10:00', '14:00']]
  },
  INTERVALO: 30,             // las citas empiezan cada 30 min
  ANTELACION_MIN_HORAS: 2,   // no se puede reservar con menos de 2 h de antelación
  DIAS_MAX: 60,              // se puede reservar hasta 60 días vista
  DURACION_MAX: 240,

  // Eventos de "todo el día" con estas palabras en el título bloquean el día entero
  BLOQUEO_DIA: /cerrad|vacacion|festiv|bloque|no disponible/i
};

const COLUMNAS = ['Registrada', 'Fecha cita', 'Hora', 'Tratamiento', 'Duración (min)', 'Precio',
  'Nombre', 'Email', 'Teléfono', 'Comentarios', 'Estado', 'ID evento'];

/* ===================== Web: lectura ===================== */
function doGet(e) {
  const p = (e && e.parameter) || {};
  try {
    if (p.action === 'config') return json({ ok: true, hours: CONFIG.HORARIO, step: CONFIG.INTERVALO });
    if (p.action === 'slots') return json({ ok: true, slots: huecosLibres(p.date, Number(p.duration)) });
    return json({ ok: true, negocio: CONFIG.NEGOCIO });
  } catch (err) {
    return json({ ok: false, error: String(err.message || err) });
  }
}

/* ===================== Web: nueva reserva ===================== */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const d = JSON.parse(e.postData.contents);
    validar(d);
    lock.waitLock(20000);

    const dur = Number(d.duration);
    if (huecosLibres(d.date, dur).indexOf(d.time) === -1) return json({ ok: false, error: 'taken' });

    const inicio = fecha(d.date, d.time);
    const fin = new Date(inicio.getTime() + dur * 60000);

    const ev = calendario().createEvent(d.service + ' · ' + d.name, inicio, fin, {
      location: CONFIG.DIRECCION,
      description:
        'Reserva desde la web\n\n' +
        'Tratamiento: ' + d.service + ' (' + dur + ' min)\n' +
        'Precio: ' + (d.price || '-') + '\n' +
        'Nombre: ' + d.name + '\n' +
        'Teléfono: ' + d.phone + '\n' +
        'Email: ' + d.email + '\n' +
        (d.notes ? 'Comentarios: ' + d.notes + '\n' : '')
    });
    try { ev.setColor(CalendarApp.EventColor.YELLOW); } catch (_) {}

    hoja().appendRow([new Date(), d.date, d.time, d.service, dur, d.price || '', d.name, d.email,
      "'" + d.phone, d.notes || '', 'Confirmada', ev.getId()]);

    correoClienta(d, inicio, fin);
    correoCentro(d);

    return json({ ok: true, id: ev.getId() });
  } catch (err) {
    return json({ ok: false, error: String(err.message || err) });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

/* ===================== Disponibilidad ===================== */
function huecosLibres(date, dur) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) throw new Error('fecha');
  if (!(dur >= 5 && dur <= CONFIG.DURACION_MAX)) throw new Error('duracion');

  const dow = Number(Utilities.formatDate(fecha(date, '12:00'), CONFIG.ZONA, 'u')) % 7; // 0 = domingo
  const tramos = CONFIG.HORARIO[dow] || [];
  if (!tramos.length) return [];

  const ahora = new Date();
  const minimo = new Date(ahora.getTime() + CONFIG.ANTELACION_MIN_HORAS * 3600000);
  const maximo = new Date(ahora.getTime() + CONFIG.DIAS_MAX * 86400000);

  const ocupado = [];
  const eventos = calendario().getEvents(fecha(date, '00:00'), fecha(date, '23:59'));
  for (const ev of eventos) {
    if (ev.isAllDayEvent()) {
      if (CONFIG.BLOQUEO_DIA.test(ev.getTitle())) return [];
      continue;
    }
    ocupado.push([ev.getStartTime().getTime(), ev.getEndTime().getTime()]);
  }

  const libres = [];
  tramos.forEach(function (t) {
    for (let m = aMin(t[0]); m + dur <= aMin(t[1]); m += CONFIG.INTERVALO) {
      const ini = fecha(date, aHHMM(m)).getTime();
      const fin = ini + dur * 60000;
      if (ini < minimo.getTime() || ini > maximo.getTime()) continue;
      if (ocupado.some(function (o) { return ini < o[1] && fin > o[0]; })) continue;
      libres.push(aHHMM(m));
    }
  });
  return libres;
}

/* ===================== Correos ===================== */
function correoClienta(d, inicio, fin) {
  const f = fechaBonita(inicio);
  const gcal = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    '&text=' + encodeURIComponent(d.service + ' · ' + CONFIG.NEGOCIO) +
    '&dates=' + gcalFecha(inicio) + '/' + gcalFecha(fin) +
    '&ctz=' + CONFIG.ZONA +
    '&location=' + encodeURIComponent(CONFIG.DIRECCION);
  const html =
    '<div style="font-family:Helvetica,Arial,sans-serif;background:#fbf8f2;padding:32px 16px">' +
    '<div style="max-width:520px;margin:0 auto;background:#fff;border-radius:18px;overflow:hidden;border:1px solid #eadfc6">' +
    '<div style="background:#173a6b;color:#fff;padding:28px 32px">' +
    '<div style="font-size:12px;letter-spacing:3px;color:#e2c47a;text-transform:uppercase">' + CONFIG.NEGOCIO + '</div>' +
    '<div style="font-family:Georgia,serif;font-size:28px;margin-top:8px">¡Tu cita está confirmada!</div></div>' +
    '<div style="padding:28px 32px;color:#22314a;font-size:15px;line-height:1.6">' +
    '<p>Hola ' + esc(d.name.split(' ')[0]) + ',</p>' +
    '<p>Gracias por confiar en nosotras. Estos son los datos de tu cita:</p>' +
    '<table style="width:100%;border-collapse:collapse;margin:16px 0">' +
    fila('Tratamiento', esc(d.service)) + fila('Día', f) + fila('Hora', d.time + ' h') +
    fila('Duración', d.duration + ' min') + fila('Precio', esc(d.price || 'Consultar')) +
    fila('Dirección', CONFIG.DIRECCION) + '</table>' +
    '<p style="text-align:center;margin:24px 0"><a href="' + gcal + '" style="background:#173a6b;color:#fff;text-decoration:none;padding:12px 22px;border-radius:30px;font-size:13px;letter-spacing:1px">AÑADIR A MI CALENDARIO</a></p>' +
    '<p style="font-size:13px;color:#5d6b80">¿Necesitas cambiar o cancelar la cita? Avísanos con 24 h de antelación respondiendo a este correo, ' +
    'por <a href="https://wa.me/' + CONFIG.WHATSAPP + '" style="color:#a47f2c">WhatsApp</a> o llamando al ' + CONFIG.TELEFONO + '.</p>' +
    '</div></div></div>';
  MailApp.sendEmail({
    to: d.email,
    subject: 'Tu cita en ' + CONFIG.NEGOCIO + ' · ' + f + ' a las ' + d.time,
    htmlBody: html,
    name: CONFIG.NEGOCIO,
    replyTo: emailCentro()
  });
}

function correoCentro(d) {
  MailApp.sendEmail({
    to: emailCentro(),
    subject: 'Nueva reserva: ' + d.service + ' · ' + d.date + ' ' + d.time + ' · ' + d.name,
    htmlBody:
      '<div style="font-family:Helvetica,Arial,sans-serif;font-size:15px;color:#22314a">' +
      '<h2 style="font-family:Georgia,serif;color:#173a6b">Nueva reserva desde la web</h2>' +
      '<table style="border-collapse:collapse">' +
      fila('Tratamiento', esc(d.service)) + fila('Día', fechaBonita(fecha(d.date, d.time))) +
      fila('Hora', d.time + ' h') + fila('Duración', d.duration + ' min') + fila('Precio', esc(d.price || '-')) +
      fila('Nombre', esc(d.name)) + fila('Teléfono', esc(d.phone)) + fila('Email', esc(d.email)) +
      (d.notes ? fila('Comentarios', esc(d.notes)) : '') + '</table>' +
      '<p style="font-size:13px;color:#5d6b80">La cita ya está en tu Google Calendar y en la hoja "' + CONFIG.HOJA + '".</p></div>',
    name: 'Web ' + CONFIG.NEGOCIO,
    replyTo: d.email
  });
}

/* ===================== Ayudantes ===================== */
function validar(d) {
  if (!d || d.website) throw new Error('datos');
  ['service', 'date', 'time', 'name', 'email', 'phone'].forEach(function (k) {
    if (!d[k] || String(d[k]).trim() === '') throw new Error('Falta ' + k);
  });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) throw new Error('email');
  if (!/^\d{2}:\d{2}$/.test(d.time)) throw new Error('hora');
  if (String(d.name).length > 120 || String(d.notes || '').length > 1500 || String(d.service).length > 120) throw new Error('largo');
}

function calendario() {
  const cal = CONFIG.CALENDARIO_ID === 'primary'
    ? CalendarApp.getDefaultCalendar()
    : CalendarApp.getCalendarById(CONFIG.CALENDARIO_ID);
  if (!cal) throw new Error('No se encuentra el calendario');
  return cal;
}

function hoja() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(CONFIG.HOJA);
  if (!sh) sh = ss.insertSheet(CONFIG.HOJA);
  if (sh.getLastRow() === 0) {
    sh.appendRow(COLUMNAS);
    sh.getRange(1, 1, 1, COLUMNAS.length).setFontWeight('bold').setBackground('#173a6b').setFontColor('#ffffff');
    sh.setFrozenRows(1);
    sh.setColumnWidths(1, COLUMNAS.length, 140);
  }
  return sh;
}

function emailCentro() { return CONFIG.AVISAR_A || Session.getEffectiveUser().getEmail(); }
function fecha(date, hhmm) { return Utilities.parseDate(date + ' ' + hhmm, CONFIG.ZONA, 'yyyy-MM-dd HH:mm'); }
function aMin(t) { const p = t.split(':'); return Number(p[0]) * 60 + Number(p[1]); }
function aHHMM(m) { return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2); }
function gcalFecha(d) { return Utilities.formatDate(d, CONFIG.ZONA, "yyyyMMdd'T'HHmmss"); }
function fechaBonita(d) {
  const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const dow = Number(Utilities.formatDate(d, CONFIG.ZONA, 'u')) % 7;
  const dia = Number(Utilities.formatDate(d, CONFIG.ZONA, 'd'));
  const mes = Number(Utilities.formatDate(d, CONFIG.ZONA, 'M')) - 1;
  return dias[dow] + ' ' + dia + ' de ' + meses[mes];
}
function fila(k, v) {
  return '<tr><td style="padding:8px 12px 8px 0;color:#a47f2c;font-size:12px;letter-spacing:1px;text-transform:uppercase;vertical-align:top">' + k +
    '</td><td style="padding:8px 0;border-bottom:1px solid #f0e8d6">' + v + '</td></tr>';
}
function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function json(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

/* ===================== Ejecutar una vez al instalar ===================== */
function configurar() {
  hoja();
  calendario();
  MailApp.getRemainingDailyQuota();
  Logger.log('Todo listo. Calendario: ' + calendario().getName() + ' · Avisos a: ' + emailCentro());
}
