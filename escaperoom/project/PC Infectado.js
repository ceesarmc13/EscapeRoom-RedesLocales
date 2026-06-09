"use strict";
/* =================================================================
   CONFIGURACIÓN — EDITAR AQUÍ ANTES DE PRODUCCIÓN
   ================================================================= */
const SSH_CONFIG = {
  user: "antonito67",
  ip:   "192.168.7.227",
  pass: "Sh4dowloly"
};
const CODES = {
  "file-1": "B1N4RY",
  "file-2": "05UNABEIB1",
  "file-3": "FR4GM3NTAT1ON",
  "file-4": "C0NN3CT3D"
};
const STORE_KEY = "escape_pc_infectado_v2";

/* =================================================================
   ESTADO
   ================================================================= */
const state = {
  unlocked: { "file-1": false, "file-2": false, "file-3": false, "file-4": false },
  codes:    { "file-1": false, "file-2": false, "file-3": false, "file-4": false },
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
  const seq=[880,740,620,520,440,370,300];
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
  const glyphs = "01<>[]{}#%&$@B1N4RY05UNAB31BFR4GM3NTAT10NC0NN3CT3D";
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
  ["wh","Me llaman "],["gl","SH4D0W"],["wh",". He entrado en la\nred de vuestra aula y me lo he llevado todo:\nvuestras transferencias bancarias, vuestras fotos,\nvuestros archivos y presentaciones. Ahora está\ncifrado. Es "],["gl","mío"],["wh",".\n\n"],
  ["wh","No quiero vuestro dinero. Quiero saber si\nsois tan buenos como creéis.\n\n"],
  ["wh","Partí la clave maestra en "],["am","CUATRO"],["wh"," pedazos y\nescondí cada uno en un desafío, repartidos\npor vuestra aula:\n\n"],
  ["am","  [1] "],["gl","PRUEBA 1"],["wh","   →  transferencias_banco.xlsx\n"],
  ["am","  [2] "],["gl","PRUEBA 2"],["wh","   →  fotos_familia\n"],
  ["am","  [3] "],["gl","PRUEBA 3"],["wh","   →  psswrds.txt\n"],
  ["am","  [4] "],["gl","PRUEBA 4"],["wh","   →  presentación biología.pptx\n\n"],
  ["wh","Resolvedlos, conseguid los cuatro códigos y\nmetedlos en mi herramienta "],["gl","DESCIFRADOR.exe"],["wh",".\nLos cuatro. Si acertáis, os devuelvo lo vuestro.\n\n"],
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
   DECRYPT WINDOW (DESCIFRADOR.exe)
   ================================================================= */
function extLabel(ext){ return {xls:"XLS",folder:"📁",txt:"TXT",pptx:"PPTX"}[ext]||"BIN"; }
function extColor(ext){ return {xls:"#4ad66d",folder:"#c8a000",txt:"#bdbdbd",pptx:"#ff7b27"}[ext]||"#bbb"; }

const FILES = [
  {id:"file-1", name:"transferencias_banco.xlsx", ext:"xls",    code:CODES["file-1"], prueba:"Prueba 1", placeholder:"XXXXXX"},
  {id:"file-2", name:"fotos_familia",             ext:"folder", code:CODES["file-2"], prueba:"Prueba 2", placeholder:"XXXXXXXXXX"},
  {id:"file-3", name:"psswrds.txt",               ext:"txt",    code:CODES["file-3"], prueba:"Prueba 3", placeholder:"XXXXXXXXXXXXX"},
  {id:"file-4", name:"presentación biología.pptx",ext:"pptx",  code:CODES["file-4"], prueba:"Prueba 4", placeholder:"XXXXXXXXX"}
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
        <p>Introduce las <b>4 claves</b> que obtengas al superar las pruebas de la sala. Esta herramienta solo valida las claves: <b>los archivos no se descifran hasta introducir las cuatro correctamente.</b></p>
      </div>
      <div class="slots">${slots}</div>
      <div class="dec-foot">
        <div class="dec-prog">CLAVES VÁLIDAS: <span class="dec-pills"><span class="dp"></span><span class="dp"></span><span class="dp"></span><span class="dp"></span></span> <span class="dec-count">0 / 4</span></div>
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
  w.querySelector(".dec-count").textContent = n+" / 4";
  w.querySelectorAll(".dp").forEach((d,i)=>{
    d.style.background = i<n ? "var(--green)" : "#330808";
    d.style.borderColor = i<n ? "var(--green)" : "#5a1010";
    if(i<n) d.style.boxShadow="0 0 8px rgba(0,255,65,.6)";
  });
  const cta = w.querySelector(".dec-cta");
  if(n===4){ cta.classList.add("ready"); cta.disabled=false; }
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
    const idx = Math.min(3, Math.floor(p/25));
    while(done<=idx && done<4){
      const f = FILES[done];
      logEl.textContent += "[OK] "+f.name+" — DESCIFRADO\n";
      state.unlocked[f.id]=true; markUnlocked(f.id); sndCorrect();
      done++;
    }
    if(p>=100){ p=100; clearInterval(iv); FILES.forEach(f=>state.unlocked[f.id]=true); saveState();
      logEl.textContent += "\n[!] Todos los archivos han sido restaurados.\n[!] Hacker expulsado del sistema.";
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
      <div style="font-size:12px;color:#c0a8a8;line-height:1.6">No puedes abrir este archivo todavía. Abre la herramienta <b style="color:#fff">DESCIFRADOR.exe</b> del escritorio e introduce las <b style="color:#fff">4 claves</b> que consigas en las pruebas para recuperar todos los archivos a la vez.</div>
      <button class="lgo" style="margin-top:15px;background:var(--red);border:1px solid #ff6060;color:#fff;padding:10px 18px;cursor:pointer;font-weight:bold;letter-spacing:.08em;font-family:var(--mono)">ABRIR DESCIFRADOR</button>
    </div></div>`;
  const w = spawnWindow(html, "", null, null);
  w.querySelector(".lgo").addEventListener("click", ()=>{ w.remove(); openDecryptor(); });
}

function markUnlocked(iconId){
  const icon = $("#"+iconId); if(!icon) return;
  icon.classList.add("unlocked");
  const lockEl = icon.querySelector(".lock");
  if(lockEl) lockEl.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="#003d12" stroke-width="2.6"><path d="M6 12l4 4 8-8"/></svg>';
  updateProgress();
}
function updateProgress(){
  const n = Object.values(state.unlocked).filter(Boolean).length;
  $("#progress-txt").textContent = n+" / 4 DESCIFRADAS";
  ["file-1","file-2","file-3","file-4"].forEach((id,i)=>{
    const pill=$('.pill[data-p="'+(i+1)+'"]'); if(pill) pill.classList.toggle("on", state.unlocked[id]);
  });
}

/* =================================================================
   FILE CONTENT VIEWERS
   ================================================================= */
function openContent(iconId){
  if(iconId==="file-1") openBankXLS();
  else if(iconId==="file-2") openFolderFotos();
  else if(iconId==="file-3") openPswrds();
  else if(iconId==="file-4") openPPTX();
}

function openBankXLS(){
  const rows = [
    {d:"01/03/2024", t:"Transferencia saliente", dest:"ES76 2100 0418 68 0200051332", concept:"Nómina febrero",    amt:"-1.250,00", sus:false},
    {d:"05/03/2024", t:"Transferencia saliente", dest:"ES91 2100 0418 68 0200051349", concept:"Alquiler marzo",     amt:"-720,00",   sus:false},
    {d:"08/03/2024", t:"Transferencia saliente", dest:"DE89 3704 0044 0532 0130 00",  concept:"—",                  amt:"-4.300,00", sus:true},
    {d:"09/03/2024", t:"Transferencia saliente", dest:"DE89 3704 0044 0532 0130 00",  concept:"—",                  amt:"-4.300,00", sus:true},
    {d:"12/03/2024", t:"Transferencia saliente", dest:"XK05 1212 0123 4567 8906",     concept:"—",                  amt:"-2.750,00", sus:true},
    {d:"14/03/2024", t:"Ingreso",                dest:"ES76 2100 0418 68 0200051332", concept:"Devolución seguro",  amt:"+340,00",   sus:false}
  ];
  const body = rows.map(r=>`<tr${r.sus?' class="suspicious"':''}><td>${r.d}</td><td>${r.t}</td><td>${r.dest}</td><td>${r.concept}</td><td class="num">${r.amt} €</td></tr>`).join("");
  const html = `
    <div class="win-bar"><span class="wt">transferencias_banco.xlsx — Hoja de cálculo</span><span class="wx">✕</span></div>
    <div class="win-body"><div class="xls viewer">
      <div class="xtop"><span>transferencias_banco.xlsx</span><span>Hoja 1 · Marzo 2024</span></div>
      <table>
        <thead><tr><th>Fecha</th><th>Tipo</th><th>Cuenta destino</th><th>Concepto</th><th>Importe</th></tr></thead>
        <tbody>${body}</tbody>
      </table>
    </div></div>`;
  spawnWindow(html, "viewer");
}

function openFolderFotos(){
  const caps = ["IMG_2041.jpg","IMG_2042.jpg","IMG_2055.jpg","IMG_2061.jpg","verano_playa.jpg","cumple_2023.jpg"];
  const cells = caps.map((c,i)=>`<div class="ph"><canvas data-seed="${i*37+11}" width="80" height="60"></canvas><div class="cap">${c}</div></div>`).join("");
  const html = `
    <div class="win-bar"><span class="wt">fotos_familia — Carpeta</span><span class="wx">✕</span></div>
    <div class="win-body"><div class="zip viewer">
      <div class="ztop"><span>fotos_familia — 6 imágenes</span><span>vista previa</span></div>
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

function openPswrds(){
  const html = `
    <div class="win-bar"><span class="wt">psswrds.txt — Bloc de notas</span><span class="wx">✕</span></div>
    <div class="win-body"><div class="txtdoc viewer">192.168.7.227@antonito67
Sh4dowloly</div></div>`;
  spawnWindow(html, "viewer", window.innerWidth/2-200, 120);
}

function openPPTX(){
  const html = `
    <div class="win-bar"><span class="wt">presentación biología.pptx — Visor de presentaciones</span><span class="wx">✕</span></div>
    <div class="win-body"><div class="pptx viewer">
      <div class="pptx-top"><span>presentación biología.pptx</span><span>5 diapositivas · Modo lectura</span></div>

      <div class="slide">
        <div class="s-num">1 / 5</div>
        <div class="s-title" style="font-size:20px;text-align:center;border:none;padding-bottom:4px;margin-top:12px">LA CÉLULA</div>
        <div class="s-body" style="text-align:center;color:#7ec8e3;margin-top:6px">Biología · 2.º Bachillerato</div>
        <div class="s-body" style="text-align:center;color:#506a88;margin-top:4px;font-size:11px">Trabajo del Grupo A · Curso 2023-2024</div>
      </div>

      <div class="slide">
        <div class="s-num">2 / 5</div>
        <div class="s-title">¿Qué es una célula?</div>
        <div class="s-body">
          La célula es la <span class="hl">unidad estructural y funcional</span> básica de todos los seres vivos. Descrita por primera vez por Robert Hooke en 1665.
          <ul>
            <li>Unidad más pequeña con vida propia</li>
            <li>Capacidad de reproducirse y metabolizar</li>
            <li>Responde a estímulos del entorno</li>
            <li>Tamaño medio: 10–100 μm</li>
          </ul>
        </div>
      </div>

      <div class="slide">
        <div class="s-num">3 / 5</div>
        <div class="s-title">Tipos de células</div>
        <div class="s-body">
          <ul>
            <li><span class="hl">PROCARIOTA</span> — Sin núcleo diferenciado. Bacterias y arqueas. Tamaño: 1-10 μm.</li>
            <li><span class="hl">EUCARIOTA</span> — Con núcleo y organelos membranosos. Animales, plantas, hongos. Tamaño: 10-100 μm.</li>
          </ul>
        </div>
      </div>

      <div class="slide">
        <div class="s-num">4 / 5</div>
        <div class="s-title">Organelos celulares</div>
        <div class="s-body">
          <ul>
            <li><span class="hl">Núcleo</span> — contiene el ADN y controla la célula</li>
            <li><span class="hl">Mitocondria</span> — producción de energía (ATP)</li>
            <li><span class="hl">Ribosoma</span> — síntesis de proteínas</li>
            <li><span class="hl">RE rugoso / liso</span> — transporte y síntesis lipídica</li>
            <li><span class="hl">Aparato de Golgi</span> — procesamiento y empaquetado de proteínas</li>
          </ul>
        </div>
      </div>

      <div class="slide">
        <div class="s-num">5 / 5</div>
        <div class="s-title">La Mitosis</div>
        <div class="s-body">
          Proceso de <span class="hl">división celular</span> que produce dos células hijas genéticamente idénticas a la célula madre.
          <ul>
            <li>Profase → condensación de cromosomas</li>
            <li>Metafase → alineación en el ecuador</li>
            <li>Anafase → separación de cromátidas</li>
            <li>Telofase → formación de nuevos núcleos</li>
            <li>Citocinesis → división del citoplasma</li>
          </ul>
        </div>
      </div>
    </div></div>`;
  spawnWindow(html, "viewer", window.innerWidth/2-320, 50);
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
Hojas de cálculo, carpetas, documentos, presentaciones. Bloqueado.

Partí la clave maestra en <b style="color:#fff">4 PEDAZOS</b> y los
escondí en cuatro pruebas, repartidas por tu aula:

  <span class="am">[1]</span> transferencias_banco.xlsx  →  Prueba 1
  <span class="am">[2]</span> fotos_familia               →  Prueba 2
  <span class="am">[3]</span> psswrds.txt                 →  Prueba 3
  <span class="am">[4]</span> presentación biología.pptx  →  Prueba 4

Resuélvelas, consigue los cuatro códigos y mételos
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
  () => ({title:"recordatorio", body:`<div class="big">4 CÓDIGOS. UNA HERRAMIENTA.</div>Resuelve las pruebas de tu aula y mete los códigos en <b style="color:#fff">DESCIFRADOR.exe</b>. O despídete de tus archivos.`, btns:[["ABRIR DESCIFRADOR","prime"],["LUEGO",""]]}),
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
  ["file-1","file-2","file-3","file-4"].forEach(id=>{
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
  if(!confirm("¿Reiniciar el escape room? Se bloquearán de nuevo los 4 archivos (solo para organizadores).")) return;
  localStorage.removeItem(STORE_KEY);
  location.reload();
}

/* =================================================================
   BOOT
   ================================================================= */
function applyLoadedState(){
  ["file-1","file-2","file-3","file-4"].forEach(id=>{ if(state.unlocked[id]) markUnlocked(id); });
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
