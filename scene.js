import {sceneGeometry,growthAt} from './scene-model.js';
const root=document.querySelector('[data-scene]');
if(root){
 let canvas=root.querySelector('canvas');const fallback=root.querySelector('.scene-fallback'),button=root.querySelector('[data-motion-toggle]'),slider=root.querySelector('[data-growth]'),label=root.querySelector('[data-growth-label]');
 const preference=matchMedia('(prefers-reduced-motion: reduce)');let playing=!preference.matches,visible=true,failed=false,frame=0,seconds=0,last=0,manual=null,displayedGrowth=.75;
 let gl,program,buffer,vertex,fragment,ctx;
 function stop(){cancelAnimationFrame(frame);frame=0;last=0;}
 function fail(){
  stop();
  if(!ctx){const replacement=canvas.cloneNode();canvas.replaceWith(replacement);canvas=replacement;ctx=canvas.getContext('2d');}
  if(ctx){failed=false;canvas.hidden=false;fallback.hidden=true;root.dataset.renderer='canvas2d';return;}
  failed=true;playing=false;canvas.hidden=true;fallback.hidden=false;button.hidden=true;if(slider)slider.closest('label').hidden=true;root.dataset.renderer='fallback';
 }
 function paint(vertices,width,height){
  ctx.clearRect(0,0,width,height);const angle=.24+Math.sin(seconds*.22)*.16,c=Math.cos(angle),s=Math.sin(angle),triangles=[];
  for(let i=0;i<vertices.length;i+=27){const points=[];let depth=0;for(let j=0;j<3;j++){const k=i+j*9,x=vertices[k]*c+vertices[k+2]*s,z=-vertices[k]*s+vertices[k+2]*c,y=vertices[k+1]*.94-z*.34,zz=vertices[k+1]*.34+z*.94,d=7-zz;points.push([width/2+x*height*1.25/d,height/2-y*height*1.25/d]);depth+=zz;}
   const nx=vertices[i+3]*c+vertices[i+5]*s,ny=vertices[i+4],nz=-vertices[i+3]*s+vertices[i+5]*c,light=.55+.45*Math.abs((-.5*nx+ny+2*nz)/Math.sqrt(5.25));const color=[6,7,8].map(k=>Math.round(vertices[i+k]*light*255));triangles.push({points,depth,color});}
  triangles.sort((a,b)=>a.depth-b.depth);for(const t of triangles){ctx.beginPath();ctx.moveTo(...t.points[0]);ctx.lineTo(...t.points[1]);ctx.lineTo(...t.points[2]);ctx.closePath();ctx.fillStyle=`rgb(${t.color.join(',')})`;ctx.fill();}
 }

 function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error('Shader unavailable');return s;}
 try{
  gl=canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'low-power'});if(!gl)throw Error('WebGL unavailable');
  vertex=shader(gl.VERTEX_SHADER,`attribute vec3 position;attribute vec3 normal;attribute vec3 color;uniform float aspect;uniform float angle;varying vec3 shade;void main(){mat3 r=mat3(cos(angle),0.,-sin(angle),0.,1.,0.,sin(angle),0.,cos(angle));vec3 p=r*position;float y=p.y*.94-p.z*.34;p.z=p.y*.34+p.z*.94;p.y=y;float distance=7.-p.z;gl_Position=vec4(p.x*2.5/aspect,p.y*2.5,-p.z*.05,distance);float light=.55+.45*abs(dot(normalize(r*normal),normalize(vec3(-.5,1.,2.))));shade=color*light;}`);
  fragment=shader(gl.FRAGMENT_SHADER,'precision mediump float;varying vec3 shade;void main(){gl_FragColor=vec4(shade,1.);}');
  program=gl.createProgram();gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('WebGL unavailable');gl.useProgram(program);buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  ['position','normal','color'].forEach((name,i)=>{const location=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,3,gl.FLOAT,false,36,i*12);});gl.enable(gl.DEPTH_TEST);gl.clearColor(0,0,0,0);root.dataset.renderer='webgl';fallback.hidden=true;
 }catch{fail();}
 function render(){if(failed)return;try{
  const ratio=Math.min(devicePixelRatio||1,1.5),width=Math.max(1,Math.round(canvas.clientWidth*ratio)),height=Math.max(1,Math.round(canvas.clientHeight*ratio));if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
  const growth=manual??(playing?growthAt(seconds):displayedGrowth),vertices=sceneGeometry(root.dataset.scene,seconds,growth);
  displayedGrowth=growth;
  if(ctx)paint(vertices,width,height);else{gl.viewport(0,0,width,height);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniform1f(gl.getUniformLocation(program,'aspect'),width/height);gl.uniform1f(gl.getUniformLocation(program,'angle'),.24+Math.sin(seconds*.22)*.16);gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.DYNAMIC_DRAW);gl.drawArrays(gl.TRIANGLES,0,vertices.length/9);}
  if(slider&&manual===null)slider.value=String(Math.round(growth*100));if(label)label.textContent=growth<.2?'Seed & sprout':growth<.65?'Young tree':'Mature canopy';
 }catch{fail();}}
 function tick(now){frame=0;if(!playing||!visible||document.hidden||failed)return;if(!last)last=now;const dt=now-last;if(dt>=1000/30){seconds+=Math.min(dt,100)/1000;last=now;render();}frame=requestAnimationFrame(tick);}
 function state(){button.textContent=playing?'Pause animation':'Play animation';button.setAttribute('aria-pressed',String(playing));root.classList.toggle('motion-paused',!playing);stop();render();if(playing&&visible&&!document.hidden&&!failed)frame=requestAnimationFrame(tick);}
 button.addEventListener('click',()=>{playing=!playing;if(playing)manual=null;state();});
 slider?.addEventListener('input',()=>{manual=Number(slider.value)/100;playing=false;state();});
 preference.addEventListener('change',()=>{playing=!preference.matches;manual=null;state();});
 canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();fail();});
 document.addEventListener('visibilitychange',state);
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;state();});observer.observe(root);
 const resize=new ResizeObserver(()=>render());resize.observe(canvas);
 window.addEventListener('pagehide',()=>{stop();observer.disconnect();resize.disconnect();if(gl&&!gl.isContextLost()){gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vertex);gl.deleteShader(fragment);}},{once:true});
 window.addEventListener('pageshow',event=>{if(event.persisted){fail();}});
 state();
}
