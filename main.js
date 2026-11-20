/* =====================================================================
   CONFIGURACIÓN — todo lo que se puede cambiar está aquí arriba
   ===================================================================== */
const CONFIG = {
  whatsapp: "34647464466",              // número con prefijo de país, sin + ni espacios
  phone: "+34647464466",
  phoneLabel: "647 46 64 66",
  instagram: "jm.aesthetic",            // usuario de Instagram sin @
  ownerName: "Nombre de la profesional",// firma de "Sobre mí"
  address: "Carrer de Pelai 12, 08001 Barcelona",

  // URL del script de Google (Calendar + hoja de reservas + correos).
  // Mientras esté vacío, la agenda funciona en MODO DEMO (no guarda nada).
  bookingApi: "",

  // Horario de apertura (0 = domingo … 6 = sábado). Varios tramos por día si hay pausa.
  // Si el script de Google está conectado, se usa el horario definido en el script.
  openingHours: {
    0: [],
    1: [["10:00","20:00"]],
    2: [["10:00","20:00"]],
    3: [["10:00","20:00"]],
    4: [["10:00","20:00"]],
    5: [["10:00","20:00"]],
    6: [["10:00","14:00"]]
  },
  slotStep: 30,        // cada cuántos minutos empieza una cita
  minNoticeHours: 2,   // antelación mínima para reservar
  maxDays: 60          // hasta cuántos días vista se puede reservar
};

/* Precio en euros (número) o null para mostrar "Consultar". Duración en minutos. */
const SERVICES = [
  {cat:"facial",  name:"Higiene facial profunda", min:60, price:null, desc:"Limpieza, extracción y mascarilla adaptada a tu piel para recuperar luminosidad.", icon:"drop"},
  {cat:"facial",  name:"Hydrafacial",             min:60, price:null, desc:"Limpia, exfolia e hidrata en profundidad. Piel jugosa y radiante al momento.", icon:"spark"},
  {cat:"facial",  name:"Dermapen",                min:60, price:null, desc:"Microneedling que estimula colágeno y mejora textura, poros y marcas.", icon:"dots"},
  {cat:"facial",  name:"Peeling de algas",        min:45, price:null, desc:"Exfoliación natural con microalgas que renueva la piel, afina la textura y aporta luminosidad sin agresividad.", icon:"leaf"},
  {cat:"facial",  name:"Radiofrecuencia facial",  min:45, price:null, desc:"Efecto tensor y reafirmante para un rostro más firme y definido.", icon:"wave"},
  {cat:"corporal",name:"Drenaje linfático",       min:60, price:null, desc:"Masaje suave que reduce retención de líquidos y aporta ligereza.", icon:"leaf"},
  {cat:"corporal",name:"Maderoterapia",           min:60, price:null, desc:"Técnica manual que moldea la silueta y mejora la apariencia de la celulitis.", icon:"wave"},
  {cat:"corporal",name:"Presoterapia",            min:40, price:null, desc:"Mejora la circulación y descansa las piernas cansadas.", icon:"layers"},
  {cat:"mirada",  name:"Lifting de pestañas",     min:60, price:null, desc:"Curvatura natural y duradera, sin extensiones. Mirada abierta cada día.", icon:"eye"},
  {cat:"mirada",  name:"Laminado de cejas",       min:45, price:null, desc:"Cejas peinadas, definidas y con más volumen durante semanas.", icon:"brow"},
  {cat:"mirada",  name:"Diseño de cejas",         min:30, price:null, desc:"Estudio de tu rostro para crear la forma que mejor te favorece.", icon:"brow"},
  {cat:"facial",  name:"Valoración personalizada",min:30, price:null, desc:"Analizamos tu piel y objetivos para diseñar tu plan de tratamiento.", icon:"heart"}
];

