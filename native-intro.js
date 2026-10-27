(() => {
 'use strict';
 const root=document.querySelector('.native-intro'),pin=root?.querySelector('.native-pin');if(!pin)return;
 const scenes=[...root.querySelectorAll('[data-ni-scene]')],steps=[...root.querySelectorAll('[data-ni-step]')];
 const nodes=[...root.querySelectorAll('[data-ni-node]')],art=root.querySelector('.ni-art'),canvas=root.querySelector('canvas'),ctx=canvas.getContext('2d');
 const header=document.querySelector('.header'),label=document.querySelector('#ni-scroll-label');
 const bounds=[.11,.27,.43,.59,.75,.91],centers=[0,.19,.35,.51,.67,.83,1];
 const nodeCopy=[['ENTRADA','Informação','Um pedido chega.'],['CONTEXTO','Agente de IA','Entender para agir.'],['EXECUÇÃO','Sua ferramenta','O fluxo continua.']];
 const consultCopy=[['DIAGNÓSTICO','Sua rotina','Entender o negócio.'],['PRIORIDADES','Oportunidades','Avaliar possibilidades.'],['PRÓXIMOS PASSOS','Sua direção','Definir por onde começar.']];
 const clamp=n=>Math.max(0,Math.min(1,n)),range=(n,a,b)=>clamp((n-a)/(b-a)),smooth=n=>n*n*(3-2*n),mix=(a,b,n)=>a+(b-a)*n;
 const color=(a,b,v)=>`rgb(${a.map((n,i)=>Math.round(mix(n,b[i],v))).join(' ')})`;
 let top=0,distance=1,w=0,h=0,ar={x:0,y:0,width:1,height:1},dpr=1;
 let target=0,p=0,raf=0,last=0,active=-1,visible=true,px=0,py=0,tx=0,ty=0,copyMode=-1;
 document.documentElement.classList.add('native-ready','motion-opt-in');
 function measure(){
  top=root.getBoundingClientRect().top+scrollY;distance=Math.max(1,root.offsetHeight-pin.offsetHeight);
  const r=pin.getBoundingClientRect();w=r.width;h=r.height;
  ar={x:art.offsetLeft,y:art.offsetTop,width:art.offsetWidth,height:art.offsetHeight};dpr=Math.min(devicePixelRatio||1,1.5);
  canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx?.setTransform(dpr,0,0,dpr,0,0);scroll();
 }
 function start(){if(!raf&&visible&&!document.hidden)raf=requestAnimationFrame(render);}
 function scroll(){target=clamp((scrollY-top)/distance);header?.classList.toggle('has-scrolled',scrollY>35);start();}
 function weights(v){return scenes.map((_,i)=>{
  const enter=i?smooth(range(v,bounds[i-1]-.035,bounds[i-1]+.035)):1;
  const exit=i<6?smooth(range(v,bounds[i]-.035,bounds[i]+.035)):0;return{enter,exit,alpha:enter*(1-exit)};
 });}
 function draw(time,pts,vis){
  if(!ctx)return;ctx.clearRect(0,0,w,h);
  const cx=ar.x+ar.width*.5+px*8,cy=ar.y+ar.height*.45+py*6;
  const network=vis[1].alpha+vis[2].alpha,ambient=clamp(network+vis[3].alpha*.35+vis[4].alpha*.18);
  ctx.save();
  for(let k=0;k<34;k++){
   const x=((k*137.67+time*.003*(k%3+1))%w),y=h*.15+((k*83.31-time*.0012)%(h*.72)+h*.72)%(h*.72);
   ctx.globalAlpha=(.04+(k%4)*.035)*(1-vis[5].alpha);ctx.fillStyle=k%4?'#d2f07b':'#e6f0dc';ctx.fillRect(x,y,k%7?1:2,k%7?1:2);
  }
  // A rotating, projected sphere makes the hub spatial rather than a flat icon.
  const globe=[];const sphereAlpha=network*.55+vis[6].alpha*.2;
  const radius=Math.min(ar.width*.29,ar.height*.48);
  for(let k=0;k<40;k++){
   const u=(k+.5)/40,phi=Math.acos(1-2*u),theta=k*2.39996+time*.00012+p*3;
   const x=Math.sin(phi)*Math.cos(theta),y=Math.cos(phi),z=Math.sin(phi)*Math.sin(theta),scale=1+z*.18;
   globe.push({x:cx+x*radius*scale,y:cy+y*radius*.74*scale,z});
  }
  ctx.strokeStyle='#b8dc83';ctx.lineWidth=.7;
  for(let i=0;i<globe.length;i++){
   const a=globe[i];ctx.globalAlpha=sphereAlpha*(.16+(a.z+1)*.2);ctx.fillStyle='#d2f07b';ctx.beginPath();ctx.arc(a.x,a.y,1.2+(a.z+1)*.6,0,Math.PI*2);ctx.fill();
   for(let j=i+1;j<globe.length;j++){
    const b=globe[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d>radius*.48)continue;
    ctx.globalAlpha=sphereAlpha*.09;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
   }
  }
  for(let k=0;k<3;k++){
   ctx.globalAlpha=network*(.10-k*.02);ctx.beginPath();ctx.ellipse(cx,cy,ar.width*(.23+k*.11),ar.height*(.18+k*.10),-.3+p*.7,0,Math.PI*2);ctx.stroke();
  }
  const consult=smooth(range(p,.25,.37));const links=consult<.5?pts.map(n=>[{x:cx,y:cy},n]):[[pts[0],pts[1]],[pts[1],pts[2]]];
  for(let k=0;k<links.length;k++){
   const [a,b]=links[k],bend=(1-consult)*55;ctx.globalAlpha=network*.32;ctx.lineWidth=1;
   ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.bezierCurveTo(a.x+bend,a.y+(b.y-a.y)*.3,b.x-bend,b.y-(b.y-a.y)*.3,b.x,b.y);ctx.stroke();
   for(let j=0;j<3;j++){
    const t=(time*.00014+k*.23+j/3)%1,u=1-t;
    const x=u*u*u*a.x+3*u*u*t*(a.x+bend)+3*u*t*t*(b.x-bend)+t*t*t*b.x;
    const y=u*u*u*a.y+3*u*u*t*(a.y+(b.y-a.y)*.3)+3*u*t*t*(b.y-(b.y-a.y)*.3)+t*t*t*b.y;
    ctx.globalAlpha=network*.8;ctx.shadowBlur=8;ctx.shadowColor='#d2f07b';ctx.fillStyle='#dcff9c';ctx.beginPath();ctx.arc(x,y,1.8,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
   }
  }
  // The developer phase sends a packet across the editor's edges.
  if(ambient>0){ctx.globalAlpha=vis[3].alpha*.4;const t=(time*.00012)%1;ctx.fillStyle='#d2f07b';ctx.fillRect(ar.x+t*ar.width,ar.y+ar.height*.95,20,1);}
  ctx.restore();
 }
 function render(time){
  raf=0;const gap=time-(last||time-16.7),dt=Math.min(45,gap);
  if(gap>120||(!last&&Math.abs(target-p)>.015))p=target;last=time;
  if(Math.abs(target-p)>.25)p=target;p=mix(p,target,1-Math.pow(.82,dt/16.7));if(Math.abs(target-p)<.00005)p=target;
  px=mix(px,tx,.07);py=mix(py,ty,.07);const v=weights(p);let next=0;v.forEach((x,i)=>{if(x.alpha>v[next].alpha)next=i;});
  scenes.forEach((scene,i)=>{
   const {enter,exit,alpha}=v[i];scene.style.setProperty('--alpha',alpha.toFixed(4));scene.style.setProperty('--enter',(1-enter).toFixed(4));scene.style.setProperty('--exit',exit.toFixed(4));
   for(const [key,delay] of [['--enter-late',.009],['--enter-later',.018]])scene.style.setProperty(key,i?(1-smooth(range(p,bounds[i-1]-.035+delay,bounds[i-1]+.035+delay))).toFixed(4):'0');
  });
  const human=v[5].alpha,photo=clamp(v[0].alpha+v[6].alpha*(innerWidth>=1000?.82:.30)),shift=smooth(range(p,.065,.23))*(1-v[6].alpha);
  const params={'p':p,'photo':photo,'photo-shift':shift,'art':clamp(v.slice(1,6).reduce((s,x)=>s+x.alpha,0)),'core':v[1].alpha+v[2].alpha*.25,'nodes':v[1].alpha+v[2].alpha,'editor':v[3].alpha,'workflow':v[4].alpha,'human':human,'code-progress':smooth(range(p,.43,.58)),'task':smooth(range(p,.61,.65)),'pointer-x':px,'pointer-y':py};
  for(const [k,x] of Object.entries(params))pin.style.setProperty('--'+k,x.toFixed(4));
  pin.style.setProperty('--stage-bg',color([16,17,19],[210,240,123],human));pin.style.setProperty('--stage-ink',color([244,241,235],[28,39,19],human));pin.style.setProperty('--stage-muted',color([168,176,162],[64,84,43],human));pin.style.setProperty('--accent-ink',color([210,240,123],[28,39,19],human));
  if(next!==active){active=next;root.dataset.scene=next;scenes.forEach((s,i)=>{s.inert=i!==next;s.setAttribute('aria-hidden',String(i!==next));});steps.forEach((b,i)=>i===next?b.setAttribute('aria-current','step'):b.removeAttribute('aria-current'));label.textContent=next===6?'CONTINUE A DESCOBRIR':'ROLE PARA EXPLORAR';}
  const mode=p>.27?1:0;if(mode!==copyMode){copyMode=mode;const data=mode?consultCopy:nodeCopy;nodes.forEach((n,i)=>{n.querySelector('small').textContent=data[i][0];n.querySelector('strong').textContent=data[i][1];n.querySelector('p').textContent=data[i][2];});}
  const consult=smooth(range(p,.25,.37)),points=[];const orbit=[[.19,.1],[.82,.46],[.26,.87]];
  nodes.forEach((n,i)=>{
   const x=mix(ar.width*orbit[i][0],ar.width*.5,consult),y=mix(ar.height*orbit[i][1],ar.height*[.08,.50,.92][i],consult);
   const bob=Math.sin(time*.00065+i*1.8)*(1-consult)*5;
   n.style.transform=`translate3d(calc(-50% + ${x-ar.width/2+px*4}px),calc(-50% + ${y-ar.height/2+bob+py*3}px),${(1-consult)*[15,50,5][i]}px) rotateZ(${mix([-8,7,-4][i],0,consult)}deg) rotateY(${(1-consult)*[-10,12,-6][i]+px*3}deg) scale(${mix(.92,innerWidth>=1000?1.04:1,consult)})`;
   points.push({x:ar.x+x,y:ar.y+y+bob});
  });
  draw(time,points,v);
  if(visible&&!document.hidden)start();
 }
 steps.forEach((b,i)=>b.addEventListener('click',()=>scrollTo({top:top+centers[i]*distance,behavior:'smooth'})));
 addEventListener('scroll',scroll,{passive:true});addEventListener('resize',measure,{passive:true});addEventListener('pageshow',measure);
 pin.addEventListener('pointermove',e=>{if(!matchMedia('(pointer:fine)').matches)return;tx=(e.clientX/innerWidth-.5)*2;ty=(e.clientY/innerHeight-.5)*2;start();},{passive:true});pin.addEventListener('pointerleave',()=>{tx=ty=0;},{passive:true});
 document.addEventListener('visibilitychange',()=>{last=0;if(!document.hidden)start();});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){last=0;start();}},{rootMargin:'50px'}).observe(root);
 new ResizeObserver(measure).observe(pin);
 document.fonts.ready.then(measure);root.querySelector('img').addEventListener('load',measure,{once:true});measure();
})();
