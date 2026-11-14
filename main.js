/* ========= CONFIGURACIÓN: cambia estos datos por los reales de la clienta ========= */
const CONFIG = {
  whatsapp: "34600000000",            // número con prefijo de país, sin + ni espacios
  phoneLabel: "+34 600 000 000",
  instagram: "jm.aesthetic",          // usuario de Instagram sin @
  ownerName: "Nombre de la profesional",   // nombre de la chica para la firma de "Sobre mí"
  address: "Calle Ejemplo 12, Ciudad",
  hours: "Lun – Vie 10:00–20:00 · Sáb 10:00–14:00",
  bookingUrl: ""                      // si usa Booksy/Treatwell/Fresha, pega aquí el enlace y todos los botones irán allí
};

const SERVICES = [
  {cat:"facial",  name:"Higiene facial profunda", desc:"Limpieza, extracción y mascarilla adaptada a tu piel para recuperar luminosidad.", time:"60 min", icon:"drop"},
  {cat:"facial",  name:"Hydrafacial", desc:"Limpia, exfolia e hidrata en profundidad. Piel jugosa y radiante al momento.", time:"60 min", icon:"spark"},
  {cat:"facial",  name:"Dermapen", desc:"Microneedling que estimula colágeno y mejora textura, poros y marcas.", time:"60 min", icon:"dots"},
  {cat:"facial",  name:"Peeling de algas", desc:"Exfoliación natural con microalgas que renueva la piel, afina la textura y aporta luminosidad sin agresividad.", time:"45 min", icon:"leaf"},
  {cat:"facial",  name:"Radiofrecuencia facial", desc:"Efecto tensor y reafirmante para un rostro más firme y definido.", time:"45 min", icon:"wave"},
  {cat:"corporal",name:"Drenaje linfático", desc:"Masaje suave que reduce retención de líquidos y aporta ligereza.", time:"60 min", icon:"leaf"},
  {cat:"corporal",name:"Maderoterapia", desc:"Técnica manual que moldea la silueta y mejora la apariencia de la celulitis.", time:"60 min", icon:"wave"},
  {cat:"corporal",name:"Presoterapia", desc:"Mejora la circulación y descansa las piernas cansadas.", time:"40 min", icon:"layers"},
  {cat:"mirada",  name:"Lifting de pestañas", desc:"Curvatura natural y duradera, sin extensiones. Mirada abierta cada día.", time:"60 min", icon:"eye"},
  {cat:"mirada",  name:"Laminado de cejas", desc:"Cejas peinadas, definidas y con más volumen durante semanas.", time:"45 min", icon:"brow"},
  {cat:"mirada",  name:"Diseño de cejas", desc:"Estudio de tu rostro para crear la forma que mejor te favorece.", time:"30 min", icon:"brow"},
  {cat:"facial",  name:"Valoración personalizada", desc:"Analizamos tu piel y objetivos para diseñar tu plan de tratamiento.", time:"30 min", icon:"heart"}
];
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

/* Render services */
const grid=document.getElementById('grid');
if(grid) grid.innerHTML=SERVICES.map((s,i)=>`
  <article class="svc rv" data-cat="${s.cat}" style="--d:${(i%3)*.1}s">
    <span class="tag">${catLabel[s.cat]}</span>
    <div class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${ICONS[s.icon]}</svg></div>
    <h3>${s.name}</h3><p>${s.desc}</p>
    <div class="meta"><span>${s.time}</span><button class="book" data-book data-svc="${s.name}">Reservar ${arrow}</button></div>
  </article>`).join('');

/* Fill select */
const sel=document.getElementById('fSvc');
if(sel) sel.innerHTML='<option value="" disabled selected>Elige un tratamiento</option>'+
  Object.keys(catLabel).map(c=>`<optgroup label="${catLabel[c]}">${SERVICES.filter(s=>s.cat===c).map(s=>`<option>${s.name}</option>`).join('')}</optgroup>`).join('');

/* Config into page */
document.querySelectorAll('[data-cfg]').forEach(el=>{
  const k=el.dataset.cfg; el.textContent=k==='instagram'?'@'+CONFIG.instagram:CONFIG[k];
});
const waLink=t=>`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(t)}`;
const waBtn=document.getElementById('waBtn');if(waBtn) waBtn.href=waLink('¡Hola! Me gustaría pedir información sobre vuestros tratamientos.');
['igBtn','igFoot'].forEach(id=>{const e=document.getElementById(id);if(e)e.href=`https://instagram.com/${CONFIG.instagram}`;});
document.getElementById('yr').textContent=new Date().getFullYear();
const dateIn=document.getElementById('fDate'); if(dateIn) dateIn.min=new Date().toISOString().split('T')[0];

/* Booking buttons */
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-book]'); if(!b) return;
  if(CONFIG.bookingUrl){ e.preventDefault(); window.location.href=CONFIG.bookingUrl; return; }
  e.preventDefault();
  document.body.classList.remove('menu-open');
  if(!document.getElementById('reservar')){ // estamos en servicios.html → ir a la página principal
    try{ if(b.dataset.svc) sessionStorage.setItem('jm_svc',b.dataset.svc); }catch(_){}
    window.location.href='index.html#reservar'; return;
  }
  if(b.dataset.svc){ sel.value=b.dataset.svc; }
  document.getElementById('reservar').scrollIntoView({behavior:'smooth'});
  const f=document.getElementById('bookForm');
  setTimeout(()=>{f.classList.remove('flash');void f.offsetWidth;f.classList.add('flash');},700);
});