/* ===================================================================== */
const ICONS = {
  drop:'<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
  spark:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
  dots:'<circle cx="7" cy="7" r="1.2"/><circle cx="12" cy="7" r="1.2"/><circle cx="17" cy="7" r="1.2"/><circle cx="7" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="17" cy="12" r="1.2"/><circle cx="7" cy="17" r="1.2"/><circle cx="12" cy="17" r="1.2"/><circle cx="17" cy="17" r="1.2"/>',
  layers:'<path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="m3 13 9 5 9-5"/>',
  wave:'<path d="M3 9c3-3 6 3 9 0s6 3 9 0M3 15c3-3 6 3 9 0s6 3 9 0"/>',
  leaf:'<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15"/><path d="M5 19 13 11"/>',
  eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  brow:'<path d="M3 12c4-5 12-6 18-2"/><path d="M5 16c3 2 9 2 12 0"/>',
  heart:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'
};
const arrow='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const catLabel={facial:"Facial",corporal:"Corporal",mirada:"Mirada"};
const DAYS=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
const $=id=>document.getElementById(id);
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const priceLabel=s=>s.price==null?'Consultar':`${s.price} €`;
const durLabel=m=>m>=60?`${Math.floor(m/60)} h${m%60?' '+m%60+' min':''}`:`${m} min`;
const toMin=t=>{const[h,m]=t.split(':').map(Number);return h*60+m;};
const toHHMM=m=>`${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;
const ymd=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const prettyDate=s=>new Date(s+'T12:00').toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'});

/* Hora actual en Barcelona (aunque la visita sea desde otro país) */
function madridNow(){
  const p=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Madrid',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date());
  const g=k=>p.find(x=>x.type===k).value;
  const date=`${g('year')}-${g('month')}-${g('day')}`;
  return {date,min:(+g('hour')%24)*60+(+g('minute')),dow:new Date(date+'T12:00').getDay()};
}

/* ---------- Servicios (página de servicios) ---------- */
const grid=$('grid');
if(grid) grid.innerHTML=SERVICES.map((s,i)=>`
  <article class="svc rv" data-cat="${s.cat}" style="--d:${(i%3)*.1}s">
    <span class="tag">${catLabel[s.cat]}</span>
    <div class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${ICONS[s.icon]}</svg></div>
    <h3>${s.name}</h3><p>${s.desc}</p>
    <div class="meta"><span>${durLabel(s.min)}</span><strong class="price">${priceLabel(s)}</strong></div>
    <button class="book-full" data-book data-svc="${s.name}">Reservar ${arrow}</button>
  </article>`).join('');

/* ---------- Datos de contacto ---------- */
document.querySelectorAll('[data-cfg]').forEach(el=>{
  const k=el.dataset.cfg; el.textContent=k==='instagram'?'@'+CONFIG.instagram:CONFIG[k];
});
document.querySelectorAll('.tel-link').forEach(a=>a.href='tel:'+CONFIG.phone);
const waLink=t=>`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(t)}`;
if($('waBtn')) $('waBtn').href=waLink('¡Hola! Me gustaría pedir información sobre vuestros tratamientos.');
['igBtn','igFoot'].forEach(id=>{const e=$(id);if(e)e.href=`https://instagram.com/${CONFIG.instagram}`;});
const mapsQ=encodeURIComponent('JM Aesthetic, '+CONFIG.address);
if($('mapsBtn')) $('mapsBtn').href=`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(CONFIG.address)}`;
if($('mapPin')) $('mapPin').href=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONFIG.address)}`;
if($('mapFrame')) $('mapFrame').src=`https://maps.google.com/maps?q=${encodeURIComponent(CONFIG.address)}&z=16&output=embed`;
$('yr').textContent=new Date().getFullYear();

/* ---------- Horario + abierto ahora ---------- */
function renderHours(){
  const H=CONFIG.openingHours, order=[1,2,3,4,5,6,0], rows=[];
  order.forEach(d=>{
    const txt=(H[d]||[]).length?H[d].map(r=>r.join('–')).join(' · '):'Cerrado';
    const last=rows[rows.length-1];
    if(last&&last.txt===txt) last.to=d; else rows.push({from:d,to:d,txt});
  });
  const cap=s=>s[0].toUpperCase()+s.slice(1,3);
  if($('hoursList')) $('hoursList').innerHTML=rows.map(r=>`<span class="hrow"><em>${cap(DAYS[r.from])}${r.to!==r.from?'–'+cap(DAYS[r.to]):''}</em> ${r.txt}</span>`).join('');
  const el=$('openNow'); if(!el) return;
  const now=madridNow(), today=H[now.dow]||[];
  const cur=today.find(([a,b])=>now.min>=toMin(a)&&now.min<toMin(b));
  if(cur){el.className='open-now is-open';el.innerHTML=`<i></i>Abierto ahora · cierra a las ${cur[1]}`;return;}
  for(let i=0;i<8;i++){
    const d=(now.dow+i)%7, r=(H[d]||[]).find(([a])=>i>0||toMin(a)>now.min);
    if(r){el.className='open-now';el.innerHTML=`<i></i>Cerrado ahora · abre ${i===0?'hoy':i===1?'mañana':'el '+DAYS[d]} a las ${r[0]}`;return;}
  }
}
renderHours();

