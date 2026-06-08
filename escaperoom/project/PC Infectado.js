"use strict";
/* =================================================================
   CONFIGURACIÓN — EDITAR AQUÍ ANTES DE PRODUCCIÓN
   ================================================================= */
const SSH_CONFIG = {
  user: "[PENDIENTE]",   // p.ej. "victima"
  ip:   "[PENDIENTE]",   // p.ej. "192.168.1.50"
  pass: "[PENDIENTE]"    // p.ej. "Sh4d0w-2024!"
};
const CODES = {            // códigos hardcodeados (no tocar salvo cambio de pruebas)
  "file-1": "K3RN3L-P4N1C",
  "file-2": "R00T-4CC355",
  "file-3": "3XF1LTR4T3D"
};
const STORE_KEY = "escape_pc_infectado_v1";

/* =================================================================
   ESTADO
   ================================================================= */
const state = {
  unlocked: { "file-1": false, "file-2": false, "file-3": false },
  codes:    { "file-1": false, "file-2": false, "file-3": false },
  muted: false,
  popupsOn: false,
  ended: false,
  timer: 47 * 60
};
function loadState(){
  try{
    const s = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
    if(s.unlocked) Object.assign(state.unlocked, s.unlocked);
    if(s.codes) Object.assign(state.codes, s.codes);
    if(typeof s.muted === "boolean") state.muted = s.muted;
  }catch(e){}
}
function saveState(){
  localStorage.setItem(STORE_KEY, JSON.stringify({unlocked:state.unlocked, codes:state.codes, muted:state.muted}));
}
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const allDone = () => Object.values(state.unlocked).every(Boolean);

/* =================================================================
   AUDIO (WebAudio, puntual)
   ================================================================= */
let actx = null;
function audioInit(){ if(!actx){ try{ actx = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } }
function tone(freq, dur, type, vol, glideTo){
  if(!actx || state.muted) return;
  const o = actx.createOscillator(), g = actx.createGain();
  o.type = type||"square"; o.frequency.value = freq;
  if(glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, actx.currentTime+dur);
  g.gain.value = vol||0.06;
  g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime+dur);
  o.connect(g); g.connect(actx.destination);
  o.start(); o.stop(actx.currentTime+dur);
}
function sndCorrect(){ tone(440,.08,"square",.05); setTimeout(()=>tone(660,.1,"square",.05),90); setTimeout(()=>tone(880,.16,"square",.06),190); }
function sndWrong(){ tone(160,.18,"sawtooth",.08,70); setTimeout(()=>tone(120,.22,"sawtooth",.08,55),120); }
function sndGlitch(){ tone(90+Math.random()*120,.05,"sawtooth",.03); }
function sndPopup(){ tone(700,.04,"square",.03); setTimeout(()=>tone(500,.05,"square",.03),60); }
function sndType(){ tone(1300+Math.random()*220,.012,"square",.012); }
function sndReveal(){ if(!actx||state.muted) return; tone(58,.7,"sine",.09,38); tone(150,.45,"sawtooth",.05,80); }
function sndClimax(){
  if(!actx||state.muted) return;
  let f=880; const seq=[880,740,620,520,440,370,300];
  seq.forEach((fr,i)=>setTimeout(()=>tone(fr,.35,"sawtooth",.07),i*180));
  setTimeout(()=>{ tone(120,1.4,"sine",.09,60); },seq.length*180+200);
}

/* =================================================================
   MATRIX RAIN
   ================================================================= */
function initRain(){
  const c = $("#rain"), x = c.getContext("2d");
  let cols, drops, fontSize=15;
  function resize(){
    c.width = window.innerWidth; c.height = window.innerHeight;
    cols = Math.floor(c.width/fontSize);
    drops = Array(cols).fill(0).map(()=>Math.random()*-50);
  }
  resize(); window.addEventListener("resize", resize);
  const glyphs = "01<>[]{}#%&$@K3RNLP4NICR00T4CC355XFLTR4T3D";
  function draw(){
    x.fillStyle = "rgba(5,5,5,0.12)"; x.fillRect(0,0,c.width,c.height);
    x.font = fontSize+"px 'Courier New', monospace";
    for(let i=0;i<drops.length;i++){
      const ch = glyphs[Math.floor(Math.random()*glyphs.length)];
      const corrupt = Math.random()<0.04;
      x.fillStyle = corrupt ? "rgba(255,40,40,0.85)" : "rgba(0,255,65,0.55)";
      x.fillText(ch, i*fontSize, drops[i]*fontSize);
      if(drops[i]*fontSize > c.height && Math.random()>0.975) drops[i]=0;
      drops[i] += 0.5;
    }
    rainRAF = requestAnimationFrame(draw);
  }
  draw();
}
let rainRAF = null;

/* =================================================================
   INTRO SEQUENCE
   ================================================================= */
