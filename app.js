const screens=[...document.querySelectorAll('.screen')];
function show(name){screens.forEach(s=>s.classList.toggle('is-active',s.dataset.screen===name));location.hash=name;window.scrollTo(0,0)}
document.querySelectorAll('[data-nav]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.nav)));
const kitImage=document.getElementById('kit-image');let kit='home',view='front';
function updateKit(){kitImage.src=`kit-${kit}-${view}.png`;document.querySelectorAll('[data-kit]').forEach(b=>b.classList.toggle('active',b.dataset.kit===kit));document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));}
document.querySelectorAll('[data-kit]').forEach(b=>b.addEventListener('click',()=>{kit=b.dataset.kit;view='front';updateKit()}));
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{view=b.dataset.view;updateKit()}));
document.querySelectorAll('[data-view-dir]').forEach(b=>b.addEventListener('click',()=>{const order=['front','side','back'];view=order[(order.indexOf(view)+Number(b.dataset.viewDir)+order.length)%order.length];updateKit()}));
const avatarSets={male:['avatar-male-01.jpg','avatar-male-02.jpg'],female:['avatar-female-01.jpg','avatar-female-02.jpg']};let gender='male',avatarIndex=0;
const main=document.getElementById('player-main'),strip=document.getElementById('avatar-strip');
function renderAvatars(){strip.innerHTML='';avatarSets[gender].forEach((src,i)=>{const b=document.createElement('button');b.className='avatar-choice'+(i===avatarIndex?' active':'');b.innerHTML=`<img src="${src}" alt="Avatar option">`;b.onclick=()=>{avatarIndex=i;renderAvatars()};strip.appendChild(b)});main.src=avatarSets[gender][avatarIndex];document.querySelectorAll('[data-gender]').forEach(b=>b.classList.toggle('active',b.dataset.gender===gender));}
document.querySelectorAll('[data-gender]').forEach(b=>b.addEventListener('click',()=>{gender=b.dataset.gender;avatarIndex=0;renderAvatars()}));
document.getElementById('avatar-prev').onclick=()=>{avatarIndex=(avatarIndex-1+avatarSets[gender].length)%avatarSets[gender].length;renderAvatars()};
document.getElementById('avatar-next').onclick=()=>{avatarIndex=(avatarIndex+1)%avatarSets[gender].length;renderAvatars()};
renderAvatars();const start=(location.hash||'#home').slice(1);if(['home','kit','player'].includes(start))show(start);
