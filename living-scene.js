/* The homepage now promotes the live WebGL scene. Keep the old recorded-scene
   markup as a safe fallback for cached releases, but upgrade it before the
   browser starts video playback. */
const recorded=document.querySelector('[data-living]');
if(recorded){
 const live=document.createElement('section');
 live.className='scene-stage';live.dataset.scene='paper';live.setAttribute('aria-labelledby','scene-title');
 live.innerHTML='<div class="scene-copy"><p class="scene-kicker">KAGOJSATHI / ONE STEP AT A TIME</p><h1 id="scene-title">Paperwork, <em>made clearer.</em></h1><p>Enter the preparation desk. Choose a service, open the guide, and build your checklist without uploading identity documents.</p><div class="scene-controls"><a class="film-cta" href="#service">Choose your service <span aria-hidden="true">↗</span></a><button type="button" data-motion-toggle aria-pressed="true">Pause scene</button><label>Scene progress<input data-growth type="range" min="0" max="100" value="75" aria-label="Scene progress"></label><span data-growth-label role="status">Mature canopy</span></div></div><div class="scene-view"><canvas aria-label="Animated paper preparation scene"></canvas><div class="scene-fallback" hidden><p>Interactive scene unavailable. Use the service guide below.</p></div></div>';
 recorded.replaceWith(live);
 import('./scene.js');
}
const scene=document.querySelector('[data-living]');
if(scene){
 const video=scene.querySelector('video'),button=scene.querySelector('[data-film-toggle]'),status=scene.querySelector('[data-film-status]'),progress=scene.querySelector('[data-film-progress]');
 const motion=matchMedia('(prefers-reduced-motion: reduce)'),saving=Boolean(navigator.connection?.saveData);
 let wanted=!motion.matches&&!saving,visible=true,pending=false,disposed=false;
 video.muted=true;
 function ui(){const playing=!video.paused;button.textContent=playing?'Pause scene':'Play scene';button.setAttribute('aria-pressed',String(playing));scene.dataset.playback=playing?'playing':'paused';status.textContent=playing?'Scene playing':(motion.matches?'Reduced motion':saving?'Data saver':'Scene paused');}
 async function sync(){
  if(disposed)return;
  if(!wanted||!visible||document.hidden){video.pause();ui();return;}
  if(pending||!video.paused)return;
  pending=true;status.textContent='Loading scene';
  try{if(!video.getAttribute('src')){video.src=video.dataset.src;video.load();}await video.play();if(!wanted||!visible||document.hidden)video.pause();}
  catch{wanted=false;status.textContent='Press play to start';}
  finally{pending=false;if(!disposed)ui();}
 }
 button.addEventListener('click',()=>{wanted=video.paused;sync();});
 video.addEventListener('playing',()=>{scene.classList.add('film-ready');ui();});video.addEventListener('pause',ui);
 video.addEventListener('timeupdate',()=>{if(Number.isFinite(video.duration)&&video.duration>0)progress.style.transform=`scaleX(${video.currentTime/video.duration})`;});
 video.addEventListener('error',()=>{wanted=false;scene.classList.remove('film-ready');ui();status.textContent='Video unavailable';});
 motion.addEventListener('change',()=>{wanted=!motion.matches&&!saving;sync();});document.addEventListener('visibilitychange',sync);
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.05});observer.observe(scene);
 window.addEventListener('pagehide',()=>{disposed=true;video.pause();observer.disconnect();});window.addEventListener('pageshow',event=>{if(event.persisted){disposed=false;observer.observe(scene);sync();}});
 ui();sync();
}