const introLines = [
  ["rd","████  SISTEMA COMPROMETIDO  ████\n\n"],
  ["am","◉ MENSAJE ENTRANTE — ORIGEN DESCONOCIDO\n"],
  ["am","────────────────────────────\n\n"],
  ["MASK",""],
  ["wh","Hola.\n\n"],
  ["wh","Si estás leyendo esto, ya es tarde.\n\n"],
  ["wh","Me llaman "],["gl","SH4D0W"],["wh",". He entrado en la\nred de vuestra aula y me lo he llevado todo:\nvuestros documentos, vuestro trabajo, vuestras\nfotos. Ahora está cifrado. Es "],["gl","mío"],["wh",".\n\n"],
  ["wh","No quiero vuestro dinero. Quiero saber si\nsois tan buenos como creéis.\n\n"],
  ["wh","Partí la clave maestra en "],["am","TRES"],["wh"," pedazos y\nescondí cada uno en un desafío, repartidos\npor vuestra aula:\n\n"],
  ["am","  [1] "],["gl","BULLET-HELL"],["wh","     →  documento_personal.pdf\n"],
  ["am","  [2] "],["gl","DESAFÍO ASCII"],["wh","   →  proyecto_trabajo.xlsx\n"],
  ["am","  [3] "],["gl","FOTO OCULTA"],["wh","     →  fotos_familia.zip\n\n"],
  ["wh","Resolvedlos, conseguid los tres códigos y\nmetedlos en mi herramienta "],["gl","DESCIFRADOR.exe"],["wh",".\nLas tres. Si acertáis, os devuelvo lo vuestro.\n\n"],
  ["rd","Si falláis, el reloj llega a cero y lo borro\ntodo. Para siempre.\n\n"],
  ["am","El tiempo corre desde YA.\n\n"],
  ["gl","                          — SH4D0W\n"]
];
function runIntro(){
  const el = $("#intro-text"); let li=0, ci=0; el.textContent="";
  function step(){
    if(state._introSkipped) return;
    if(li>=introLines.length){ finishIntro(); return; }
    const [cls, txt] = introLines[li];
    if(cls==="MASK"){
      const m = document.querySelector(".intro-mask"); if(m) m.classList.add("in");
      sndReveal(); glitch();
      li++; setTimeout(step, 450);
      return;
    }
    if(cls==="ENC"){
      const bar = $("#enc-bar"); bar.style.display="block"; const fill=bar.querySelector("i");
      let p=0; const iv=setInterval(()=>{ p+=Math.random()*9+3; if(p>=100){ p=100; fill.style.width="100%"; clearInterval(iv); setTimeout(()=>{ bar.style.display="none"; li++; step(); }, 550); return; } fill.style.width=p+"%"; sndGlitch(); },70);
      return;
    }
    if(ci===0){ const span=document.createElement("span"); if(cls) span.className=cls; span.dataset.li=li; el.appendChild(span); }
    const span = el.querySelector('span[data-li="'+li+'"]');
    if(ci<txt.length){
      const ch = txt[ci]; span.textContent += ch; ci++;
      el.scrollTop = el.scrollHeight;
      if(ch!==" " && ch!=="\n"){
        if(cls==="wh"){ if(Math.random()<0.22) sndType(); }
        else if(Math.random()<0.5) sndGlitch();
      }
      const slow = cls==="wh";
      setTimeout(step, ch==="\n"? 6 : (slow ? (2+Math.random()*7) : (1+Math.random()*9)));
    }else{ li++; ci=0; setTimeout(step, cls==="wh"?18:28); }
  }
  step();
}
function finishIntro(){
  $("#enc-bar").style.display="none";
  $("#enter-btn").style.display="block";
  const el=$("#intro-text"); if(el) el.scrollTop = el.scrollHeight;
}
function closeIntro(){
  audioInit();
  $("#intro").classList.add("hidden");
  if(allDone()){ state.ended=true; $("#attacker-icon").classList.add("show"); return; }
  state.popupsOn = true;
  startPopups();
  setTimeout(()=>{ if(!state.ended) openDecryptor(); }, 1100);
}

/* =================================================================
   DESKTOP / CLOCK / TIMER
   ================================================================= */
function tickClock(){
  const now = new Date();
  const p = n => String(n).padStart(2,"0");
  $("#clock .t").textContent = p(now.getHours())+":"+p(now.getMinutes());
  $("#clock .d").textContent = p(now.getDate())+"/"+p(now.getMonth()+1)+"/"+now.getFullYear();
}
function tickTimer(){
  if(state.ended) return;
  if(state.timer>0) state.timer--;
  const m = Math.floor(state.timer/60), s = state.timer%60;
  $("#timer").textContent = String(m).padStart(2,"0")+":"+String(s).padStart(2,"0");
}
function accelerateTimer(){
  state.timer = Math.max(30, state.timer - (90+Math.floor(Math.random()*120)));
  tickTimer();
  const t = $("#timer"); t.style.transform="scale(1.15)"; setTimeout(()=>t.style.transform="",200);
}

/* =================================================================
   GLITCH / ALERT EFFECTS
   ================================================================= */
