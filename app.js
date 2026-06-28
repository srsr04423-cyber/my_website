
/* ═══════════════════════════════════════
   1. PARTICLE FIELD BACKGROUND
═══════════════════════════════════════ */
(function(){
  const c = document.getElementById('particles');
  const ctx = c.getContext('2d');
  let W,H,pts=[];
  
  function resize(){
    W=c.width=window.innerWidth;
    H=c.height=window.innerHeight;
  }
  resize();
  window.addEventListener('resize',resize);
  
  for(let i=0;i<120;i++){
    pts.push({
      x:Math.random()*2000,y:Math.random()*2000,
      vx:(Math.random()-.5)*.15,vy:(Math.random()-.5)*.15,
      r:Math.random()*1.5+.3,
      a:Math.random()
    });
  }
  
  let mx=W/2,my=H/2;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});
  
  function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle='rgba(5,5,5,0)';
    ctx.fillRect(0,0,W,H);
    
    pts.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0)p.x=W;if(p.x>W)p.x=0;
      if(p.y<0)p.y=H;if(p.y>H)p.y=0;
      
      // subtle mouse repulsion
      const dx=p.x-mx,dy=p.y-my,d=Math.sqrt(dx*dx+dy*dy);
      if(d<120){const f=.3*(1-d/120);p.vx+=f*dx/d;p.vy+=f*dy/d;}
      // dampen
      p.vx*=.995;p.vy*=.995;
      
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(255,255,255,${p.a*.35})`;
      ctx.fill();
    });
    
    // connections
    for(let i=0;i<pts.length;i++){
      for(let j=i+1;j<pts.length;j++){
        const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<100){
          ctx.beginPath();
          ctx.moveTo(pts[i].x,pts[i].y);
          ctx.lineTo(pts[j].x,pts[j].y);
          ctx.strokeStyle=`rgba(255,255,255,${.06*(1-d/100)})`;
          ctx.lineWidth=.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();
 
/* ═══════════════════════════════════════
   2. LOGO MINI 3D CART (Three.js)
═══════════════════════════════════════ */
(function(){
  const canvas=document.getElementById('logo-canvas');
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.setSize(44,44);renderer.setPixelRatio(2);
  const scene=new THREE.Scene();
  const cam=new THREE.PerspectiveCamera(45,1,0.1,100);
  cam.position.set(0,0,3.5);
  
  // Cart body
  const geo=new THREE.BoxGeometry(1.2,.7,.6);
  const mat=new THREE.MeshStandardMaterial({color:0xffffff,metalness:.8,roughness:.2});
  const cart=new THREE.Mesh(geo,mat);
  scene.add(cart);
  
  // Wheels
  const wgeo=new THREE.CylinderGeometry(.12,.12,.1,16);
  const wmat=new THREE.MeshStandardMaterial({color:0xaaaaaa,metalness:.9,roughness:.1});
  [-0.4,0.4].forEach(x=>{
    const w=new THREE.Mesh(wgeo,wmat);
    w.rotation.z=Math.PI/2;
    w.position.set(x,-0.48,.25);
    scene.add(w);
    const w2=w.clone();w2.position.z=-.25;scene.add(w2);
  });
  
  const al=new THREE.AmbientLight(0xffffff,.4);scene.add(al);
  const dl=new THREE.DirectionalLight(0xffffff,1.2);dl.position.set(2,3,2);scene.add(dl);
  const pl=new THREE.PointLight(0xffffff,.6);pl.position.set(-2,1,2);scene.add(pl);
  
  let t=0;
  function anim(){
    t+=.02;
    cart.rotation.y=Math.sin(t)*.4;
    cart.rotation.x=Math.sin(t*.7)*.1;
    renderer.render(scene,cam);
    requestAnimationFrame(anim);
  }
  anim();
})();
 
/* ═══════════════════════════════════════
   3. HERO 3D FLOATING CART
═══════════════════════════════════════ */
(function(){
  // Replace emoji cart with canvas
  const wrap=document.getElementById('heroCart');
  wrap.innerHTML='';
  wrap.style.cssText='width:120px;height:120px;margin:0 auto 20px;display:block';
  
  const canvas=document.createElement('canvas');
  canvas.width=240;canvas.height=240;
  canvas.style.cssText='width:120px;height:120px';
  wrap.appendChild(canvas);
  
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.setSize(240,240);renderer.setPixelRatio(2);
  const scene=new THREE.Scene();
  const cam=new THREE.PerspectiveCamera(40,1,0.1,100);
  cam.position.set(0,.5,5);
  
  // Cart group
  const g=new THREE.Group();scene.add(g);
  
  // Body
  const bodyGeo=new THREE.BoxGeometry(2,1.2,1);
  const mat=new THREE.MeshStandardMaterial({color:0xffffff,metalness:.7,roughness:.2});
  const body=new THREE.Mesh(bodyGeo,mat);g.add(body);
  
  // Handle
  const hgeo=new THREE.CylinderGeometry(.06,.06,1.6,12);
  const hmesh=new THREE.Mesh(hgeo,mat);
  hmesh.rotation.z=Math.PI/2;hmesh.position.set(0,.8,0);g.add(hmesh);
  
  // Wheel
  const wgeo=new THREE.CylinderGeometry(.22,.22,.15,24);
  const wmat=new THREE.MeshStandardMaterial({color:0x888888,metalness:.9,roughness:.15});
  [-.55,.55].forEach(x=>{
    const w=new THREE.Mesh(wgeo,wmat);w.rotation.z=Math.PI/2;
    w.position.set(x,-.85,.3);g.add(w);
    const w2=w.clone();w2.position.z=-.3;g.add(w2);
  });
  
  // Stars particles around cart
  const starGeo=new THREE.BufferGeometry();
  const starVerts=[];
  for(let i=0;i<60;i++){
    starVerts.push((Math.random()-.5)*6,(Math.random()-.5)*6,(Math.random()-.5)*4);
  }
  starGeo.setAttribute('position',new THREE.Float32BufferAttribute(starVerts,3));
  const starMat=new THREE.PointsMaterial({color:0xffffff,size:.06,transparent:true,opacity:.6});
  const stars=new THREE.Points(starGeo,starMat);scene.add(stars);
  
  const al=new THREE.AmbientLight(0xffffff,.35);scene.add(al);
  const dl=new THREE.DirectionalLight(0xffffff,1.4);dl.position.set(3,4,3);scene.add(dl);
  const pl=new THREE.PointLight(0xffffff,.8,-5,2);pl.position.set(-2,2,2);scene.add(pl);
  const rl=new THREE.PointLight(0xcccccc,.5);rl.position.set(2,-2,-2);scene.add(rl);
  
  let t=0,mx=0,my=0;
  document.addEventListener('mousemove',e=>{
    mx=(e.clientX/window.innerWidth-.5)*2;
    my=(e.clientY/window.innerHeight-.5)*2;
  });
  
  function anim(){
    t+=.016;
    g.rotation.y=Math.sin(t*.6)*.5+mx*.3;
    g.rotation.x=Math.sin(t*.4)*.12-my*.15;
    g.position.y=Math.sin(t*.9)*.12;
    stars.rotation.y=t*.05;
    renderer.render(scene,cam);
    requestAnimationFrame(anim);
  }
  anim();
})();
 
/* ═══════════════════════════════════════
   4. 3D HOVER ON PLATFORM CARDS
═══════════════════════════════════════ */
document.querySelectorAll('.pcard').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    if(!card.classList.contains('active')){
      card.style.transform=
        `perspective(600px) rotateY(${x*18}deg) rotateX(${-y*14}deg) translateY(-6px) scale(1.02)`;
    }
  });
  card.addEventListener('mouseleave',()=>{
    if(!card.classList.contains('active'))
      card.style.transform='';
  });
});
 
/* ═══════════════════════════════════════
   5. SCROLL REVEAL
═══════════════════════════════════════ */
const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('vis')});
},{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
 
/* ═══════════════════════════════════════
   6. PLATFORM SWITCH
═══════════════════════════════════════ */
let currentPlatform='instagram';
function switchPlatform(p){
  currentPlatform=p;
  document.querySelectorAll('.pcard').forEach(c=>{
    c.classList.remove('active');c.style.transform='';
  });
  document.querySelectorAll('.tab-panel').forEach(tp=>tp.classList.remove('act'));
  document.getElementById('pc-'+p).classList.add('active');
  document.getElementById('panel-'+p).classList.add('act');
}
 
/* ═══════════════════════════════════════
   7. LANGUAGE TOGGLE
═══════════════════════════════════════ */
let lang='en';
function toggleLang(){
  lang=lang==='en'?'ar':'en';
  const isAr=lang==='ar';
  document.documentElement.lang=lang;
  document.documentElement.dir=isAr?'rtl':'ltr';
  document.body.classList.toggle('ar',isAr);
  document.getElementById('langBtn').textContent=isAr?'English':'عربية';
  document.getElementById('h1Brand').textContent=isAr?'بادّاج شوب':'BADDAJ CHOP';
  document.getElementById('heroP').textContent=isAr
    ?'متابعون حقيقيون، مشاهدات، وإعجابات — تسليم فوري عبر جميع المنصات الكبرى.'
    :'Real followers, views, and likes — delivered instantly across every major platform.';
  document.getElementById('secServicesTitle').textContent=isAr?'اختر منصتك':'CHOOSE YOUR PLATFORM';
  document.getElementById('secPayTitle').textContent=isAr?'طرق الدفع':'PAYMENT METHODS';
  document.getElementById('secContactTitle').textContent=isAr?'اطلب الآن':'ORDER NOW';
  document.querySelectorAll('[data-en]').forEach(el=>{
    el.textContent=isAr?el.getAttribute('data-ar'):el.getAttribute('data-en');
  });
}
 
/* ═══════════════════════════════════════
   8. MOBILE MENU
═══════════════════════════════════════ */
function toggleMob(){
  document.getElementById('mobMenu').classList.toggle('open');
}
 
/* ═══════════════════════════════════════
   9. NAV ACTIVE HIGHLIGHT
═══════════════════════════════════════ */
window.addEventListener('scroll',()=>{
  document.querySelectorAll('#navLinks a').forEach(a=>{
    const id=a.getAttribute('href').replace('#','');
    const el=document.getElementById(id);
    if(el){
      const t=el.offsetTop-120,b=t+el.offsetHeight;
      a.classList.toggle('act',scrollY>=t&&scrollY<b);
    }
  });
});
 
 
/* ═══════════════════════════════════════
   10. ORDER SYSTEM — EVENT DELEGATION
   Covers ALL platforms · ALL services
   · ALL products automatically
═══════════════════════════════════════ */
 
const PLATFORM_META = {
  'panel-instagram': { name:'Instagram', icon:'📸' },
  'panel-youtube':   { name:'YouTube',   icon:'▶️'  },
  'panel-tiktok':    { name:'TikTok',    icon:'🎵' },
  'panel-facebook':  { name:'Facebook',  icon:'👍' },
  'panel-other':     { name:'Other Platforms', icon:'⋯' }
};
 
// Stamp data-* on every .pcell in every panel at load
(function stampAll(){
  document.querySelectorAll('.tab-panel').forEach(panel => {
    const meta = PLATFORM_META[panel.id] || { name:'Platform', icon:'●' };
    panel.querySelectorAll('.psec').forEach(sec => {
      const headEl = sec.querySelector('.psec-head');
      const svcRaw = headEl ? headEl.innerText.trim() : 'Service';
      // strip leading emoji/symbols for a clean label
      const svcClean = svcRaw.replace(/^[\u{1F000}-\u{1FFFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}️⏱👁👥❤🔥⚡\s]+/gu,'').trim() || svcRaw;
      sec.querySelectorAll('.pcell').forEach(cell => {
        cell.dataset.platform  = meta.name;
        cell.dataset.platIcon  = meta.icon;
        cell.dataset.service   = svcClean;
        cell.dataset.svcRaw    = svcRaw;
        cell.dataset.qty       = cell.querySelector('.pcell-qty')?.textContent.trim()   || '';
        cell.dataset.price     = cell.querySelector('.pcell-price')?.textContent.trim() || '';
      });
    });
  });
})();
 
// Single delegated listener — works for every cell on every platform
document.addEventListener('click', e => {
  const cell = e.target.closest('.pcell');
  if (!cell) return;
  cell.style.background = 'rgba(255,255,255,.15)';
  cell.style.transform  = 'scale(.96)';
  setTimeout(() => { cell.style.background=''; cell.style.transform=''; }, 220);
  openOrderModal({
    platform : cell.dataset.platform || 'Platform',
    platIcon : cell.dataset.platIcon || '●',
    service  : cell.dataset.service  || 'Service',
    svcRaw   : cell.dataset.svcRaw   || '',
    qty      : cell.dataset.qty      || '',
    price    : cell.dataset.price    || ''
  });
});
 
let _ord = {};
 
function openOrderModal(d) {
  _ord = d;
  const isAr = document.body.classList.contains('ar');
 
  document.getElementById('mo-icon').textContent  = d.platIcon;
  document.getElementById('mo-plat').textContent  = d.platform;
  document.getElementById('mo-svc').textContent   = d.svcRaw || d.service;
  document.getElementById('mo-qty').textContent   = d.qty;
  document.getElementById('mo-price').textContent = d.price;
  document.getElementById('mo-svc-sm').textContent = d.service;
 
  const inp = document.getElementById('mo-user');
  inp.value = '';
  inp.style.borderColor = '';
  const placeholders = {
    Instagram       : isAr ? 'مثال: @username أو رابط الملف الشخصي'       : 'e.g. @username or profile URL',
    YouTube         : isAr ? 'رابط قناتك على يوتيوب'                       : 'Your YouTube channel URL',
    TikTok          : isAr ? 'مثال: @username تيك توك'                     : 'e.g. @tiktok_username',
    Facebook        : isAr ? 'رابط الصفحة أو الحساب الشخصي'               : 'Facebook page or profile URL',
    'Other Platforms': isAr ? '@username أو رابط صفحتك'                   : '@username or your page link'
  };
  inp.placeholder = placeholders[d.platform] || (isAr ? '@username' : '@username or URL');
  document.getElementById('mo-note').value = '';
 
  // reset button
  const btn = document.getElementById('mo-send');
  btn.disabled = false;
  btn.style.background = '';
  btn.style.color = '';
  btn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="flex-shrink:0">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#25D366"/>
      <path d="M13.507 1.012C6.64 1.012 1.072 6.58 1.072 13.445c0 2.229.585 4.419 1.697 6.35L1 23.012l3.317-1.741a12.415 12.415 0 0 0 9.19 3.174c6.865 0 12.435-5.568 12.435-12.435 0-6.866-5.57-12.998-12.435-12.998z" stroke="#25D366" stroke-width="1.5" fill="none"/>
    </svg>
    <span>${isAr ? 'إرسال الطلب عبر واتساب' : 'Send Order via WhatsApp'}</span>`;
 
  document.getElementById('orderModal').classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => inp.focus(), 350);
}
 