/* ---------- API de reservas (Google Apps Script) ---------- */
const API={
  live:!!CONFIG.bookingApi,
  async get(params){
    const r=await fetch(CONFIG.bookingApi+'?'+new URLSearchParams(params));
    return r.json();
  },
  async post(body){
    const r=await fetch(CONFIG.bookingApi,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(body)});
    return r.json();
  }
};
if(API.live){
  API.get({action:'config'}).then(c=>{if(c&&c.ok&&c.hours){CONFIG.openingHours=c.hours;renderHours();if(BK)BK.renderCal();}}).catch(()=>{});
}

/* Huecos libres de un día (modo demo: calculados con el horario) */
async function fetchSlots(date,min){
  if(API.live){
    const r=await API.get({action:'slots',date,duration:min});
    if(!r.ok) throw new Error(r.error||'error');
    return r.slots;
  }
  await new Promise(r=>setTimeout(r,350));
  const dow=new Date(date+'T12:00').getDay(), now=madridNow(), out=[];
  (CONFIG.openingHours[dow]||[]).forEach(([a,b])=>{
    for(let t=toMin(a);t+min<=toMin(b);t+=CONFIG.slotStep){
      if(date===now.date&&t<now.min+CONFIG.minNoticeHours*60) continue;
      out.push(toHHMM(t));
    }
  });
  return out;
}