function glitch(){
  document.body.classList.add("glitching");
  setTimeout(()=>document.body.classList.remove("glitching"),320);
}
function alertFlash(){
  const f=$("#alertflash"); f.classList.remove("flash"); void f.offsetWidth; f.classList.add("flash");
}

/* =================================================================
   WINDOW MANAGEMENT (draggable)
   ================================================================= */
let zTop = 100;
function makeDraggable(win, handle){
  let ox=0, oy=0, dragging=false;
  handle.addEventListener("mousedown", e=>{
    if(e.target.classList.contains("wx")) return;
    dragging=true; const r=win.getBoundingClientRect(); ox=e.clientX-r.left; oy=e.clientY-r.top;
    win.style.zIndex=++zTop; e.preventDefault();
  });
  window.addEventListener("mousemove", e=>{
    if(!dragging) return;
    let nx=e.clientX-ox, ny=e.clientY-oy;
    nx=Math.max(0,Math.min(window.innerWidth-80,nx));
    ny=Math.max(0,Math.min(window.innerHeight-60,ny));
    win.style.left=nx+"px"; win.style.top=ny+"px"; win.style.right="auto";
  });
  window.addEventListener("mouseup", ()=>dragging=false);
}
function spawnWindow(html, cls, x, y){
  const w = document.createElement("div");
  w.className = "win "+(cls||"");
  w.innerHTML = html;
  w.style.left = (x ?? (window.innerWidth/2 - 215))+"px";
  w.style.top  = (y ?? Math.max(40, window.innerHeight/2 - 220))+"px";
  w.style.zIndex = ++zTop;
  $("#desktop").appendChild(w);
  const bar = w.querySelector(".win-bar");
  if(bar) makeDraggable(w, bar);
  const x2 = w.querySelector(".wx");
  if(x2) x2.addEventListener("click", ()=>w.remove());
  return w;
}

/* =================================================================
   DECRYPT WINDOW
   ================================================================= */
function extLabel(ext){ return {pdf:"PDF",xls:"XLS",zip:"ZIP",txt:"TXT"}[ext]||"BIN"; }
function extColor(ext){ return {pdf:"#ff5b5b",xls:"#4ad66d",zip:"#ffae00",txt:"#bbb"}[ext]||"#bbb"; }

const FILES = [
  {id:"file-1", name:"documento_personal.pdf", ext:"pdf", code:CODES["file-1"], prueba:"Prueba 1 · Bullet-hell", placeholder:"XXXXXX-XXXXX"},
  {id:"file-2", name:"proyecto_trabajo.xlsx", ext:"xls", code:CODES["file-2"], prueba:"Prueba 2 · Reto ASCII", placeholder:"XXXX-XXXXXX"},
  {id:"file-3", name:"fotos_familia.zip", ext:"zip", code:CODES["file-3"], prueba:"Prueba 3 · Foto con código oculto", placeholder:"XXXXXXXXXX"}
];

