/* Dreamscape: rose-ivory dunes, floating glass and pearl spheres, a brass-capped perfume bottle and drifting gold dust.
   The camera glides into the scene as the visitor scrolls; the pointer adds a gentle parallax. Three.js r128. */
(function(){
  const sec = document.getElementById('dream');
  if(!sec) return;
  const canvas = sec.querySelector('canvas');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let gl = null;
  try{ gl = canvas.getContext('webgl2') || canvas.getContext('webgl'); }catch(_){}
  if(!gl || !window.THREE){ sec.classList.add('no3d'); return; }

  const T = window.THREE;
  const renderer = new T.WebGLRenderer({canvas, antialias:true, alpha:false, powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  renderer.outputEncoding = T.sRGBEncoding;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.physicallyCorrectLights = true;

  const scene = new T.Scene();
  const SKY_TOP = new T.Color('#f7f1e8'), SKY_LOW = new T.Color('#ecd3cb');

  // Sky: a big gradient dome
  const skyGeo = new T.SphereGeometry(400, 32, 16);
  const skyMat = new T.ShaderMaterial({
    side: T.BackSide, depthWrite:false,
    uniforms:{top:{value:SKY_TOP}, low:{value:SKY_LOW}, sun:{value:new T.Color('#fff4df')}},
    vertexShader:'varying vec3 vP; void main(){ vP=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader:'uniform vec3 top; uniform vec3 low; uniform vec3 sun; varying vec3 vP; void main(){ float h=clamp(vP.y*1.6+0.12,0.0,1.0); vec3 c=mix(low,top,pow(h,0.8)); float s=pow(max(dot(vP,normalize(vec3(-0.35,0.22,-1.0))),0.0),24.0); c+=sun*s*0.55; gl_FragColor=vec4(c,1.0); }'
  });
  scene.add(new T.Mesh(skyGeo, skyMat));
  scene.fog = new T.Fog(SKY_LOW.clone().lerp(SKY_TOP,.3), 28, 120);

  // Environment for glass reflections, rendered from a soft gradient room
  const pmrem = new T.PMREMGenerator(renderer);
  const envScene = new T.Scene();
  const envMat = skyMat.clone();
  envScene.add(new T.Mesh(new T.SphereGeometry(10,32,16), envMat));
  const panel = (c, x, y, z, w, h)=>{ const m=new T.Mesh(new T.PlaneGeometry(w,h), new T.MeshBasicMaterial({color:c, side:T.DoubleSide})); m.position.set(x,y,z); m.lookAt(0,0,0); envScene.add(m); };
  panel(0xffffff, -4, 5, -6, 6, 3);   // big soft window
  panel(0xffe2b8, 6, 2, 3, 3, 4);     // warm bounce
  panel(0xd9a3a0, 0, -4, 5, 8, 2);    // rose floor bounce
  scene.environment = pmrem.fromScene(envScene, 0.02).texture;

  // Lights
  const sun = new T.DirectionalLight(0xfff0dc, 3.2); sun.position.set(-18, 14, -22); scene.add(sun);
  scene.add(new T.HemisphereLight(0xfffaf2, 0xd8b0a8, 1.1));
  const fill = new T.PointLight(0xffd9b0, 30, 30, 2); fill.position.set(3, 4, 6); scene.add(fill);

  // Dunes
  const DW = 220, DSEG = 120;
  const duneGeo = new T.PlaneGeometry(DW, DW, DSEG, DSEG); duneGeo.rotateX(-Math.PI/2);
  const base = duneGeo.attributes.position.array.slice();
  const duneMat = new T.MeshStandardMaterial({color:new T.Color('#e8cfc4'), roughness:.92, metalness:0});
  const dunes = new T.Mesh(duneGeo, duneMat); dunes.position.y = -2.2; scene.add(dunes);
  function duneH(x, z, t){
    return Math.sin(x*.06 + t*.03)*1.6 + Math.sin(z*.045 + x*.02)*2.2 + Math.sin((x+z)*.11 - t*.05)*.45 + Math.max(0, Math.sin(x*.025 - z*.03))*2.4;
  }
  function shapeDunes(t){
    const p = duneGeo.attributes.position.array;
    for(let i=0;i<p.length;i+=3){ const x=base[i], z=base[i+2]; const d=Math.hypot(x, z-6); const flat=Math.min(1, d/18); p[i+1] = duneH(x,z,t) * (0.25 + 0.75*flat); }
    duneGeo.attributes.position.needsUpdate = true; duneGeo.computeVertexNormals();
  }
  shapeDunes(0);

  // Glass and pearl spheres
  const glass = new T.MeshPhysicalMaterial({color:0xffffff, metalness:0, roughness:.04, transmission:1, thickness:1.2, ior:1.45, transparent:true, envMapIntensity:1.4, clearcoat:1, clearcoatRoughness:.05});
  const pearl = new T.MeshPhysicalMaterial({color:0xf6ece4, metalness:.1, roughness:.25, clearcoat:1, clearcoatRoughness:.1, sheen:1, sheenColor:new T.Color('#f2c9c4'), envMapIntensity:1.2});
  const roseGlass = glass.clone(); roseGlass.color = new T.Color('#f3cfcf'); roseGlass.attenuationColor = new T.Color('#e7a9ab'); roseGlass.attenuationDistance = 2.5;
  const spheres = [];
  const layout = [
    [-6.5, 2.4, 1, 1.5, glass], [7.2, 3.6, -3, 2.1, roseGlass], [-3.2, 4.8, -8, 1.1, pearl], [4.6, .9, 3.5, .8, pearl],
    [-11, 1.6, -12, 2.6, glass], [12, 5.5, -16, 1.8, glass], [1.5, 6.4, -14, 1.3, roseGlass], [-8.5, 6.2, -20, 2.2, pearl],
    [9, 1.4, -26, 3.0, roseGlass], [-2.5, 2.2, 6.5, .55, glass]
  ];
  const sg = new T.SphereGeometry(1, 64, 48);
  layout.forEach(([x,y,z,r,m],i)=>{ const s=new T.Mesh(sg, m); s.position.set(x,y,z); s.scale.setScalar(r); s.userData={y, ph:i*1.7, sp:.35+(i%3)*.12}; scene.add(s); spheres.push(s); });

  // The hero: a perfume bottle with a brass cap, resting on a travertine plinth
  const hero = new T.Group(); hero.position.set(0, 0, 0); scene.add(hero);
  const plinth = new T.Mesh(new T.BoxGeometry(3.2, 1.6, 3.2), new T.MeshStandardMaterial({color:'#efe3d2', roughness:.8}));
  plinth.position.y = -1.4; hero.add(plinth);
  const bottleGlass = new T.MeshPhysicalMaterial({color:0xffffff, metalness:0, roughness:.03, transmission:1, thickness:2.2, ior:1.5, transparent:true, envMapIntensity:1.6, clearcoat:1, attenuationColor:new T.Color('#f6dcc4'), attenuationDistance:3});
  const bottle = new T.Group(); hero.add(bottle);
  const body = new T.Mesh(new T.BoxGeometry(1.7, 2.1, .95, 1,1,1), bottleGlass); body.position.y = .45; bottle.add(body);
  const juice = new T.Mesh(new T.BoxGeometry(1.45, 1.55, .72), new T.MeshPhysicalMaterial({color:'#f2d2b0', roughness:.2, transmission:.85, thickness:1, transparent:true, opacity:.9}));
  juice.position.y = .2; bottle.add(juice);
  const brass = new T.MeshStandardMaterial({color:'#b8955e', metalness:1, roughness:.28, envMapIntensity:1.3});
  const neck = new T.Mesh(new T.CylinderGeometry(.2,.2,.25,32), brass); neck.position.y = 1.62; bottle.add(neck);
  const cap = new T.Mesh(new T.CylinderGeometry(.48,.48,.72,48), brass); cap.position.y = 2.08; bottle.add(cap);
  bottle.position.y = .2;

  // Silk ribbon: a soft dusty-rose wave draped past the plinth
  const ribGeo = new T.PlaneGeometry(14, 1.6, 140, 8);
  const ribBase = ribGeo.attributes.position.array.slice();
  const ribbon = new T.Mesh(ribGeo, new T.MeshStandardMaterial({color:'#d9a7a3', roughness:.45, metalness:.05, side:T.DoubleSide}));
  ribbon.position.set(0, -.9, .2); scene.add(ribbon);
  function shapeRibbon(t){
    const p = ribGeo.attributes.position.array;
    for(let i=0;i<p.length;i+=3){ const x=ribBase[i], y=ribBase[i+1]; p[i+1] = y*.5 + Math.sin(x*.55 + t*.6)*.45 - Math.abs(x)*.1; p[i+2] = Math.cos(x*.4 + t*.45)*1.1 + y*.6; }
    ribGeo.attributes.position.needsUpdate = true; ribGeo.computeVertexNormals();
  }

  // Gold dust
  const N = 900, dp = new Float32Array(N*3), ds = new Float32Array(N);
  for(let i=0;i<N;i++){ dp[i*3]=(Math.random()-.5)*50; dp[i*3+1]=Math.random()*14-1; dp[i*3+2]=-Math.random()*45+10; ds[i]=Math.random(); }
  const dustGeo = new T.BufferGeometry(); dustGeo.setAttribute('position', new T.BufferAttribute(dp,3)); dustGeo.setAttribute('seed', new T.BufferAttribute(ds,1));
  const dustMat = new T.ShaderMaterial({ transparent:true, depthWrite:false, blending:T.AdditiveBlending,
    uniforms:{t:{value:0}, px:{value:renderer.getPixelRatio()}},
    vertexShader:'uniform float t; uniform float px; attribute float seed; varying float vA; void main(){ vec3 p=position; p.y+=sin(t*.4+seed*20.)*.35+mod(t*.12+seed*10.,14.)*.15; p.x+=sin(t*.2+seed*9.)*.4; vec4 mv=modelViewMatrix*vec4(p,1.); gl_Position=projectionMatrix*mv; gl_PointSize=(1.5+seed*2.6)*px*(22./-mv.z); vA=.35+.65*abs(sin(t*.9+seed*30.)); }',
    fragmentShader:'varying float vA; void main(){ float d=length(gl_PointCoord-.5); float a=smoothstep(.5,0.,d)*vA; gl_FragColor=vec4(1.,.86,.6,a*.7); }'
  });
  scene.add(new T.Points(dustGeo, dustMat));

  // Camera path: a wide establishing view gliding in to the bottle
  const camera = new T.PerspectiveCamera(38, 1, .1, 600);
  const path = [
    {p:new T.Vector3(0, 7.5, 34), l:new T.Vector3(0, 2.5, -10)},
    {p:new T.Vector3(-5, 4, 18), l:new T.Vector3(0, 1.4, -4)},
    {p:new T.Vector3(3.5, 2.4, 9), l:new T.Vector3(0, 1, 0)},
    {p:new T.Vector3(.4, 1.6, 5.2), l:new T.Vector3(0, 1.05, 0)}
  ];
  const tmpP = new T.Vector3(), tmpL = new T.Vector3();
  const ease = t => t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;
  function camAt(k){
    const n = path.length-1, f = Math.min(n-1e-4, Math.max(0, k*n)), i = Math.floor(f), u = ease(f-i);
    tmpP.lerpVectors(path[i].p, path[i+1].p, u); tmpL.lerpVectors(path[i].l, path[i+1].l, u);
  }

  // Captions that change with scroll
  const caps = [...sec.querySelectorAll('[data-at]')];
  const bar = sec.querySelector('.dream-bar i');

  let W=0, H=0;
  function resize(){
    const r = sec.querySelector('.dream-stage').getBoundingClientRect();
    W = r.width; H = r.height; renderer.setSize(W, H, false);
    camera.aspect = W/H; camera.fov = W < 700 ? 52 : 38; camera.updateProjectionMatrix();
  }
  addEventListener('resize', resize); resize();

  let mx=0, my=0, smx=0, smy=0;
  addEventListener('pointermove', e=>{ mx = e.clientX/innerWidth*2-1; my = e.clientY/innerHeight*2-1; }, {passive:true});

  let prog = reduce ? .35 : 0, sprog = prog, visible = true, t0 = performance.now();
  function readScroll(){
    if(reduce) return;
    const r = sec.getBoundingClientRect(), total = r.height - innerHeight;
    prog = Math.min(1, Math.max(0, -r.top / Math.max(1,total)));
    visible = r.bottom > 0 && r.top < innerHeight;
  }
  addEventListener('scroll', readScroll, {passive:true}); readScroll();

  function frame(now){
    requestAnimationFrame(frame);
    if(!visible) return;
    const t = reduce ? 4 : (now - t0)/1000;
    sprog += (prog - sprog) * .08; smx += (mx - smx) * .05; smy += (my - smy) * .05;

    camAt(sprog);
    camera.position.copy(tmpP).add(new T.Vector3(smx*1.2, -smy*.6, 0));
    camera.lookAt(tmpL);

    if(!reduce){
      spheres.forEach(s=>{ const d=s.userData; s.position.y = d.y + Math.sin(t*d.sp + d.ph)*.5; s.rotation.y = t*.1 + d.ph; });
      bottle.rotation.y = Math.sin(t*.35)*.35 + sprog*.6; bottle.position.y = .2 + Math.sin(t*.8)*.08;
      shapeRibbon(t);
      dustMat.uniforms.t.value = t;
    } else { shapeRibbon(2); }

    caps.forEach(c=>{ const [a,b] = c.dataset.at.split(',').map(Number); const on = sprog>=a && sprog<b; c.classList.toggle('on', on); });
    if(bar) bar.style.width = (sprog*100)+'%';
    renderer.render(scene, camera);
  }
  shapeRibbon(0);
  requestAnimationFrame(frame);
})();
