/* Floating 3D portfolio: framed prints hang in a cream room, gold dust drifts, the camera glides past on scroll. */
(function(){
  const sec = document.getElementById('g3d');
  const fallback = document.getElementById('work');
  if(!sec) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let gl = null;
  try{ const c=document.createElement('canvas'); gl = c.getContext('webgl2') || c.getContext('webgl'); }catch(_){}
  if(reduce || !gl || !window.THREE){ sec.hidden = true; return; }
  if(fallback) fallback.hidden = true;

  const T = window.THREE;
  const items = [
    {src:'assets/liquid-gold.jpg', title:'Liquid Gold', sub:'Jewellery'},
    {src:'assets/noir.jpg', title:'Noir', sub:'Fragrance'},
    {src:'assets/photo/serum-editorial.jpg', title:'Serum, editorial', sub:'Skincare'},
    {src:'assets/mango.jpg', title:'Patisserie', sub:'Food'},
    {src:'assets/photo/headphones.jpg', title:'Half drawn, half real', sub:'Tech'},
    {src:'assets/golden-hour.jpg', title:'Golden Hour', sub:'Footwear'},
    {src:'assets/photo/white-perfume-blossom.jpg', title:'Blossom', sub:'Fragrance'},
    {src:'assets/photo/lipstick-crew.jpg', title:'Lights, camera, lipstick', sub:'Beauty'}
  ];
  const CREAM = 0xf1e8e1, GAP = 6.5;
  const canvas = sec.querySelector('canvas');
  const cap = sec.querySelector('.g3d-cap'), capT = cap.querySelector('b'), capS = cap.querySelector('span');
  const head = sec.querySelector('.g3d-head'), bar = sec.querySelector('.g3d-bar i'), count = sec.querySelector('.g3d-count');

  const renderer = new T.WebGLRenderer({canvas, antialias:true, alpha:false, powerPreference:'high-performance'});
  renderer.setClearColor(CREAM, 1);
  renderer.outputEncoding = T.sRGBEncoding;
  const scene = new T.Scene();
  scene.fog = new T.Fog(CREAM, 5, 26);
  const camera = new T.PerspectiveCamera(45, 1, 0.1, 80);

  const narrow = () => innerWidth < 760;
  const loader = new T.TextureLoader();
  const groups = [];
  items.forEach((it, i) => {
    const g = new T.Group();
    const side = i % 2 === 0 ? -1 : 1;
    g.userData = {side, baseY: (i % 3 - 1) * 0.35, rot: -side * 0.18};
    g.position.z = -i * GAP;
    const mat = new T.Mesh(new T.PlaneGeometry(1,1), new T.MeshBasicMaterial({color:0xf7efeb, transparent:true}));
    const shadow = new T.Mesh(new T.PlaneGeometry(1,1), new T.MeshBasicMaterial({color:0x3a2626, transparent:true, opacity:.12}));
    const pic = new T.Mesh(new T.PlaneGeometry(1,1), new T.MeshBasicMaterial({color:0xffffff, transparent:true}));
    shadow.position.set(0.06,-0.09,-0.02); mat.position.z = -0.01;
    g.add(shadow); g.add(mat); g.add(pic);
    g.userData.parts = {mat, shadow, pic};
    setSize(g, 3/4);
    loader.load(it.src, tex => {
      tex.encoding = T.sRGBEncoding; tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      pic.material.map = tex; pic.material.needsUpdate = true;
      setSize(g, tex.image.width / tex.image.height);
      needs = true;
    });
    scene.add(g); groups.push(g);
  });
  function setSize(g, aspect){
    const h = aspect >= 1 ? 2.1 : 2.7, w = h * aspect;
    const {mat, shadow, pic} = g.userData.parts;
    pic.scale.set(w, h, 1); mat.scale.set(w + 0.22, h + 0.22, 1); shadow.scale.set(w + 0.22, h + 0.22, 1);
  }

  // gold dust
  const N = narrow() ? 260 : 600, pos = new Float32Array(N*3), speed = new Float32Array(N);
  const zMin = -(items.length) * GAP - 6;
  for(let i=0;i<N;i++){ pos[i*3]=(Math.random()-.5)*14; pos[i*3+1]=(Math.random()-.5)*8; pos[i*3+2]=zMin+Math.random()*(12-zMin); speed[i]=.002+Math.random()*.006; }
  const dg = new T.BufferGeometry(); dg.setAttribute('position', new T.BufferAttribute(pos,3));
  const sprite = (()=>{ const c=document.createElement('canvas'); c.width=c.height=64; const x=c.getContext('2d'); const r=x.createRadialGradient(32,32,0,32,32,32); r.addColorStop(0,'rgba(255,240,205,1)'); r.addColorStop(.35,'rgba(214,180,120,.9)'); r.addColorStop(1,'rgba(214,180,120,0)'); x.fillStyle=r; x.fillRect(0,0,64,64); const t=new T.CanvasTexture(c); return t; })();
  const dust = new T.Points(dg, new T.PointsMaterial({size:.09, map:sprite, transparent:true, depthWrite:false, opacity:.85, color:0xd8b77a}));
  scene.add(dust);

  let W=0,H=0, needs=true, visible=false, mx=0, my=0, tx=0, ty=0, p=0;
  function resize(){
    W = canvas.clientWidth; H = canvas.clientHeight;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
    renderer.setSize(W, H, false);
    camera.aspect = W / H; camera.fov = narrow() ? 62 : 45; camera.updateProjectionMatrix();
    const spread = narrow() ? 0.95 : 2.3;
    groups.forEach(g => { g.position.x = g.userData.side * spread; g.position.y = g.userData.baseY; g.rotation.y = g.userData.rot * (narrow() ? .5 : 1); });
    needs = true;
  }
  addEventListener('resize', resize); resize();
  addEventListener('pointermove', e => { mx = (e.clientX / innerWidth - .5); my = (e.clientY / innerHeight - .5); }, {passive:true});
  new IntersectionObserver(es => { visible = es[0].isIntersecting; if(visible) loop(); }, {rootMargin:'200px 0px'}).observe(sec);

  const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
  let last = -1, raf = 0;
  function loop(){
    if(raf) return;
    const step = () => {
      raf = 0;
      if(!visible) return;
      const r = sec.getBoundingClientRect();
      p = clamp(-r.top / (r.height - innerHeight), 0, 1);
      const zEnd = -(items.length - 1) * GAP;
      const D = narrow() ? 5.2 : 5.6, START = 10;
      const camZ = START + (zEnd + D - START) * p;
      // which print is closest ahead of the camera
      const idx = clamp(Math.round((D - camZ) / GAP), 0, items.length - 1);
      const target = groups[idx];
      tx += ((target.position.x * 0.32 + mx * 0.6) - tx) * 0.06;
      ty += ((-my * 0.35) - ty) * 0.06;
      camera.position.set(tx, ty, camZ);
      camera.lookAt(tx * 0.6, 0, camZ - 6);
      groups.forEach(g => {
        g.position.y = g.userData.baseY + Math.sin(performance.now()/2400 + g.position.z) * 0.05;
        const dist = camZ - g.position.z, o = clamp((dist - 1.8) / 1.4, 0, 1), {mat, shadow, pic} = g.userData.parts;
        pic.material.opacity = o; mat.material.opacity = o; shadow.material.opacity = 0.12 * o; g.visible = o > 0.01;
      });
      for(let i=0;i<N;i++){ pos[i*3+1] += speed[i]; if(pos[i*3+1] > 4) pos[i*3+1] = -4; }
      dg.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
      if(idx !== last){ last = idx; cap.classList.remove('on'); setTimeout(()=>{ capT.textContent = items[idx].title; capS.textContent = items[idx].sub; cap.classList.toggle('right', groups[idx].userData.side < 0 && !narrow()); cap.classList.add('on'); }, 180); count.textContent = (idx+1) + ' of ' + items.length; }
      head.style.opacity = clamp(1 - p * 7, 0, 1).toFixed(3);
      bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }
})();
