const screens=[...document.querySelectorAll('.screen')];
function show(name){
  screens.forEach(s=>s.classList.toggle('is-active',s.dataset.screen===name));
  location.hash=name;
  window.scrollTo(0,0);
}
document.querySelectorAll('[data-nav]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.nav)));

const kits={
  home:{pattern:'stripes',primary:'#17354e',secondary:'#f3f4f4',accent:'#d6b054'},
  away:{pattern:'plain',primary:'#d6b054',secondary:'#17354e',accent:'#f3f4f4'}
};
let activeKit='home';
let activeView='front';

const inputs={
  primary:document.getElementById('colour-primary'),
  secondary:document.getElementById('colour-secondary'),
  accent:document.getElementById('colour-accent')
};
const chips={
  primary:document.getElementById('primary-chip'),
  secondary:document.getElementById('secondary-chip'),
  accent:document.getElementById('accent-chip')
};
const kitRenderer=document.getElementById('kit-renderer');
const playerShirt=document.getElementById('player-shirt');

function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}

function patternDefs(cfg,id){
  const p=esc(cfg.primary),s=esc(cfg.secondary),a=esc(cfg.accent);
  if(cfg.pattern==='plain') return `<linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${p}"/><stop offset=".52" stop-color="${p}"/><stop offset="1" stop-color="${p}"/></linearGradient>`;
  if(cfg.pattern==='stripes') return `<pattern id="${id}" width="64" height="64" patternUnits="userSpaceOnUse"><rect width="32" height="64" fill="${p}"/><rect x="32" width="32" height="64" fill="${s}"/><rect x="29" width="6" height="64" fill="${a}" opacity=".72"/></pattern>`;
  if(cfg.pattern==='hoops') return `<pattern id="${id}" width="64" height="64" patternUnits="userSpaceOnUse"><rect width="64" height="32" fill="${p}"/><rect y="32" width="64" height="32" fill="${s}"/><rect y="29" width="64" height="6" fill="${a}" opacity=".72"/></pattern>`;
  if(cfg.pattern==='halves') return `<linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${p}"/><stop offset=".49" stop-color="${p}"/><stop offset=".49" stop-color="${a}"/><stop offset=".51" stop-color="${a}"/><stop offset=".51" stop-color="${s}"/><stop offset="1" stop-color="${s}"/></linearGradient>`;
  return `<pattern id="${id}" width="360" height="360" patternUnits="userSpaceOnUse"><rect width="360" height="360" fill="${s}"/><polygon points="-40,360 70,360 400,0 290,0" fill="${p}"/><polygon points="58,360 72,360 402,0 388,0" fill="${a}" opacity=".85"/></pattern>`;
}

