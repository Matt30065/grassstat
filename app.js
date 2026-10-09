const screens=[...document.querySelectorAll('.screen')];
const $=s=>document.querySelector(s);
const state={club:'Riverside Athletic',home:{primary:'#0c7a44',secondary:'#f4f3ec'},away:{primary:'#d5b153',secondary:'#10293b'},cardPalette:'home',players:[]};
function show(name){screens.forEach(s=>s.classList.toggle('is-active',s.dataset.screen===name));window.scrollTo(0,0)}
document.addEventListener('click',e=>{const n=e.target.closest('[data-nav]');if(n)show(n.dataset.nav)});
function ink(primary,secondary){return {primary,secondary}}
function updatePaletteCard(kind){const cfg=state[kind],el=$(`#${kind}-palette-art`);el.style.background=`linear-gradient(145deg,${cfg.primary} 0 55%,${cfg.secondary} 55%)`;el.querySelector('strong').textContent=state.club.toUpperCase().split(' ').slice(0,1).join(' ')}
function updateCard(){const cfg=state[state.cardPalette];const card=$('#player-card');card.style.setProperty('--card-primary',cfg.primary);card.style.setProperty('--card-secondary',cfg.secondary);const name=$('#player-name').value.trim()||'PLAYER';const number=($('#player-number').value||'0').replace(/\D/g,'').slice(0,3)||'0';const position=$('#player-position').value.toUpperCase();$('#card-name').textContent=name.toUpperCase();$('#card-number').textContent=number;$('#card-position').textContent=position;$('#card-signature').textContent=name;$('#card-club').textContent=state.club.toUpperCase();}
[['home-primary','home','primary'],['home-secondary','home','secondary'],['away-primary','away','primary'],['away-secondary','away','secondary']].forEach(([id,kind,key])=>{$(`#${id}`).addEventListener('input',e=>{state[kind][key]=e.target.value; $(`#${id}-code`).textContent=e.target.value.toUpperCase(); updatePaletteCard(kind); updateCard()})});
$('#club-name').addEventListener('input',e=>{state.club=e.target.value.trim()||'Riverside Athletic';$('#home-club-name').textContent=state.club;updatePaletteCard('home');updatePaletteCard('away');updateCard()});
['player-name','player-number','player-position'].forEach(id=>$(`#${id}`).addEventListener('input',updateCard));
document.querySelectorAll('[data-card-palette]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-card-palette]').forEach(x=>x.classList.toggle('active',x===b));state.cardPalette=b.dataset.cardPalette;updateCard()}));
function addPlayer(){const name=$('#player-name').value.trim()||'Player';const number=($('#player-number').value||'0').replace(/\D/g,'').slice(0,3)||'0';const position=$('#player-position').value;state.players.push({name,number,position,palette:state.cardPalette});renderPlayers();}
$('#add-player').addEventListener('click',addPlayer);
$('#player-save').addEventListener('click',addPlayer);
function renderPlayers(){const grid=$('#compact-player-grid');grid.innerHTML='';state.players.forEach(p=>{const cfg=state[p.palette];const d=document.createElement('article');d.className='compact-player-card';d.style.setProperty('--cp',cfg.primary);d.style.setProperty('--cs',cfg.secondary);d.innerHTML=`<div class="cp-number">${p.number}</div><div class="cp-copy"><strong>${p.name}</strong><small>${p.position}</small></div><div class="cp-signature">${p.name}</div>`;grid.appendChild(d)});$('#player-count').textContent=`${state.players.length} player${state.players.length===1?'':'s'}`}
updatePaletteCard('home');updatePaletteCard('away');updateCard();
const initial=new URLSearchParams(location.search).get('screen');if(['home','identity','player'].includes(initial))show(initial);