/* ---------- Agenda de reservas ---------- */
let BK=null;
if($('bk')) BK=(()=>{
  const st={step:1,svc:null,date:null,time:null,month:null,filter:'all'};
  const panels=[...document.querySelectorAll('.bk-panel')];
  const steps=[...$('bkSteps').children];
  const next=$('bkNext'), back=$('bkBack');

  /* Paso 1: tratamientos */
  function renderSvcs(){
    $('bkSvcs').innerHTML=SERVICES.filter(s=>st.filter==='all'||s.cat===st.filter).map(s=>`
      <label class="opt${st.svc&&st.svc.name===s.name?' on':''}">
        <input type="radio" name="svc" value="${esc(s.name)}"${st.svc&&st.svc.name===s.name?' checked':''}>
        <span class="opt-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${ICONS[s.icon]}</svg></span>
        <span class="opt-txt"><b>${s.name}</b><small>${durLabel(s.min)} · ${catLabel[s.cat]}</small></span>
        <span class="opt-price">${priceLabel(s)}</span>
      </label>`).join('');
  }
  $('bkSvcs').addEventListener('change',e=>{
    st.svc=SERVICES.find(s=>s.name===e.target.value); st.time=null;
    document.querySelectorAll('.opt').forEach(o=>o.classList.toggle('on',o.querySelector('input').checked));
    update();
  });
  $('bkTabs').addEventListener('click',e=>{
    const b=e.target.closest('button'); if(!b) return;
    st.filter=b.dataset.f; [...$('bkTabs').children].forEach(x=>x.classList.toggle('on',x===b)); renderSvcs();
  });

  /* Paso 2: calendario + horas */
  const today=new Date(madridNow().date+'T12:00');
  const lastDay=new Date(today); lastDay.setDate(lastDay.getDate()+CONFIG.maxDays);
  st.month=new Date(today.getFullYear(),today.getMonth(),1);
  function dayOpen(d){return (CONFIG.openingHours[d.getDay()]||[]).length>0;}
  function renderCal(){
    const m=st.month, y=m.getFullYear(), mo=m.getMonth();
    const mt=m.toLocaleDateString('es-ES',{month:'long'});$('calTitle').textContent=mt[0].toUpperCase()+mt.slice(1)+' '+y;
    $('calPrev').disabled=y===today.getFullYear()&&mo===today.getMonth();
    $('calNext').disabled=new Date(y,mo+1,1)>lastDay;
    const offset=(new Date(y,mo,1).getDay()+6)%7, days=new Date(y,mo+1,0).getDate();
    let h='';
    for(let i=0;i<offset;i++) h+='<span></span>';
    for(let d=1;d<=days;d++){
      const dt=new Date(y,mo,d,12), key=ymd(dt);
      const off=dt<today||dt>lastDay||!dayOpen(dt);
      h+=`<button type="button" data-d="${key}" class="${key===st.date?'sel':''}${key===ymd(today)?' today':''}" ${off?'disabled':''}>${d}</button>`;
    }
    $('calDays').innerHTML=h;
  }
  $('calPrev').onclick=()=>{st.month=new Date(st.month.getFullYear(),st.month.getMonth()-1,1);renderCal();};
  $('calNext').onclick=()=>{st.month=new Date(st.month.getFullYear(),st.month.getMonth()+1,1);renderCal();};
  $('calDays').addEventListener('click',e=>{
    const b=e.target.closest('button[data-d]'); if(!b||b.disabled) return;
    st.date=b.dataset.d; st.time=null; renderCal(); loadSlots(); update();
  });
  let slotReq=0;
  async function loadSlots(){
    const id=++slotReq, box=$('bkSlots');
    $('slotsTitle').textContent='Horas libres · '+prettyDate(st.date);
    box.innerHTML='<div class="sk"></div>'.repeat(8);
    try{
      const slots=await fetchSlots(st.date,st.svc.min);
      if(id!==slotReq) return;
      box.innerHTML=slots.length?slots.map(t=>`<button type="button" class="slot${t===st.time?' sel':''}" data-t="${t}">${t}</button>`).join('')
        :'<p class="muted">No quedan horas libres este día. Prueba con otra fecha.</p>';
    }catch(err){
      if(id!==slotReq) return;
      box.innerHTML=`<p class="muted">No hemos podido cargar las horas. Inténtalo de nuevo o escríbenos por <a href="${waLink('¡Hola! Quiero reservar cita.')}" target="_blank" rel="noopener">WhatsApp</a>.</p>`;
    }
  }
  $('bkSlots').addEventListener('click',e=>{
    const b=e.target.closest('.slot'); if(!b) return;
    st.time=b.dataset.t; [...$('bkSlots').children].forEach(x=>x.classList.toggle('sel',x===b)); update();
  });

  /* Resumen + navegación */
  function update(){
    $('sSvc').textContent=st.svc?st.svc.name:'—';
    $('sDur').textContent=st.svc?durLabel(st.svc.min):'—';
    $('sPrice').textContent=st.svc?priceLabel(st.svc):'—';
    $('sDate').textContent=st.date?prettyDate(st.date):'—';
    $('sTime').textContent=st.time?st.time+' h':'—';
    next.disabled=(st.step===1&&!st.svc)||(st.step===2&&!(st.date&&st.time));
  }
  function go(n){
    st.step=n;
    panels.forEach(p=>p.hidden=+p.dataset.step!==n);
    steps.forEach((s,i)=>{s.classList.toggle('on',i+1===n);s.classList.toggle('done',i+1<n);});
    $('bkNav').hidden=n===4; back.style.visibility=n===1?'hidden':'visible';
    next.innerHTML=(n===3?'Confirmar reserva ':'Continuar ')+arrow;
    if(n===2){renderCal(); if(st.date) loadSlots();}
    if(n===3) setTimeout(()=>$('fName').focus({preventScroll:true}),50);
    update();
    const top=$('bk').getBoundingClientRect().top;
    if(top<0||top>innerHeight*.5) $('bk').scrollIntoView({behavior:'smooth',block:'start'});
  }
  back.onclick=()=>go(st.step-1);
  next.onclick=()=>st.step<3?go(st.step+1):submit();

  /* Paso 3: confirmar */
  async function submit(){
    const f=$('bkForm'), err=$('bkError'); err.textContent='';
    const d=Object.fromEntries(new FormData(f));
    if(d.website) return; // anti-spam
    if(!d.name.trim()||!d.phone.trim()) return err.textContent='Indica tu nombre y teléfono.';
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return err.textContent='Revisa tu correo electrónico.';
    if(!$('fOk').checked) return err.textContent='Debes aceptar el uso de tus datos para gestionar la cita.';
    next.disabled=true; next.innerHTML='Reservando…';
    const payload={service:st.svc.name,duration:st.svc.min,price:priceLabel(st.svc),date:st.date,time:st.time,
      name:d.name.trim(),email:d.email.trim(),phone:d.phone.trim(),notes:(d.notes||'').trim()};
    try{
      let r;
      if(API.live) r=await API.post(payload);
      else{await new Promise(x=>setTimeout(x,900)); r={ok:true,demo:true};}
      if(r.ok) return done(payload,r);
      if(r.error==='taken'){st.time=null;go(2);showToast('Esa hora se acaba de ocupar. Elige otra, por favor.');return;}
      throw new Error(r.error);
    }catch(e){
      err.innerHTML=`No se ha podido completar la reserva. Inténtalo de nuevo o escríbenos por <a href="${waLink(`¡Hola! Quiero reservar ${payload.service} el ${prettyDate(payload.date)} a las ${payload.time}.`)}" target="_blank" rel="noopener">WhatsApp</a>.`;
      next.disabled=false; next.innerHTML='Confirmar reserva '+arrow;
    }
  }
  function done(p,r){
    const start=p.date.replace(/-/g,'')+'T'+p.time.replace(':','')+'00';
    const e=toMin(p.time)+p.duration, end=p.date.replace(/-/g,'')+'T'+toHHMM(e).replace(':','')+'00';
    $('doneCal').href='https://calendar.google.com/calendar/render?'+new URLSearchParams({action:'TEMPLATE',text:`${p.service} · JM Aesthetic`,dates:`${start}/${end}`,ctz:'Europe/Madrid',location:CONFIG.address,details:`Tu cita en JM Aesthetic. Teléfono: ${CONFIG.phoneLabel}`});
    $('doneText').innerHTML=`Te esperamos el <b>${prettyDate(p.date)}</b> a las <b>${p.time} h</b> para tu <b>${esc(p.service)}</b>.<br>Te hemos enviado la confirmación a <b>${esc(p.email)}</b>.`;
    $('doneDemo').textContent=r.demo?'Modo demostración: la agenda aún no está conectada a Google Calendar, esta reserva no se ha guardado.':'';
    $('bkForm').reset(); go(4);
  }
  $('doneNew').onclick=()=>{st.svc=null;st.date=null;st.time=null;renderSvcs();go(1);};

  /* Preselección desde un botón "Reservar" */
  function pick(name){
    const s=SERVICES.find(x=>x.name===name); if(!s) return;
    st.svc=s; st.time=null; st.filter='all';
    [...$('bkTabs').children].forEach(x=>x.classList.toggle('on',x.dataset.f==='all'));
    renderSvcs(); go(2);
  }
  renderSvcs(); renderCal(); go(1);
  try{const pre=sessionStorage.getItem('jm_svc');if(pre){sessionStorage.removeItem('jm_svc');pick(pre);}}catch(_){}
  return {pick,renderCal};
})();

