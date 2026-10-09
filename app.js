const screens=[...document.querySelectorAll('.screen')];
function show(name){
  screens.forEach(s=>s.classList.toggle('is-active',s.dataset.screen===name));
  location.hash=name;
  window.scrollTo(0,0);
  if(name==='kit'&&kitViewer) requestAnimationFrame(()=>kitViewer.resize());
  if(name==='player'&&playerViewer) requestAnimationFrame(()=>playerViewer.resize());
}
document.querySelectorAll('[data-nav]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.nav)));

let activeKit='home',activeView='front';
const kits={
  home:{pattern:'stripes',primary:'#17354e',secondary:'#f3f4f4',accent:'#d6b054'},
  away:{pattern:'plain',primary:'#d6b054',secondary:'#17354e',accent:'#f3f4f4'}
};
const inputs={primary:document.getElementById('colour-primary'),secondary:document.getElementById('colour-secondary'),accent:document.getElementById('colour-accent')};
const chips={primary:document.getElementById('primary-chip'),secondary:document.getElementById('secondary-chip'),accent:document.getElementById('accent-chip')};

function buildTextureCanvas(cfg,size=1024){
  const c=document.createElement('canvas');c.width=c.height=size;const x=c.getContext('2d');
  const p=cfg.primary,s=cfg.secondary,a=cfg.accent;
  x.fillStyle=p;x.fillRect(0,0,size,size);
  if(cfg.pattern==='plain'){
    // plain body with a restrained accent band so all three chosen colours remain visible
    x.fillStyle=s;x.fillRect(0,0,size,size*.10);x.fillStyle=a;x.fillRect(0,size*.10,size,size*.025);
  }
  if(cfg.pattern==='stripes'){
    const stripe=size/7;
    for(let i=0;i<8;i++){x.fillStyle=i%2?s:p;x.fillRect(i*stripe,0,stripe+2,size);}
    x.fillStyle=a;for(let i=1;i<8;i++)x.fillRect(i*stripe-3,0,6,size);
  }
  if(cfg.pattern==='hoops'){
    const band=size/8;
    for(let i=0;i<8;i++){x.fillStyle=i%2?s:p;x.fillRect(0,i*band,size,band+2);}
    x.fillStyle=a;for(let i=1;i<8;i+=2)x.fillRect(0,i*band-3,size,6);
  }
  if(cfg.pattern==='halves'){
    x.fillStyle=p;x.fillRect(0,0,size/2,size);x.fillStyle=s;x.fillRect(size/2,0,size/2,size);x.fillStyle=a;x.fillRect(size/2-5,0,10,size);
  }
  if(cfg.pattern==='sash'){
    x.fillStyle=s;x.fillRect(0,0,size,size);x.save();x.translate(size*.5,size*.5);x.rotate(-Math.PI/5.4);x.fillStyle=a;x.fillRect(-size*.15,-size,size*.30,size*2);x.fillStyle=p;x.fillRect(-size*.115,-size,size*.23,size*2);x.restore();
  }
  // subtle fabric weave that remains visible under studio lighting
  x.globalAlpha=.07;
  x.strokeStyle='#ffffff';
  for(let y=0;y<size;y+=6){x.beginPath();x.moveTo(0,y);x.lineTo(size,y+2);x.stroke();}
  x.strokeStyle='#000000';x.globalAlpha=.035;
  for(let x0=0;x0<size;x0+=8){x.beginPath();x.moveTo(x0,0);x.lineTo(x0+3,size);x.stroke();}
  x.globalAlpha=1;
  return c;
}

class JerseyViewer{
  constructor(host,{player=false}={}){
    this.host=host;this.player=player;this.ready=false;this.drag=false;this.lastX=0;this.rotationY=0;this.cameraZ=player?4.25:4.5;
    if(!host||!window.THREE)return;
    const T=window.THREE;
    this.renderer=new T.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
    this.renderer.outputColorSpace=T.SRGBColorSpace;
    this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.12;
    this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=T.PCFSoftShadowMap;
    host.appendChild(this.renderer.domElement);
    this.scene=new T.Scene();
    this.camera=new T.PerspectiveCamera(player?28:31,1,.1,100);this.camera.position.set(0,.08,this.cameraZ);
    this.group=new T.Group();this.scene.add(this.group);
    this.texture=new T.CanvasTexture(buildTextureCanvas(kits.home));this.texture.colorSpace=T.SRGBColorSpace;this.texture.wrapS=this.texture.wrapT=T.RepeatWrapping;this.texture.anisotropy=8;
    this.material=new T.MeshPhysicalMaterial({map:this.texture,roughness:.68,metalness:.02,clearcoat:.08,clearcoatRoughness:.72,side:T.DoubleSide});
    this.darkMat=new T.MeshStandardMaterial({color:0x08131b,roughness:.82,metalness:.03});
    this.buildJersey();
    this.addLights();this.bind();this.resize();this.ready=true;this.animate();
  }
  addLights(){
    const T=window.THREE;
    this.scene.add(new T.HemisphereLight(0xbfe8ff,0x061018,1.35));
    const key=new T.DirectionalLight(0xffe0a3,3.25);key.position.set(3.2,4.6,5.4);key.castShadow=true;this.scene.add(key);
    const fill=new T.DirectionalLight(0x9fd8ff,1.85);fill.position.set(-4,2.2,4.1);this.scene.add(fill);
    const rim=new T.DirectionalLight(0x7fc8ff,2.3);rim.position.set(0,3.2,-5);this.scene.add(rim);
    const low=new T.PointLight(0xffffff,.65,12);low.position.set(0,-2.2,3);this.scene.add(low);
  }
  buildJersey(){
    const T=window.THREE;
    // torso: athletic football cut, gently tapered waist, slightly wider hem
    const rings=28,segs=56,pos=[],uv=[],idx=[];
    for(let r=0;r<=rings;r++){
      const t=r/rings;const y=1.12-t*2.38;
      let rx,rz;
      if(t<.20){const q=t/.20;rx=T.MathUtils.lerp(.55,.79,Math.sin(q*Math.PI/2));rz=T.MathUtils.lerp(.31,.43,Math.sin(q*Math.PI/2));}
      else if(t<.65){const q=(t-.20)/.45;rx=T.MathUtils.lerp(.79,.66,q);rz=T.MathUtils.lerp(.43,.36,q);}
      else{const q=(t-.65)/.35;rx=T.MathUtils.lerp(.66,.72,q);rz=T.MathUtils.lerp(.36,.39,q);}
      for(let s=0;s<=segs;s++){
        const th=s/segs*Math.PI*2;const cs=Math.cos(th),sn=Math.sin(th);
        let x=cs*rx,z=sn*rz;
        if(sn>0&&t>.14&&t<.58)z+=.045*Math.sin((t-.14)/.44*Math.PI)*Math.pow(sn,1.4);
        pos.push(x,y,z);uv.push(s/segs,1-t);
      }
    }
    for(let r=0;r<rings;r++)for(let s=0;s<segs;s++){const a=r*(segs+1)+s,b=a+1,c=(r+1)*(segs+1)+s,d=c+1;idx.push(a,c,b,b,c,d);}
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
    const torso=new T.Mesh(g,this.material);torso.castShadow=torso.receiveShadow=true;this.group.add(torso);
    // short football sleeves, tapered and slightly down/out from shoulder
    [-1,1].forEach(side=>{
      const sg=new T.CylinderGeometry(.23,.31,.82,32,8,true);const sm=new T.Mesh(sg,this.material);sm.castShadow=sm.receiveShadow=true;
      sm.position.set(side*.82,.78,0);sm.rotation.z=side*.92;sm.rotation.x=-.08;this.group.add(sm);
      const cuff=new T.Mesh(new T.CylinderGeometry(.235,.235,.055,32,1,true),this.material);cuff.position.set(side*1.13,.54,0);cuff.rotation.z=side*.92;this.group.add(cuff);
    });
    // clean fixed crew collar / inner neck, not configurable in this proof
    const collar=new T.Mesh(new T.TorusGeometry(.33,.055,14,52),this.darkMat);collar.rotation.x=Math.PI/2;collar.scale.set(1,.82,1);collar.position.y=1.08;this.group.add(collar);
    // lower inner shadow gives more garment depth
    this.group.rotation.x=-.03;
  }
  update(cfg){
    if(!this.texture)return;const c=buildTextureCanvas(cfg);this.texture.image=c;this.texture.needsUpdate=true;
  }
  setView(view){
    const target=view==='front'?0:view==='side'?-Math.PI/2:Math.PI;this.rotationY=target;
  }
  resize(){
    if(!this.renderer)return;const r=this.host.getBoundingClientRect();if(r.width<2||r.height<2)return;this.renderer.setSize(r.width,r.height,false);this.camera.aspect=r.width/r.height;this.camera.updateProjectionMatrix();
  }
  bind(){
    const el=this.renderer.domElement;
    el.addEventListener('pointerdown',e=>{this.drag=true;this.lastX=e.clientX;el.setPointerCapture?.(e.pointerId)});
    el.addEventListener('pointermove',e=>{if(!this.drag)return;const dx=e.clientX-this.lastX;this.lastX=e.clientX;this.rotationY+=dx*.012});
    el.addEventListener('pointerup',()=>this.drag=false);el.addEventListener('pointercancel',()=>this.drag=false);
    el.addEventListener('wheel',e=>{e.preventDefault();this.cameraZ=Math.max(3.45,Math.min(5.7,this.cameraZ+e.deltaY*.0026));this.camera.position.z=this.cameraZ},{passive:false});
    window.addEventListener('resize',()=>this.resize());
  }
  animate(){
    if(!this.renderer)return;requestAnimationFrame(()=>this.animate());
    this.group.rotation.y+=(this.rotationY-this.group.rotation.y)*.12;
    this.renderer.render(this.scene,this.camera);
  }
}

let kitViewer=null,playerViewer=null;
const kitHost=document.getElementById('kit-3d'),playerHost=document.getElementById('player-kit-3d'),fallback=document.getElementById('kit-fallback');
if(window.THREE){
  kitViewer=new JerseyViewer(kitHost);playerViewer=new JerseyViewer(playerHost,{player:true});fallback.style.display='none';
}else{
  kitHost.classList.add('is-fallback');fallback.style.display='block';
}
function updateKit(){
  const cfg=kits[activeKit];
  kitViewer?.update(cfg);kitViewer?.setView(activeView);playerViewer?.update(kits.home);playerViewer?.setView('front');
  document.querySelectorAll('[data-kit]').forEach(b=>b.classList.toggle('active',b.dataset.kit===activeKit));
  document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===activeView));
  if(!kitViewer){fallback.src=`kit-${activeKit}-${activeView}.png`;}
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
  const cfg=kits[activeKit];Object.keys(inputs).forEach(k=>{inputs[k].value=cfg[k];chips[k].textContent=cfg[k].toUpperCase()});
  document.querySelectorAll('[data-pattern]').forEach(b=>b.classList.toggle('selected',b.dataset.pattern===cfg.pattern));updatePatternPreviews();updateKit();
}
document.querySelectorAll('[data-kit]').forEach(b=>b.addEventListener('click',()=>{activeKit=b.dataset.kit;activeView='front';syncControls()}));
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{activeView=b.dataset.view;updateKit()}));
document.querySelectorAll('[data-view-dir]').forEach(b=>b.addEventListener('click',()=>{const order=['front','side','back'];activeView=order[(order.indexOf(activeView)+Number(b.dataset.viewDir)+order.length)%order.length];updateKit()}));
document.querySelectorAll('[data-pattern]').forEach(b=>b.addEventListener('click',()=>{kits[activeKit].pattern=b.dataset.pattern;syncControls()}));
Object.entries(inputs).forEach(([k,input])=>input.addEventListener('input',()=>{kits[activeKit][k]=input.value;syncControls()}));
document.querySelectorAll('[data-preset]').forEach(b=>b.addEventListener('click',()=>{
  const map={classic:{pattern:'stripes',primary:'#17354e',secondary:'#f3f4f4',accent:'#d6b054'},hoops:{pattern:'hoops',primary:'#16843f',secondary:'#f2f2ee',accent:'#111417'},redblack:{pattern:'stripes',primary:'#bb2436',secondary:'#14171b',accent:'#f2f2ee'}};
  Object.assign(kits[activeKit],map[b.dataset.preset]);syncControls();
}));