/* Form → WhatsApp */
const toast=document.getElementById('toast');
function showToast(m){toast.textContent=m;toast.classList.add('show');clearTimeout(showToast.t);showToast.t=setTimeout(()=>toast.classList.remove('show'),3600);}
const bookForm=document.getElementById('bookForm');
if(bookForm){try{const pre=sessionStorage.getItem('jm_svc');if(pre){sel.value=pre;sessionStorage.removeItem('jm_svc');setTimeout(()=>{bookForm.classList.add('flash')},900);}}catch(_){}}
if(bookForm) bookForm.addEventListener('submit',e=>{
  e.preventDefault();
  const d=Object.fromEntries(new FormData(e.target));
  if(!d.nombre||!d.servicio){showToast('Por favor, indica tu nombre y el tratamiento.');return;}
  const fecha=d.fecha?new Date(d.fecha+'T12:00').toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'}):'a convenir';
  const txt=`¡Hola! Soy ${d.nombre} y me gustaría reservar cita.\n\n✨ Tratamiento: ${d.servicio}\n📅 Fecha preferida: ${fecha}\n🕐 Franja: ${d.franja}`+(d.telefono?`\n📞 Teléfono: ${d.telefono}`:'')+(d.mensaje?`\n💬 ${d.mensaje}`:'');
  const a=document.createElement('a'); a.href=waLink(txt); a.target='_blank'; a.rel='noopener'; document.body.appendChild(a); a.click(); a.remove();
  showToast('Abriendo WhatsApp con tu solicitud…');
});

/* Filters */
function applyFilter(f){
  const btn=document.querySelector(`.filters button[data-f="${f}"]`); if(!btn) return;
  document.querySelectorAll('.filters button').forEach(x=>x.classList.toggle('on',x===btn));
  document.querySelectorAll('.svc').forEach((c,i)=>{
    const show=f==='all'||c.dataset.cat===f;
    c.classList.toggle('hide',!show);
    if(show){c.classList.remove('in');c.style.setProperty('--d','0s');requestAnimationFrame(()=>requestAnimationFrame(()=>c.classList.add('in')));}
  });
}
document.querySelectorAll('.filters button').forEach(btn=>btn.addEventListener('click',()=>{applyFilter(btn.dataset.f);try{history.replaceState(null,'',btn.dataset.f==='all'?location.pathname:'#'+btn.dataset.f);}catch(_){}}));
const fromHash=()=>{const h=location.hash.slice(1);if(['facial','corporal','mirada'].includes(h))applyFilter(h);};
if(grid){fromHash();addEventListener('hashchange',fromHash);}

/* Hero words */
(()=>{const h=document.getElementById('heroTitle');if(!h)return;let i=0;
  const walk=n=>{[...n.childNodes].forEach(c=>{
    if(c.nodeType===3){const frag=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(w=>{
      if(!w.trim()){frag.appendChild(document.createTextNode(w));return;}
      const s=document.createElement('span');s.className='w';s.textContent=w;s.style.animationDelay=(.7+i++*.09)+'s';frag.appendChild(s);});
      c.replaceWith(frag);}
    else walk(c);});};walk(h);})();

/* Reveal on scroll */
const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}}),{threshold:.15,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.rv,#steps').forEach(el=>io.observe(el));

/* Counters */
const co=new IntersectionObserver(es=>es.forEach(en=>{if(!en.isIntersecting)return;co.unobserve(en.target);
  en.target.querySelectorAll('[data-count]').forEach(el=>{const t=+el.dataset.count,suf=el.dataset.suffix||'',plus=el.dataset.plus!==undefined?'+':'';const s=performance.now();
    const tick=n=>{const p=Math.min((n-s)/1600,1),v=Math.round(t*(1-Math.pow(1-p,3)));el.textContent=v+suf+(p===1?plus:'');if(p<1)requestAnimationFrame(tick);};requestAnimationFrame(tick);});
}),{threshold:.5});
document.querySelectorAll('.stats').forEach(s=>co.observe(s));

/* Header + FAB */
const header=document.getElementById('top'),fab=document.getElementById('fab');
const onScroll=()=>{const y=scrollY;header.classList.toggle('scrolled',y>40);
  const rs=document.getElementById('reservar'),r=rs?rs.getBoundingClientRect():{top:1e9};
  fab.classList.toggle('show',y>innerHeight*.7&&r.top>innerHeight*.6);
  const bg=document.querySelector('.hero-bg');if(bg&&y<innerHeight)bg.style.translate=`0 ${y*.25}px`;};
addEventListener('scroll',onScroll,{passive:true});onScroll();
document.getElementById('burger').addEventListener('click',()=>document.body.classList.toggle('menu-open'));
document.querySelectorAll('.links a').forEach(a=>a.addEventListener('click',()=>document.body.classList.remove('menu-open')));

/* FAQ smooth open */
document.querySelectorAll('details').forEach(d=>{
  const s=d.querySelector('summary'),a=d.querySelector('.ans');
  s.addEventListener('click',e=>{e.preventDefault();
    if(d.open){a.animate([{height:a.offsetHeight+'px',opacity:1},{height:'0px',opacity:0}],{duration:400,easing:'ease'}).onfinish=()=>d.open=false;}
    else{document.querySelectorAll('details[open]').forEach(o=>{if(o!==d)o.querySelector('summary').click();});
      d.open=true;const h=a.offsetHeight;a.animate([{height:'0px',opacity:0},{height:h+'px',opacity:1}],{duration:450,easing:'cubic-bezier(.22,.8,.24,1)'});}
  });
});

/* Gold sparkles */
(()=>{const c=document.getElementById('sparkles');if(!c)return;const x=c.getContext('2d');
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