let decryptorWin = null;
function openDecryptor(){
  if(decryptorWin && document.body.contains(decryptorWin)){ decryptorWin.style.zIndex=++zTop; return decryptorWin; }
  const slots = FILES.map(f=>`
    <div class="slot${state.codes[f.id]?' ok':''}" data-id="${f.id}">
      <div class="srow1">
        <div class="smini"><span class="ext" style="color:${extColor(f.ext)}">${extLabel(f.ext)}</span></div>
        <div class="sinfo"><div class="sname">${f.name}</div><div class="sprueba">${f.prueba}</div></div>
        <div class="sstatus">${state.codes[f.id]?'CLAVE OK':'BLOQUEADO'}</div>
      </div>
      <div class="srow2">
        <input type="text" autocomplete="off" spellcheck="false" maxlength="20" placeholder="${f.placeholder}" ${state.codes[f.id]?'disabled value="✓ CLAVE ACEPTADA"':''}>
        <button class="sv" ${state.codes[f.id]?'disabled':''}>${state.codes[f.id]?'✓':'VALIDAR'}</button>
      </div>
      <div class="smsg"></div>
    </div>`).join("");
  const html = `
    <div class="win-bar"><span class="wt">DESCIFRADOR.exe — Herramienta de recuperación</span><span class="wx">✕</span></div>
    <div class="win-body dec-body">
      <div class="dec-head">
        <div class="dh-title"><span class="ic">⚿</span> Panel de descifrado de archivos</div>
        <p>Introduce las <b>3 claves</b> que obtengas al superar las pruebas de la sala. Esta herramienta solo valida las claves: <b>los archivos no se descifran hasta introducir las tres correctamente.</b></p>
      </div>
      <div class="slots">${slots}</div>
      <div class="dec-foot">
        <div class="dec-prog">CLAVES VÁLIDAS: <span class="dec-pills"><span class="dp"></span><span class="dp"></span><span class="dp"></span></span> <span class="dec-count">0 / 3</span></div>
        <button class="dec-cta" disabled>DESCIFRAR TODOS LOS ARCHIVOS</button>
        <div class="dec-globalbar"><i></i></div>
        <div class="dec-log"></div>
      </div>
    </div>`;
  const w = spawnWindow(html, "decryptor", window.innerWidth/2-270, 60);
  decryptorWin = w;
  w.querySelectorAll(".slot").forEach(slot=>{
    const id = slot.dataset.id;
    const input = slot.querySelector("input"), btn = slot.querySelector(".sv"), msg = slot.querySelector(".smsg");
    function tryValidate(){
      if(state.codes[id]) return;
      const val = input.value.trim().toUpperCase().replace(/\s+/g,"");
      if(!val) return;
      const f = FILES.find(x=>x.id===id);
      if(val === f.code){
        state.codes[id]=true; saveState();
        slot.classList.add("ok"); msg.className="smsg"; msg.textContent="";
        slot.querySelector(".sstatus").textContent="CLAVE OK";
        input.disabled=true; input.value="✓ CLAVE ACEPTADA"; input.classList.remove("bad");
        btn.textContent="✓"; btn.disabled=true;
        sndCorrect(); updateDecProgress(w);
      }else{
        const other = FILES.find(x=>x.code===val);
        input.classList.remove("bad"); void input.offsetWidth; input.classList.add("bad"); input.value="";
        if(other){ msg.className="smsg warn"; msg.textContent="Esa clave pertenece a otra prueba. Colócala en su archivo."; }
        else { msg.className="smsg"; msg.textContent="✕ ACCESS DENIED — clave no reconocida"; }
        sndWrong(); glitch(); alertFlash(); accelerateTimer();
      }
    }
    btn.addEventListener("click", tryValidate);
    input.addEventListener("keydown", e=>{ if(e.key==="Enter") tryValidate(); });
  });
  w.querySelector(".dec-cta").addEventListener("click", function(){ if(this.classList.contains("ready")) decryptAll(w); });
  updateDecProgress(w);
  setTimeout(()=>{ const fi=w.querySelector('.slot:not(.ok) input'); if(fi) fi.focus(); },60);
  return w;
}
function updateDecProgress(w){
  const n = Object.values(state.codes).filter(Boolean).length;
  w.querySelector(".dec-count").textContent = n+" / 3";
  w.querySelectorAll(".dp").forEach((d,i)=>{ d.style.background = i<n ? "var(--green)" : "#330808"; d.style.borderColor = i<n ? "var(--green)" : "#5a1010"; if(i<n) d.style.boxShadow="0 0 8px rgba(0,255,65,.6)"; });
  const cta = w.querySelector(".dec-cta");
  if(n===3){ cta.classList.add("ready"); cta.disabled=false; }
  else { cta.classList.remove("ready"); cta.disabled=true; }
}
function decryptAll(w){
  const cta = w.querySelector(".dec-cta"), gbar = w.querySelector(".dec-globalbar"), gfill = gbar.querySelector("i"), logEl = w.querySelector(".dec-log");
  cta.classList.remove("ready"); cta.disabled=true; cta.textContent="DESCIFRANDO ARCHIVOS...";
  gbar.classList.add("show"); logEl.classList.add("show");
  w.querySelectorAll(".slot input, .slot .sv").forEach(el=>el.disabled=true);
  sndCorrect();
  let p=0, done=0;
  const iv = setInterval(()=>{
    p += Math.random()*6+3;
    const idx = Math.min(2, Math.floor(p/33));
    while(done<=idx && done<3){
      const f = FILES[done];
      logEl.textContent += "[OK] "+f.name+" — DESCIFRADO\n";
      state.unlocked[f.id]=true; markUnlocked(f.id); sndCorrect();
      done++;
    }
    if(p>=100){ p=100; clearInterval(iv); FILES.forEach(f=>state.unlocked[f.id]=true); saveState();
      logEl.textContent += "\n[!] Todos los archivos han sido restaurados.";
      setTimeout(()=>{ w.remove(); decryptorWin=null; triggerClimax(false); }, 1100); }
    gfill.style.width = p+"%";
  }, 110);
}
function lockedNotice(id){
  const f = FILES.find(x=>x.id===id);
  const html = `
    <div class="win-bar lock"><span class="wt">⚠ Acceso denegado</span><span class="wx">✕</span></div>
    <div class="win-body"><div style="padding:18px 20px;max-width:380px">
      <div style="color:var(--red-bright);font-weight:bold;margin-bottom:9px;font-size:14px">${f.name} está cifrado</div>
      <div style="font-size:12px;color:#c0a8a8;line-height:1.6">No puedes abrir este archivo todavía. Abre la herramienta <b style="color:#fff">DESCIFRADOR.exe</b> del escritorio e introduce las <b style="color:#fff">3 claves</b> que consigas en las pruebas para recuperar todos los archivos a la vez.</div>
      <button class="lgo" style="margin-top:15px;background:var(--red);border:1px solid #ff6060;color:#fff;padding:10px 18px;cursor:pointer;font-weight:bold;letter-spacing:.08em;font-family:var(--mono)">ABRIR DESCIFRADOR</button>
    </div></div>`;
  const w = spawnWindow(html, "", null, null);
  w.querySelector(".lgo").addEventListener("click", ()=>{ w.remove(); openDecryptor(); });
}