/* ---------- Botones "Reservar" ---------- */
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-book]'); if(!b) return;
  e.preventDefault();
  document.body.classList.remove('menu-open');
  if(!BK){ // página de servicios → ir a la agenda
    try{ if(b.dataset.svc) sessionStorage.setItem('jm_svc',b.dataset.svc); }catch(_){}
    window.location.href='index.html#reservar'; return;
  }
  if(b.dataset.svc) BK.pick(b.dataset.svc);
  $('reservar').scrollIntoView({behavior:'smooth'});
});

const toast=$('toast');
function showToast(m){toast.textContent=m;toast.classList.add('show');clearTimeout(showToast.t);showToast.t=setTimeout(()=>toast.classList.remove('show'),3600);}

/* ---------- Filtros (página de servicios) ---------- */
function applyFilter(f){
  const btn=document.querySelector(`.filters button[data-f="${f}"]`); if(!btn) return;
  document.querySelectorAll('.filters button').forEach(x=>x.classList.toggle('on',x===btn));
  document.querySelectorAll('.svc').forEach(c=>{
    const show=f==='all'||c.dataset.cat===f;
    c.classList.toggle('hide',!show);
    if(show){c.classList.remove('in');c.style.setProperty('--d','0s');requestAnimationFrame(()=>requestAnimationFrame(()=>c.classList.add('in')));}
  });
}
document.querySelectorAll('.filters button').forEach(btn=>btn.addEventListener('click',()=>{applyFilter(btn.dataset.f);try{history.replaceState(null,'',btn.dataset.f==='all'?location.pathname:'#'+btn.dataset.f);}catch(_){}}));
const fromHash=()=>{const h=location.hash.slice(1);if(['facial','corporal','mirada'].includes(h))applyFilter(h);};
if(grid){fromHash();addEventListener('hashchange',fromHash);}