function shirtSvg(cfg,view='front',compact=false){
  const uid=`p${Math.random().toString(36).slice(2,9)}`;
  const patternId=`pat-${uid}`;
  const size=compact?'320':'520';
  const p=esc(cfg.primary),a=esc(cfg.accent);
  const bodyFront=`M138 104 C158 85 181 73 205 68 L233 56 L287 56 L315 68 C339 73 362 85 382 104 L452 156 L420 238 L365 205 L354 438 Q260 466 166 438 L155 205 L100 238 L68 156 Z`;
  const bodyBack=`M138 104 C158 85 181 73 205 68 L233 56 L287 56 L315 68 C339 73 362 85 382 104 L452 156 L420 238 L365 205 L354 438 Q260 466 166 438 L155 205 L100 238 L68 156 Z`;
  const side=`M212 83 C237 70 266 66 292 74 L333 93 L390 143 L359 224 L320 204 L323 432 Q259 452 197 430 L181 190 L123 218 L94 152 L156 105 Z`;
  const path=view==='side'?side:(view==='back'?bodyBack:bodyFront);
  const neck=view==='back'?`M225 60 Q260 78 295 60 L289 94 Q260 105 231 94 Z`:`M226 60 L260 102 L294 60 Q260 48 226 60 Z`;
  const number=view==='back'?`<text x="260" y="272" text-anchor="middle" fill="rgba(255,255,255,.86)" font-family="Arial, sans-serif" font-size="96" font-weight="800" style="paint-order:stroke;stroke:rgba(0,0,0,.18);stroke-width:3">10</text>`:'';
  return `<svg viewBox="0 0 520 500" width="100%" height="100%" role="img" aria-label="${view} kit preview" preserveAspectRatio="xMidYMid meet">
    <defs>
      ${patternDefs(cfg,patternId)}
      <linearGradient id="shade-${uid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".38"/><stop offset=".18" stop-color="#fff" stop-opacity=".05"/><stop offset=".5" stop-color="#fff" stop-opacity=".16"/><stop offset=".82" stop-color="#000" stop-opacity=".08"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></linearGradient>
      <linearGradient id="vert-${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset=".42" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>
      <filter id="fabric-${uid}" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".78" numOctaves="2" seed="8" result="noise"/><feColorMatrix in="noise" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 .075 0" result="grain"/><feBlend in="SourceGraphic" in2="grain" mode="multiply"/></filter>
      <clipPath id="clip-${uid}"><path d="${path}"/></clipPath>
    </defs>
    <g filter="url(#fabric-${uid})">
      <path d="${path}" fill="url(#${patternId})"/>
      <g clip-path="url(#clip-${uid})">
        <rect x="60" y="40" width="410" height="420" fill="url(#shade-${uid})"/>
        <rect x="60" y="40" width="410" height="420" fill="url(#vert-${uid})"/>
        <path d="M162 206 Q260 245 358 206" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="8"/>
        <path d="M178 302 Q260 332 342 302" fill="none" stroke="#000" stroke-opacity=".07" stroke-width="7"/>
        <path d="M206 86 Q225 190 218 420" fill="none" stroke="#fff" stroke-opacity=".055" stroke-width="5"/>
        <path d="M314 86 Q295 190 302 420" fill="none" stroke="#000" stroke-opacity=".07" stroke-width="5"/>
      </g>
      <path d="${path}" fill="none" stroke="#07151f" stroke-opacity=".72" stroke-width="5"/>
      <path d="${neck}" fill="#07151f" stroke="${a}" stroke-width="7" stroke-linejoin="round"/>
      <path d="M81 157 L108 225" stroke="${a}" stroke-width="11" stroke-linecap="round" opacity=".88"/>
      <path d="M439 157 L412 225" stroke="${a}" stroke-width="11" stroke-linecap="round" opacity=".88"/>
      ${number}
    </g>
  </svg>`;
}

function renderKit(){
  kitRenderer.innerHTML=shirtSvg(kits[activeKit],activeView,false);
  playerShirt.innerHTML=shirtSvg(kits.home,'front',true);
  document.querySelectorAll('[data-kit]').forEach(b=>b.classList.toggle('active',b.dataset.kit===activeKit));
  document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===activeView));
}

function updatePatternPreviews(){
  const cfg=kits[activeKit],p=cfg.primary,s=cfg.secondary,a=cfg.accent;
  document.querySelectorAll('[data-pattern]').forEach(btn=>{
    const el=btn.querySelector('.pat');if(!el)return;const k=btn.dataset.pattern;let bg=p;
    if(k==='stripes')bg=`repeating-linear-gradient(90deg,${p} 0 9px,${s} 9px 18px,${a} 18px 20px)`;
    if(k==='hoops')bg=`repeating-linear-gradient(0deg,${p} 0 9px,${s} 9px 18px,${a} 18px 20px)`;
    if(k==='halves')bg=`linear-gradient(90deg,${p} 0 49%,${a} 49% 51%,${s} 51%)`;
    if(k==='sash')bg=`linear-gradient(135deg,${s} 0 36%,${a} 36% 39%,${p} 39% 60%,${a} 60% 63%,${s} 63%)`;
    el.style.background=bg;
  });
}