function closeModal() {
  document.getElementById('orderModal').classList.remove('open');
  document.body.style.overflow = '';
}
 
function submitOrder() {
  const isAr = document.body.classList.contains('ar');
  const username = document.getElementById('mo-user').value.trim();
  const note     = document.getElementById('mo-note').value.trim();
 
  if (!username) {
    const inp = document.getElementById('mo-user');
    inp.style.borderColor = '#ff4444';
    inp.placeholder = isAr ? '⚠ هذا الحقل مطلوب!' : '⚠ This field is required!';
    inp.focus();
    setTimeout(() => { inp.style.borderColor=''; inp.placeholder=''; }, 2200);
    return;
  }
 
  const SEP = '━━━━━━━━━━━━━━━━━━━━━━━';
  const msg = [
    `🛒 *BADDAJ CHOP — New Order*`,
    SEP,
    `${_ord.platIcon} *Platform :* ${_ord.platform}`,
    `🎯 *Service  :* ${_ord.service}`,
    `📊 *Quantity :* ${_ord.qty}`,
    `💰 *Price    :* ${_ord.price}`,
    SEP,
    `👤 *Account / URL :*`,
    `   ${username}`,
    note ? `\n📝 *Note :*\n   ${note}` : '',
    SEP,
    `✅ Please confirm this order. Thank you!`
  ].filter(Boolean).join('\n');
 
  const btn = document.getElementById('mo-send');
  btn.disabled = true;
  btn.style.background = '#111';
  btn.style.color = '#25D366';
  btn.innerHTML = `<span style="letter-spacing:2px">${isAr ? '✓ فتح واتساب…' : '✓ Opening WhatsApp…'}</span>`;
 
  setTimeout(() => {
    window.open(`https://wa.me/212691066301?text=${encodeURIComponent(msg)}`, '_blank');
    setTimeout(closeModal, 500);
  }, 500);
}
 
document.getElementById('orderModal').addEventListener('click', function(e){
  if (e.target === this) closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
document.getElementById('mo-user').addEventListener('keydown', e => {
  if (e.key === 'Enter') submitOrder();
});
 