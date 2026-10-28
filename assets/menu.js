/* Mobile menu: a quiet "Menu" word that opens a full-screen powder-rose sheet.
   Built from the page's own nav links, so every page stays in sync. */
(function(){
  const nav=document.getElementById('nav'); if(!nav) return;
  const wrap=nav.querySelector('.wrap'), list=nav.querySelector('ul'), quote=nav.querySelector('.btn');
  if(!wrap||!list) return;

  const btn=document.createElement('button');
  btn.type='button'; btn.className='menu-toggle'; btn.textContent='Menu';
  btn.setAttribute('aria-expanded','false'); btn.setAttribute('aria-controls','menuSheet');
  const right=document.createElement('div'); right.className='nav-right';
  if(quote){ quote.replaceWith(right); right.append(btn, quote); } else wrap.append(btn);

  const sheet=document.createElement('div');
  sheet.id='menuSheet'; sheet.className='menu-sheet'; sheet.hidden=true;
  sheet.setAttribute('role','dialog'); sheet.setAttribute('aria-modal','true'); sheet.setAttribute('aria-label','Menu');
  const logo=nav.querySelector('.logo');
  const links=[...list.querySelectorAll('a')];
  const hasHome=links.some(a=>a.getAttribute('href')==='./');
  const items=(hasHome?[]:[{href:'./',text:'Home'}]).concat(links.map(a=>({href:a.getAttribute('href'),text:a.textContent.trim(),cur:a.hasAttribute('aria-current')})));
  sheet.innerHTML=
    '<div class="menu-top wrap"><a class="logo" href="./">'+(logo?logo.innerHTML:'Mr &amp; Mrs Digital')+'</a>'+
    '<button type="button" class="menu-close">Close</button></div>'+
    '<nav class="menu-links wrap" aria-label="Main"><ol>'+
    items.map((it,i)=>'<li><a href="'+it.href+'"'+(it.cur?' aria-current="page"':'')+'><b>'+String(i+1).padStart(2,'0')+'</b>'+it.text+'</a></li>').join('')+
    '</ol></nav>'+
    '<div class="menu-foot wrap"><a class="btn" href="contact-us">Get a quote</a><span>Made with care in Norwich, UK</span></div>';
  document.body.append(sheet);
  const close=sheet.querySelector('.menu-close');

  let last=null;
  function open(){ last=document.activeElement; sheet.hidden=false; requestAnimationFrame(()=>sheet.classList.add('open'));
    document.documentElement.classList.add('menu-open'); btn.setAttribute('aria-expanded','true'); close.focus(); }
  function shut(){ sheet.classList.remove('open'); document.documentElement.classList.remove('menu-open'); btn.setAttribute('aria-expanded','false');
    setTimeout(()=>{ if(!sheet.classList.contains('open')) sheet.hidden=true; },260); if(last) last.focus(); }
  btn.addEventListener('click',open);
  close.addEventListener('click',shut);
  sheet.addEventListener('click',e=>{ if(e.target.closest('a')) shut(); });
  addEventListener('keydown',e=>{
    if(sheet.hidden) return;
    if(e.key==='Escape') shut();
    if(e.key==='Tab'){ const f=[...sheet.querySelectorAll('a,button')], a=f[0], z=f[f.length-1];
      if(e.shiftKey&&document.activeElement===a){e.preventDefault(); z.focus();} else if(!e.shiftKey&&document.activeElement===z){e.preventDefault(); a.focus();} }
  });
  matchMedia('(min-width:861px)').addEventListener('change',m=>{ if(m.matches&&!sheet.hidden) shut(); });
})();