function syncControls(){
  const cfg=kits[activeKit];
  Object.keys(inputs).forEach(k=>{inputs[k].value=cfg[k];chips[k].textContent=cfg[k].toUpperCase();});
  document.querySelectorAll('[data-pattern]').forEach(b=>b.classList.toggle('selected',b.dataset.pattern===cfg.pattern));
  updatePatternPreviews();renderKit();
}

document.querySelectorAll('[data-kit]').forEach(b=>b.addEventListener('click',()=>{activeKit=b.dataset.kit;activeView='front';syncControls();}));
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{activeView=b.dataset.view;renderKit();}));
document.querySelectorAll('[data-view-dir]').forEach(b=>b.addEventListener('click',()=>{
  const views=['front','side','back'];let i=views.indexOf(activeView);i=(i+Number(b.dataset.viewDir)+views.length)%views.length;activeView=views[i];renderKit();
}));
document.querySelectorAll('[data-pattern]').forEach(b=>b.addEventListener('click',()=>{kits[activeKit].pattern=b.dataset.pattern;syncControls();}));
Object.entries(inputs).forEach(([k,input])=>input.addEventListener('input',()=>{kits[activeKit][k]=input.value;syncControls();}));

document.querySelectorAll('[data-preset]').forEach(b=>b.addEventListener('click',()=>{
  if(b.dataset.preset==='classic')Object.assign(kits[activeKit],{pattern:'stripes',primary:'#17354e',secondary:'#f3f4f4',accent:'#d6b054'});
  if(b.dataset.preset==='hoops')Object.assign(kits[activeKit],{pattern:'hoops',primary:'#0b7a3c',secondary:'#f4f4ef',accent:'#101820'});
  if(b.dataset.preset==='redblack')Object.assign(kits[activeKit],{pattern:'stripes',primary:'#b31f2b',secondary:'#121417',accent:'#f2f2ed'});
  syncControls();
}));

const avatarSets={male:['avatar-male-01.jpg','avatar-male-02.jpg'],female:['avatar-female-01.jpg','avatar-female-02.jpg']};
let gender='male',avatarIndex=0;
const playerMain=document.getElementById('player-main'),strip=document.getElementById('avatar-strip');
function renderAvatars(){
  const set=avatarSets[gender];avatarIndex=Math.max(0,Math.min(avatarIndex,set.length-1));playerMain.src=set[avatarIndex];
  strip.innerHTML=set.map((src,i)=>`<button class="avatar-choice ${i===avatarIndex?'active':''}" data-avatar="${i}"><img src="${src}" alt="Avatar ${i+1}"></button>`).join('');
  strip.querySelectorAll('[data-avatar]').forEach(b=>b.addEventListener('click',()=>{avatarIndex=Number(b.dataset.avatar);renderAvatars();}));
  renderKit();
}
document.querySelectorAll('[data-gender]').forEach(b=>b.addEventListener('click',()=>{gender=b.dataset.gender;avatarIndex=0;document.querySelectorAll('[data-gender]').forEach(x=>x.classList.toggle('active',x===b));renderAvatars();}));
document.getElementById('avatar-prev').addEventListener('click',()=>{const set=avatarSets[gender];avatarIndex=(avatarIndex-1+set.length)%set.length;renderAvatars();});
document.getElementById('avatar-next').addEventListener('click',()=>{const set=avatarSets[gender];avatarIndex=(avatarIndex+1)%set.length;renderAvatars();});

syncControls();renderAvatars();
const initial=location.hash.replace('#','');if(['home','kit','player'].includes(initial))show(initial);

// QA shortcut: ?preset=hoops#kit
const params=new URLSearchParams(location.search);
if(params.get('preset')==='hoops'){Object.assign(kits.home,{pattern:'hoops',primary:'#0b7a3c',secondary:'#f4f4ef',accent:'#101820'});activeKit='home';activeView='front';syncControls();show('kit');}