/* ---------- Animaciones ---------- */
(()=>{const h=$('heroTitle');if(!h)return;let i=0;
  const walk=n=>{[...n.childNodes].forEach(c=>{
    if(c.nodeType===3){const frag=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(w=>{
      if(!w.trim()){frag.appendChild(document.createTextNode(w));return;}
      const s=document.createElement('span');s.className='w';s.textContent=w;s.style.animationDelay=(.7+i++*.09)+'s';frag.appendChild(s);});
      c.replaceWith(frag);}
    else walk(c);});};walk(h);})();

const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}}),{threshold:.12,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.rv,#steps').forEach(el=>io.observe(el));

const co=new IntersectionObserver(es=>es.forEach(en=>{if(!en.isIntersecting)return;co.unobserve(en.target);
  en.target.querySelectorAll('[data-count]').forEach(el=>{const t=+el.dataset.count,suf=el.dataset.suffix||'',plus=el.dataset.plus!==undefined?'+':'';const s=performance.now();
    const tick=n=>{const p=Math.min((n-s)/1600,1),v=Math.round(t*(1-Math.pow(1-p,3)));el.textContent=v+suf+(p===1?plus:'');if(p<1)requestAnimationFrame(tick);};requestAnimationFrame(tick);});
}),{threshold:.5});
document.querySelectorAll('.stats').forEach(s=>co.observe(s));

const header=$('top'),fab=$('fab');
const onScroll=()=>{const y=scrollY;header.classList.toggle('scrolled',y>40);
  const rs=$('reservar'),r=rs?rs.getBoundingClientRect():{top:1e9,bottom:-1e9};
  fab.classList.toggle('show',y>innerHeight*.7&&(r.top>innerHeight*.6||r.bottom<0));
  const bg=document.querySelector('.hero-bg');if(bg&&y<innerHeight)bg.style.translate=`0 ${y*.25}px`;};
addEventListener('scroll',onScroll,{passive:true});onScroll();
$('burger').addEventListener('click',()=>document.body.classList.toggle('menu-open'));
document.querySelectorAll('.links a').forEach(a=>a.addEventListener('click',()=>document.body.classList.remove('menu-open')));

document.querySelectorAll('details').forEach(d=>{
  const s=d.querySelector('summary'),a=d.querySelector('.ans');
  s.addEventListener('click',e=>{e.preventDefault();
    if(d.open){a.animate([{height:a.offsetHeight+'px',opacity:1},{height:'0px',opacity:0}],{duration:400,easing:'ease'}).onfinish=()=>d.open=false;}
    else{document.querySelectorAll('details[open]').forEach(o=>{if(o!==d)o.querySelector('summary').click();});
      d.open=true;const h=a.offsetHeight;a.animate([{height:'0px',opacity:0},{height:h+'px',opacity:1}],{duration:450,easing:'cubic-bezier(.22,.8,.24,1)'});}
  });
});

(()=>{const c=$('sparkles');if(!c)return;const x=c.getContext('2d');
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  let W,H,P=[];const dpr=Math.min(devicePixelRatio||1,2);
  const size=()=>{W=c.offsetWidth;H=c.offsetHeight;c.width=W*dpr;c.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0);};
  size();addEventListener('resize',size);
  const N=Math.round(Math.min(70,W/18));
  for(let i=0;i<N;i++)P.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*2.2+.4,s:Math.random()*.35+.08,o:Math.random()*Math.PI*2,w:Math.random()*.6+.2});
  let mx=-999,my=-999;c.parentElement.addEventListener('pointermove',e=>{const b=c.getBoundingClientRect();mx=e.clientX-b.left;my=e.clientY-b.top;});
  let run=true;new IntersectionObserver(([e])=>{run=e.isIntersecting;if(run)requestAnimationFrame(draw);}).observe(c);
  function draw(t){if(!run)return;x.clearRect(0,0,W,H);
    P.forEach(p=>{p.y-=p.s;p.x+=Math.sin(t/1800+p.o)*p.w*.4;
      const dx=p.x-mx,dy=p.y-my,dist=Math.hypot(dx,dy);if(dist<90){p.x+=dx/dist*1.2;p.y+=dy/dist*1.2;}
      if(p.y<-10){p.y=H+10;p.x=Math.random()*W;}
      const a=.35+.45*Math.sin(t/700+p.o);
      const g=x.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*3);
      g.addColorStop(0,`rgba(232,200,120,${a})`);g.addColorStop(1,'rgba(201,162,74,0)');
      x.fillStyle=g;x.beginPath();x.arc(p.x,p.y,p.r*3,0,7);x.fill();});
    requestAnimationFrame(draw);}
  requestAnimationFrame(draw);})();