// Avatar selection remains intentionally simple in this proof; the selected Home kit is the live 3D garment underneath the portrait.
const avatarSets={male:['avatar-male-01.jpg','avatar-male-02.jpg'],female:['avatar-female-01.jpg','avatar-female-02.jpg']};let gender='male',avatarIndex=0;
const main=document.getElementById('player-main'),strip=document.getElementById('avatar-strip');
function renderAvatars(){
  strip.innerHTML='';avatarSets[gender].forEach((src,i)=>{const b=document.createElement('button');b.className='avatar-choice'+(i===avatarIndex?' active':'');b.innerHTML=`<img src="${src}" alt="Avatar option">`;b.onclick=()=>{avatarIndex=i;renderAvatars()};strip.appendChild(b)});
  main.src=avatarSets[gender][avatarIndex];document.querySelectorAll('[data-gender]').forEach(b=>b.classList.toggle('active',b.dataset.gender===gender));
}
document.querySelectorAll('[data-gender]').forEach(b=>b.addEventListener('click',()=>{gender=b.dataset.gender;avatarIndex=0;renderAvatars()}));
document.getElementById('avatar-prev').onclick=()=>{avatarIndex=(avatarIndex-1+avatarSets[gender].length)%avatarSets[gender].length;renderAvatars()};
document.getElementById('avatar-next').onclick=()=>{avatarIndex=(avatarIndex+1)%avatarSets[gender].length;renderAvatars()};

renderAvatars();syncControls();const start=(location.hash||'#home').slice(1);if(['home','kit','player'].includes(start))show(start);
