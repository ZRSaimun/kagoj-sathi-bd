const scene=document.querySelector('[data-photo]');
if(scene){
 const button=scene.querySelector('[data-photo-motion]'),image=scene.querySelector('.photo-image'),media=matchMedia('(prefers-reduced-motion: reduce)');
 let paused=media.matches,visible=true,frame=0,x=0,y=0;
 const apply=()=>{scene.classList.toggle('motion-paused',paused||!visible||document.hidden);button.textContent=paused?'Play photo motion':'Pause photo motion';button.setAttribute('aria-pressed',String(!paused));};
 button.addEventListener('click',()=>{paused=!paused;apply();});media.addEventListener('change',()=>{paused=media.matches;apply();});document.addEventListener('visibilitychange',apply);
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;apply();});observer.observe(scene);
 scene.addEventListener('pointermove',event=>{if(paused||media.matches||event.pointerType==='touch')return;const r=scene.getBoundingClientRect();x=((event.clientX-r.left)/r.width-.5)*12;y=((event.clientY-r.top)/r.height-.5)*8;if(!frame)frame=requestAnimationFrame(()=>{scene.style.setProperty('--px',`${x}px`);scene.style.setProperty('--py',`${y}px`);frame=0;});});
 scene.addEventListener('pointerleave',()=>{scene.style.setProperty('--px','0px');scene.style.setProperty('--py','0px');});
 for(const choice of scene.querySelectorAll('[data-photo-choice]'))choice.addEventListener('click',()=>{
  image.src=choice.dataset.photoChoice;image.alt=choice.dataset.alt;
  for(const b of scene.querySelectorAll('[data-photo-choice]'))b.setAttribute('aria-pressed',String(b===choice));
  const credit=scene.querySelector('[data-photo-credit]');credit.textContent=choice.dataset.credit;credit.href=choice.dataset.source;
  scene.querySelector('[data-photo-caption]').textContent=choice.dataset.caption;
 });
 image.addEventListener('error',()=>{scene.dataset.imageStatus='unavailable';scene.querySelector('[data-photo-caption]').textContent='Photo unavailable. The planning tools below are still available.';});
 window.addEventListener('pagehide',()=>{cancelAnimationFrame(frame);observer.disconnect();},{once:true});window.addEventListener('pageshow',e=>{if(e.persisted){observer.observe(scene);apply();}});apply();
}