function markUnlocked(iconId){
  const icon = $("#"+iconId); if(icon) icon.classList.add("unlocked");
  const lockSvg = icon.querySelector(".lock");
  if(lockSvg) lockSvg.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="#003d12" stroke-width="2.6"><path d="M6 12l4 4 8-8"/></svg>';
  updateProgress();
}
function updateProgress(){
  const n = Object.values(state.unlocked).filter(Boolean).length;
  $("#progress-txt").textContent = n+" / 3 DESCIFRADAS";
  $$(".pill").forEach((p,i)=>{ p.classList.toggle("on", i<n); });
  ["file-1","file-2","file-3"].forEach((id,i)=>{
    const pill=$('.pill[data-p="'+(i+1)+'"]'); if(pill) pill.classList.toggle("on", state.unlocked[id]);
  });
}

/* =================================================================
   FILE CONTENT VIEWERS
   ================================================================= */
function openContent(iconId){
  if(iconId==="file-1") openPDF();
  else if(iconId==="file-2") openXLS();
  else if(iconId==="file-3") openZIP();
}
function openPDF(){
  const html = `
    <div class="win-bar"><span class="wt">documento_personal.pdf — Visor PDF</span><span class="wx">✕</span></div>
    <div class="win-body"><div class="pdfdoc viewer">
      <div class="ph"><h2>CONTRATO DE ARRENDAMIENTO</h2><div class="meta">Ref. 2024/0481<br>Folio 1 de 4</div></div>
      <div class="row"><div class="k">Arrendatario</div><div><span class="redact">██████████████</span></div></div>
      <div class="row"><div class="k">DNI / NIF</div><div><span class="redact">████████</span>-X</div></div>
      <div class="row"><div class="k">Domicilio</div><div>C/ <span class="redact">██████████</span>, nº 14, 3º B</div></div>
      <div class="row"><div class="k">Teléfono</div><div>6██ ███ ██1</div></div>
      <div class="row"><div class="k">Cuenta bancaria</div><div>ES__ ____ ____ __<span class="redact">██████</span></div></div>
      <div class="row"><div class="k">Renta mensual</div><div>720,00 €</div></div>
      <div class="row"><div class="k">Fianza</div><div>1.440,00 €</div></div>
      <div class="row"><div class="k">Fecha de firma</div><div>14 de marzo de 2024</div></div>
      <div class="note">Documento recuperado del cifrado. Algunos campos personales aparecen censurados automáticamente por el visor. Este archivo es ficticio y forma parte del escape room.</div>
    </div></div>`;
  spawnWindow(html, "viewer");
}
function openXLS(){
  const rows = [
    ["Hosting servidores","Infraestructura","3","1.200,00","3.600,00"],
    ["Licencias software","Operaciones","12","89,00","1.068,00"],
    ["Campaña marketing","Ventas","1","4.500,00","4.500,00"],
    ["Equipo portátil","Hardware","4","930,00","3.720,00"],
    ["Auditoría seguridad","Consultoría","1","2.800,00","2.800,00"],
    ["Formación equipo","RRHH","6","150,00","900,00"]
  ];
  const body = rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td class="num">${r[2]}</td><td class="num">${r[3]} €</td><td class="num">${r[4]} €</td></tr>`).join("");
  const total = rows.reduce((s,r)=>s+parseFloat(r[4].replace(".","").replace(",",".")),0);
  const html = `
    <div class="win-bar"><span class="wt">proyecto_trabajo.xlsx — Hoja de cálculo</span><span class="wx">✕</span></div>
    <div class="win-body"><div class="xls viewer">
      <div class="xtop"><span>Presupuesto_Q2_2024.xlsx</span><span>Hoja 1 · 6 filas</span></div>
      <table>
        <thead><tr><th>Concepto</th><th>Departamento</th><th>Uds.</th><th>Coste unit.</th><th>Total</th></tr></thead>
        <tbody>${body}
          <tr class="total"><td>TOTAL</td><td></td><td></td><td></td><td class="num">${total.toLocaleString("es-ES",{minimumFractionDigits:2})} €</td></tr>
        </tbody>
      </table>
    </div></div>`;
  spawnWindow(html, "viewer");
}
function openZIP(){
  const caps = ["IMG_2041.jpg","IMG_2042.jpg","IMG_2055.jpg","IMG_2061.jpg","verano_playa.jpg","cumple_2023.jpg"];
  const cells = caps.map((c,i)=>`<div class="ph"><canvas data-seed="${i*37+11}" width="80" height="60"></canvas><div class="cap">${c}</div></div>`).join("");
  const html = `
    <div class="win-bar"><span class="wt">fotos_familia.zip — Explorador de archivos</span><span class="wx">✕</span></div>
    <div class="win-body"><div class="zip viewer">
      <div class="ztop"><span>fotos_familia.zip — 6 elementos</span><span>vista previa de baja resolución</span></div>
      <div class="grid">${cells}</div>
    </div></div>`;
  const w = spawnWindow(html, "viewer");
  w.querySelectorAll("canvas").forEach(cv=>drawPixelPhoto(cv, parseInt(cv.dataset.seed)));
}
function drawPixelPhoto(cv, seed){
  const x = cv.getContext("2d"); const W=cv.width, H=cv.height; const ps=8;
  let s = seed||1; const rnd = ()=>{ s=(s*9301+49297)%233280; return s/233280; };
  const palettes = [
    [[120,90,70],[160,130,100],[90,110,140],[200,180,150]],
    [[60,90,120],[110,140,170],[180,200,210],[80,70,90]],
    [[150,120,90],[200,170,120],[100,80,60],[230,210,170]]
  ];
  const pal = palettes[seed % palettes.length];
  for(let yy=0; yy<H; yy+=ps){
    for(let xx=0; xx<W; xx+=ps){
      const c = pal[Math.floor(rnd()*pal.length)];
      const j = (rnd()-.5)*40;
      x.fillStyle = `rgb(${c[0]+j|0},${c[1]+j|0},${c[2]+j|0})`;
      x.fillRect(xx,yy,ps,ps);
    }
  }
}

/* =================================================================
   READ-ME / RANSOM NOTE
   ================================================================= */
function openReadme(){
  const html = `
    <div class="win-bar lock"><span class="wt">LEEME_RESCATE.txt — Bloc de notas</span><span class="wx">✕</span></div>
    <div class="win-body"><div class="term" style="background:#0a0202;color:#e8b0b0">
<span class="rd">============================================</span>
<span class="rd">     S H 4 D 0 W - C R Y P T   ·   v3.7</span>
<span class="rd">============================================</span>

Te lo dije: ya es tarde.

He cifrado TODO lo que había en este equipo.
Documentos, hojas de cálculo, fotos. Bloqueado.

Partí la clave maestra en <b style="color:#fff">3 PEDAZOS</b> y los
escondí en tres pruebas, repartidas por tu aula:

  <span class="am">[1]</span> documento_personal.pdf  →  prueba BULLET-HELL
  <span class="am">[2]</span> proyecto_trabajo.xlsx    →  desafío ASCII
  <span class="am">[3]</span> fotos_familia.zip        →  foto con código oculto

Resuélvelas, consigue los tres códigos y mételos
en mi herramienta <b style="color:#fff">DESCIFRADOR.exe</b>. Los archivos
se descifran todos a la vez, no antes.

¿Lo logras antes de que el reloj llegue a cero?
Lo dudo.

<span class="rd">No apagues el equipo. No formatees. El tiempo corre.</span>
                                   — SH4D0W
    </div></div>`;
  spawnWindow(html, "viewer", window.innerWidth/2-280, 90);
}

/* =================================================================
   POPUPS (medio: recurrentes)
   ================================================================= */
const popupTemplates = [
  () => ({title:"SH4D0W", body:`<div class="big">¿SIGUES AHÍ?</div>Veo que todavía no has descifrado nada. El reloj no espera... y yo tampoco.`, btns:[["...","prime"]]}),
  () => ({title:"⚠ ANTIVIRUS DEL SISTEMA", body:`<div class="av"><div class="sh">!</div><div><b style="color:#ff6b6b">AMENAZA CRÍTICA: Trojan.SH4D0W</b><br>El antivirus no puede eliminar la amenaza. Acceso denegado por el administrador.</div></div><div class="barfake"><i></i></div>`, btns:[["INTENTAR LIMPIAR",""],["IGNORAR","prime"]]}),
  () => ({title:"SH4D0W", body:`<div class="big">TE LO ADVERTÍ</div>Cada vez que fallas una clave, me llevo un trozo más de tu tiempo. Sigue probándolo... me divierte.`, btns:[["CALLAR","prime"]]}),
  () => ({title:"webcam_0.exe", body:`<div class="av"><div class="sh">●</div><div>Cámara <b style="color:#ff8080">ACTIVADA</b> por un proceso remoto.<br>Sonríe. Te estoy viendo.</div></div>`, btns:[["BLOQUEAR",""],["CERRAR","prime"]]}),
  () => ({title:"error crítico", body:`<b style="color:#ff8080">explorer.exe</b> ha dejado de responder.<br>Un proceso con privilegios root está modificando el sistema.`, btns:[["ACEPTAR","prime"]]}),
  () => ({title:"recordatorio", body:`<div class="big">3 CÓDIGOS. UNA HERRAMIENTA.</div>Resuelve las pruebas de tu aula y mete los códigos en <b style="color:#fff">DESCIFRADOR.exe</b>. O despídete de tus archivos.`, btns:[["ABRIR DESCIFRADOR","prime"],["LUEGO",""]]}),
  () => ({title:"SH4D0W", body:`<div class="big">CONTRASEÑAS EN POST-ITS</div>En serio. Encontré una pegada en el monitor. Por eso estoy aquí dentro. Por eso voy ganando.`, btns:[["CERRAR","prime"]]})
];
let popupTimer=null;
function startPopups(){
  if(!state.popupsOn || state.ended) return;
  scheduleNextPopup(2200);
}
function scheduleNextPopup(delay){
  clearTimeout(popupTimer);
  popupTimer = setTimeout(()=>{
    if(state.ended || !state.popupsOn){ return; }
    if($$(".popup").length < 4) spawnPopup();
    const n = Object.values(state.unlocked).filter(Boolean).length;
    const base = 5200 + n*1800;
    scheduleNextPopup(base + Math.random()*3500);
  }, delay);
}
function spawnPopup(){
  const tpl = popupTemplates[Math.floor(Math.random()*popupTemplates.length)]();
  const w = 330, pad=60;
  const x = pad + Math.random()*(window.innerWidth - w - pad*2);
  const y = 70 + Math.random()*(window.innerHeight - 280);
  const btns = tpl.btns.map(b=>`<button class="${b[1]}">${b[0]}</button>`).join("");
  const el = document.createElement("div");
  el.className="popup"; el.style.left=x+"px"; el.style.top=y+"px"; el.style.zIndex=++zTop;
  el.innerHTML = `<div class="pbar"><span class="pt">${tpl.title}</span><span class="px">✕</span></div>
    <div class="pbody">${tpl.body}<div class="pbtns">${btns}</div></div>`;
  $("#desktop").appendChild(el);
  sndPopup();
  const close = ()=>{ el.remove(); glitch(); sndGlitch(); };
  el.querySelector(".px").addEventListener("click", close);
  el.querySelectorAll(".pbtns button").forEach(b=>b.addEventListener("click", ()=>{
    const t = b.textContent; close();
    if(/DESCIFRADOR/i.test(t)) openDecryptor();
  }));
  makeDraggable(el, el.querySelector(".pbar"));
}
function clearAllPopups(){ $$(".popup").forEach(p=>p.remove()); }

/* =================================================================
   CLIMAX
   ================================================================= */
function checkClimax(){ if(allDone() && !state.ended) setTimeout(()=>triggerClimax(false), 700); }
function triggerClimax(instant){
  state.ended = true; state.popupsOn=false; clearTimeout(popupTimer);
  if(!instant){
    const pops = $$(".popup");
    pops.forEach((p,i)=>setTimeout(()=>{ p.style.transition="opacity .25s, transform .25s"; p.style.opacity="0"; p.style.transform="scale(.85)"; setTimeout(()=>p.remove(),250); }, i*120));
    sndClimax();
  } else { clearAllPopups(); }
  $$(".win").forEach(w=>{ if(!w.querySelector(".viewer")) w.remove(); });
  const delay = instant?100: (pops_count()*120 + 1400);
  setTimeout(()=>{
    if(rainRAF) cancelAnimationFrame(rainRAF);
    const bo = $("#blackout"); bo.classList.add("show");
    setTimeout(typeAttackerNote, 1300);
  }, delay);
}
function pops_count(){ return $$(".popup").length; }

function typeAttackerNote(){
  const center = $("#blackout-center");
  center.innerHTML = `<div class="cmask" aria-hidden="true"><div class="layer base"></div><div class="scan"></div></div>
    <div class="win attacker-win" style="position:static">
    <div class="win-bar"><span class="wt">root@victima:~ — README_DEL_ATACANTE.txt</span></div>
    <div class="term" id="atk-term"></div>
  </div>`;
  const term = $("#atk-term");
  const lines = [
    {c:"gl", t:"$ cat README_DEL_ATACANTE.txt\n"},
    {c:"rd", t:"[!] este archivo no debería estar aquí\n\n"},
    {c:"am", t:"# deploy_shadow.sh — registro del operador\n"},
    {c:"am", t:"# TODO: BORRAR ESTE ARCHIVO ANTES DE SALIR\n\n"},
    {c:"", t:"Acceso al panel de control del ataque:\n\n"},
    {c:"rd", t:"=== CREDENCIALES SSH (equipo del atacante) ===\n"},
    {c:"CRED", t:""},
    {c:"gl", t:"\n$ ssh "+SSH_CONFIG.user+"@"+SSH_CONFIG.ip+"\n\n"},
    {c:"", t:"El atacante olvidó eliminar este registro.\n"},
    {c:"", t:"Contiene las credenciales de su propio servidor.\n"},
    {c:"am", t:"Úsalas para acceder a su equipo. (Fase 3)\n"},
    {c:"rd", t:"                                  — SH4D0W\n"},
    {c:"CUR", t:""}
  ];
  let li=0, ci=0;
  function step(){
    if(li>=lines.length) return;
    const ln = lines[li];
    if(ln.c==="CRED"){
      const div=document.createElement("div"); div.className="cred";
      div.innerHTML = `<div><span class="lbl">Usuario SSH :</span> ${SSH_CONFIG.user}</div>
        <div><span class="lbl">Dirección IP:</span> ${SSH_CONFIG.ip}</div>
        <div><span class="lbl">Contraseña  :</span> ${SSH_CONFIG.pass}</div>`;
      term.appendChild(div); li++; setTimeout(step,400); return;
    }
    if(ln.c==="CUR"){ const cur=document.createElement("span"); cur.className="cur"; term.appendChild(cur); return; }
    if(ci===0){ const sp=document.createElement("span"); if(ln.c) sp.className=ln.c; sp.dataset.l=li; term.appendChild(sp); }
    const sp=term.querySelector('span[data-l="'+li+'"]');
    if(ci<ln.t.length){ sp.textContent+=ln.t[ci]; ci++; if(ln.t[ci-1]!==" "&&Math.random()<0.3) tone(600,.02,"square",.02); setTimeout(step, ln.t==="\n"?20:(10+Math.random()*30)); }
    else { li++; ci=0; setTimeout(step, 120); }
  }
  step();
  $("#attacker-icon").classList.add("show");
}

/* =================================================================
   WIRING
   ================================================================= */
function wire(){
  ["file-1","file-2","file-3"].forEach(id=>{
    $("#"+id).addEventListener("click", ()=>{ audioInit(); if(state.unlocked[id]) openContent(id); else lockedNotice(id); });
  });
  $("#decryptor-icon").addEventListener("click", ()=>{ audioInit(); openDecryptor(); });
  $("#readme").addEventListener("click", ()=>{ audioInit(); openReadme(); });
  $("#attacker-icon").addEventListener("click", ()=>{
    const html = `<div class="win-bar"><span class="wt">README_DEL_ATACANTE.txt</span><span class="wx">✕</span></div>
      <div class="term viewer" id="atk-term-2"></div>`;
    const w = spawnWindow(html, "attacker-win", window.innerWidth/2-280, 70);
    const term = w.querySelector("#atk-term-2");
    term.innerHTML = `<span class="gl">$ cat README_DEL_ATACANTE.txt</span>
<span class="rd">[!] este archivo no debería estar aquí</span>

<span class="am"># deploy_shadow.sh — registro del operador
# TODO: BORRAR ESTE ARCHIVO ANTES DE SALIR</span>

Acceso al panel de control del ataque:

<span class="rd">=== CREDENCIALES SSH (equipo del atacante) ===</span>
<div class="cred"><div><span class="lbl">Usuario SSH :</span> ${SSH_CONFIG.user}</div><div><span class="lbl">Dirección IP:</span> ${SSH_CONFIG.ip}</div><div><span class="lbl">Contraseña  :</span> ${SSH_CONFIG.pass}</div></div>
<span class="gl">$ ssh ${SSH_CONFIG.user}@${SSH_CONFIG.ip}</span>

El atacante olvidó eliminar este registro.
<span class="am">Úsalas para acceder a su equipo. (Fase 3)</span>
<span class="rd">                                  — SH4D0W</span>`;
  });

  // start menu
  $("#startbtn").addEventListener("click", e=>{ e.stopPropagation(); $("#startmenu").classList.toggle("open"); });
  document.addEventListener("click", ()=>$("#startmenu").classList.remove("open"));
  $("#startmenu").addEventListener("click", e=>e.stopPropagation());
  $("#sm-decrypt").addEventListener("click", ()=>{ openDecryptor(); $("#startmenu").classList.remove("open"); });
  $("#sm-readme").addEventListener("click", ()=>{ openReadme(); $("#startmenu").classList.remove("open"); });
  $("#sm-help").addEventListener("click", ()=>{ openReadme(); $("#startmenu").classList.remove("open"); });
  $("#sm-mute").addEventListener("click", ()=>{ state.muted=!state.muted; $("#mute-state").textContent=state.muted?"OFF":"ON"; saveState(); $("#startmenu").classList.remove("open"); });
  $("#sm-reset").addEventListener("click", resetEscape);

  // intro
  $("#enter-btn").addEventListener("click", closeIntro);
  $("#skip-intro").addEventListener("click", skipIntro);

  // keys
  document.addEventListener("keydown", e=>{
    if(e.key==="Escape" && !$("#intro").classList.contains("hidden")) skipIntro();
    if(e.key==="F1"){ e.preventDefault(); openReadme(); }
    if(e.ctrlKey && e.altKey && (e.key==="r"||e.key==="R")){ e.preventDefault(); resetEscape(); }
  });
}
function skipIntro(){ state._introSkipped=true; closeIntro(); }

function resetEscape(){
  if(!confirm("¿Reiniciar el escape room? Se bloquearán de nuevo los 3 archivos (solo para organizadores).")) return;
  localStorage.removeItem(STORE_KEY);
  location.reload();
}

/* =================================================================
   BOOT
   ================================================================= */
function applyLoadedState(){
  ["file-1","file-2","file-3"].forEach(id=>{ if(state.unlocked[id]) markUnlocked(id); });
  updateProgress();
  $("#mute-state").textContent = state.muted?"OFF":"ON";
  if(allDone()){ state.ended=true; $("#attacker-icon").classList.add("show"); }
}
function boot(){
  loadState();
  initRain();
  tickClock(); setInterval(tickClock, 1000);
  setInterval(tickTimer, 1000);
  applyLoadedState();
  wire();
  runIntro();
}
boot();
