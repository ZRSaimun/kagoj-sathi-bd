// Original low-poly scene geometry. Decorative only; no measurements or forecasts.
const boxVertices=[[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1],[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1]];
const faces=[[0,1,2,3],[5,4,7,6],[4,0,3,7],[1,5,6,2],[3,2,6,7],[4,5,1,0]];
export const kinds=['paper','market','water','career','tree'];
export function growthAt(seconds){return Math.min(1,(Math.max(0,seconds)%18)/12);}
export function sceneGeometry(kind,time=0,growth=growthAt(time)){
 if(!kinds.includes(kind))throw new Error('Unknown scene');
 if(!Number.isFinite(time)||!Number.isFinite(growth))throw new Error('Invalid scene state');
 growth=Math.max(0,Math.min(1,growth));const vertices=[];
 function triangle(a,b,c,color){const u=b.map((v,i)=>v-a[i]),v=c.map((v,i)=>v-a[i]);const n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];const l=Math.hypot(...n)||1;for(const p of [a,b,c])vertices.push(...p,...n.map(x=>x/l),...color);}
 function box(x,y,z,sx,sy,sz,color,angle=0){const vs=boxVertices.map(p=>{const px=p[0]*sx,py=p[1]*sy;return [x+px*Math.cos(angle)-py*Math.sin(angle),y+px*Math.sin(angle)+py*Math.cos(angle),z+p[2]*sz];});for(const f of faces){triangle(vs[f[0]],vs[f[1]],vs[f[2]],color);triangle(vs[f[0]],vs[f[2]],vs[f[3]],color);}}
 function ball(x,y,z,sx,sy,sz,color){function p(a,b){return[x+sx*Math.sin(a)*Math.cos(b),y+sy*Math.cos(a),z+sz*Math.sin(a)*Math.sin(b)];}for(let a=0;a<7;a++)for(let b=0;b<10;b++){const a0=a*Math.PI/7,a1=(a+1)*Math.PI/7,b0=b*Math.PI*2/10,b1=(b+1)*Math.PI*2/10;triangle(p(a0,b0),p(a1,b0),p(a1,b1),color);triangle(p(a0,b0),p(a1,b1),p(a0,b1),color);}}
 if(kind==='paper'){
  for(let j=0;j<3;j++){const x=(j-1)*1.25,y=.15+Math.sin(time*.55+j)*.16,z=-j*.28,angle=(j-1)*-.13;box(x,y,z,.7,.95,.045,[.92,.87,.74],angle);for(let line=0;line<5;line++)box(x,y+.43-line*.2,z+.055,.42-line*.025,.018,.012,[.35,.48,.52],angle);ball(x+.43,y-.56,z+.1,.18,.18,.06,[.91,.51,.20]);}
 }else if(kind==='market'){
  box(0,-.8,0,1.85,.1,.8,[.34,.22,.12]);for(let i=-2;i<=2;i++)box(i*.75,-.43,.72,.29,.31,.055,[.73,.49,.24]);for(let i=0;i<9;i++){const x=(i%3-1)*.82,y=-.15+Math.floor(i/3)*.23,z=-.5+(Math.floor(i/3))*.43;ball(x,y+Math.sin(time*.7+i)*.035,z,.34,.3,.33,i%2?[.87,.29,.12]:[.47,.68,.18]);box(x,y+.32,z,.025,.09,.025,[.19,.36,.13],.3);}
 }else if(kind==='water'){
  const size=28;const wave=(x,z)=>-.5+.13*Math.sin(x*2.2-time*.9)+.08*Math.cos(z*3+time*.65);
  for(let x=0;x<size;x++)for(let z=0;z<14;z++){const x0=(x/size-.5)*5.8,x1=((x+1)/size-.5)*5.8,z0=(z/14-.5)*3,z1=((z+1)/14-.5)*3;const c=[.07,.40+z*.009,.58+z*.01];triangle([x0,wave(x0,z0),z0],[x1,wave(x1,z1),z1],[x1,wave(x1,z0),z0],c);triangle([x0,wave(x0,z0),z0],[x0,wave(x0,z1),z1],[x1,wave(x1,z1),z1],c);}
  const bob=.08*Math.sin(time*.9);box(.2,-.18+bob,.2,.72,.13,.35,[.88,.67,.37],-.04);box(.2,.24+bob,.2,.025,.5,.025,[.87,.91,.88]);triangle([.22,.7+bob,.2],[.22,-.05+bob,.2],[.92,-.05+bob,.2],[.95,.92,.78]);
 }else if(kind==='career'){
  for(let i=0;i<5;i++){const x=(i-2)*.75,y=-1+i*.35;box(x,y,0,.32,.12,.55,[.35+i*.08,.39+i*.06,.72+i*.025]);box(x,y-.4,0,.045,.4,.045,[.36,.35,.48]);}
  const step=(Math.sin(time*.5)+1)*2;ball((step-2)*.75,-.72+step*.35+.12*Math.sin(time*2),.05,.18,.18,.18,[1,.7,.29]);
 }else{
  ball(0,-1.05,0,1.1,.14,.8,[.28,.20,.12]);ball(0,-.88,0,.18*(1-growth)+.05,.12,.13,[.69,.42,.20]);const h=.15+growth*1.8;box(0,-.9+h/2,0,.035+growth*.055,h/2,.035+growth*.055,[.43,.28,.13]);
  for(let i=0;i<7;i++){const a=i*2.4,s=(.1+growth*.55)*(i?1:.95),y=-.65+h*(.55+(i%3)*.15);ball(Math.cos(a)*growth*.65,y,Math.sin(a)*growth*.5,s,s*.85,s,[.16+(i%2)*.06,.45+(i%3)*.06,.24],);}
  for(let i=0;i<6;i++){const a=i*1.1+time*.08;ball(Math.cos(a)*1.6,.3+Math.sin(a+time*.3)*.55,Math.sin(a)*.6,.04,.07,.015,[.65,.77,.34]);}
 }
 return new Float32Array(vertices);
}

