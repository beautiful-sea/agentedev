(() => {
 'use strict';
 const story=document.querySelector('.cinema'),pin=story?.querySelector('.story-pin');
 if(!story||!pin)return;
 const scenes=[...story.querySelectorAll('[data-story-scene]')],steps=[...story.querySelectorAll('[data-story-step]')];
 const cards=[...story.querySelectorAll('[data-node]')],visual=story.querySelector('.cinema-visual');
 const canvas=document.querySelector('#connection-canvas'),ctx=canvas.getContext('2d',{alpha:true});
 const motion=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(pointer:fine)');
 let optIn=true,top=0,distance=1,target=0,progress=0,last=0,frame=0,active=-1,visible=true;
 let vw=0,vh=0,dpr=1,px=0,py=0,tx=0,ty=0;
 const clamp=v=>Math.max(0,Math.min(1,v));
 const range=(v,a,b)=>clamp((v-a)/(b-a));
 const smooth=v=>v*v*(3-2*v);
 const mix=(a,b,t)=>a+(b-a)*t;
 const reduced=()=>motion.matches&&!optIn;
 const button=document.createElement('button');button.type='button';button.className='motion-choice';button.textContent='Ativar experiência animada';button.hidden=true;pin.append(button);
 button.addEventListener('click',()=>{optIn=true;document.documentElement.classList.add('motion-opt-in');button.hidden=true;measure();});
 document.documentElement.classList.add('story-ready','motion-opt-in');
 function scroll(){target=reduced()?0:clamp((scrollY-top)/distance);document.querySelector('.header').classList.toggle('has-scrolled',scrollY>35);start();}
 function measure(){top=story.getBoundingClientRect().top+scrollY;distance=Math.max(1,story.offsetHeight-pin.offsetHeight);const r=visual.getBoundingClientRect();vw=r.width;vh=r.height;dpr=Math.min(devicePixelRatio||1,1.7);canvas.width=Math.round((vw+100)*dpr);canvas.height=Math.round((vh+100)*dpr);ctx?.setTransform(dpr,0,0,dpr,0,0);scroll();}
 function start(){if(!frame)frame=requestAnimationFrame(render);}
 function draw(time,nodes,network,build,finish){
  if(!ctx)return;const w=vw+100,h=vh+100;ctx.clearRect(0,0,w,h);if(reduced()||!visible)return;
  const cx=vw*.5+50,cy=vh*.46+50;
  // Perspective rings open as the visitor moves from the portrait to the network.
  ctx.save();ctx.globalAlpha=(1-finish)*network;ctx.strokeStyle='#d2f07b';ctx.lineWidth=.7;
  for(let k=0;k<3;k++){ctx.globalAlpha=(1-finish)*network*(.10-k*.02)*(1-build*.7);ctx.beginPath();ctx.ellipse(cx,cy,vw*(.24+k*.12),vh*(.18+k*.10),-.35+progress*.65,0,Math.PI*2);ctx.stroke();}
  for(let k=0;k<26;k++){const x=50+((k*97.3+time*.002*(k%3+1))%vw),y=50+((k*53.7+time*.001)%vh);ctx.globalAlpha=(.07+(k%4)*.025)*(1-finish)*network;ctx.fillStyle=k%3?'#d2f07b':'#edf4df';ctx.fillRect(x,y,k%5===0?2:1,k%5===0?2:1);}
  const points=nodes.map(n=>({x:n.x+50,y:n.y+50}));
  const links=build<.5?points.map(n=>[{x:cx,y:cy},n]):[[points[0],points[1]],[points[1],points[2]]];
  for(let i=0;i<links.length;i++){const [a,b]=links[i],bend=(1-build)*50;ctx.globalAlpha=(1-finish)*(.32+build*.15);ctx.lineWidth=1;ctx.strokeStyle='#c2df91';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.bezierCurveTo(a.x+bend,a.y+(b.y-a.y)*.35,b.x-bend,b.y-(b.y-a.y)*.35,b.x,b.y);ctx.stroke();
   for(let j=0;j<3;j++){const t=((time*.00014+i*.23+j/3)%1),u=1-t;const x=u*u*u*a.x+3*u*u*t*(a.x+bend)+3*u*t*t*(b.x-bend)+t*t*t*b.x,y=u*u*u*a.y+3*u*u*t*(a.y+(b.y-a.y)*.35)+3*u*t*t*(b.y-(b.y-a.y)*.35)+t*t*t*b.y;ctx.globalAlpha=(1-finish)*.8;ctx.shadowBlur=9;ctx.shadowColor='#d2f07b';ctx.fillStyle='#dfffb0';ctx.beginPath();ctx.arc(x,y,1.5,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}
  }ctx.restore();
 }
 function render(time){
  frame=0;const dt=Math.min(40,time-(last||time-16.7));last=time;
  if(Math.abs(progress-target)>.18)progress=target;const ease=reduced()?1:1-Math.pow(.84,dt/16.7);progress=mix(progress,target,ease);if(Math.abs(progress-target)<.00008)progress=target;
  px=mix(px,tx,.08);py=mix(py,ty,.08);
  const p=progress,intro=smooth(range(p,.055,.26)),network=smooth(range(p,.28,.43)),build=smooth(range(p,.43,.64)),finish=smooth(range(p,.73,.88));
  const visibility=[1-smooth(range(p,.12,.24)),smooth(range(p,.20,.29))*(1-smooth(range(p,.43,.53))),smooth(range(p,.49,.59))*(1-smooth(range(p,.72,.81))),smooth(range(p,.77,.89))];
  const starts=[-.1,.20,.49,.77],ends=[.12,.43,.72,1.2];
  const v=reduced()?0:smooth(range(p,.18,.29))*(1-finish);
  for(const [key,value] of Object.entries({progress:p,intro,network,build,finish,'portrait-out':smooth(range(p,.18,.31)),visual:v,'pointer-x':px,'pointer-y':py}))pin.style.setProperty('--'+key,value.toFixed(4));
  scenes.forEach((scene,i)=>{scene.style.setProperty('--visibility',visibility[i].toFixed(4));scene.style.setProperty('--enter',(i?1-smooth(range(p,starts[i],starts[i]+.09)):0).toFixed(4));scene.style.setProperty('--enter-late',(i?1-smooth(range(p,starts[i]+.012,starts[i]+.105)):0).toFixed(4));scene.style.setProperty('--enter-later',(i?1-smooth(range(p,starts[i]+.024,starts[i]+.12)):0).toFixed(4));scene.style.setProperty('--exit',smooth(range(p,ends[i],ends[i]+.12)).toFixed(4));});
  const next=reduced()?0:p<.24?0:p<.53?1:p<.81?2:3;
  if(next!==active){active=next;story.dataset.scene=String(next);scenes.forEach((s,i)=>{s.inert=i!==next;s.setAttribute('aria-hidden',String(i!==next));});steps.forEach((s,i)=>i===next?s.setAttribute('aria-current','step'):s.removeAttribute('aria-current'));document.querySelector('#scroll-label').textContent=next===3?'CONTINUE A DESCOBRIR':'ROLE PARA EXPLORAR';}
  const positions=[[.23,.16],[.78,.43],[.30,.83]],pipeline=[.12,.49,.86];
  const nodes=cards.map((card,i)=>{const x=mix(vw*positions[i][0],vw*.5,build),y=mix(vh*positions[i][1],vh*pipeline[i],build);const wide=innerWidth>=900;const rz=mix([-9,7,-5][i],0,build),ry=(1-build)*[-10,12,-6][i]+px*3;card.style.transform=`translate3d(calc(-50% + ${x-vw*.5+px*5}px),calc(-50% + ${y-vh*.5+py*4}px),${(1-build)*[25,60,5][i]}px) rotateZ(${rz}deg) rotateY(${ry}deg) scale(${mix(.92,wide?1.08:(innerHeight<=700?1.18:1.38),build)})`;return{x,y};});
  draw(time,nodes,network,build,finish);
  // Continue only while the story is visible; no global wheel/touch interception.
  if((visible&&!reduced()&&!document.hidden)||Math.abs(progress-target)>.00008)start();
 }
 steps.forEach((b,i)=>b.addEventListener('click',()=>scrollTo({top:top+[0,.34,.64,.95][i]*distance,behavior:reduced()?'instant':'smooth'})));
 addEventListener('scroll',scroll,{passive:true});addEventListener('resize',measure,{passive:true});addEventListener('pageshow',measure);
 pin.addEventListener('pointermove',e=>{if(!fine.matches||reduced())return;tx=(e.clientX/innerWidth-.5)*2;ty=(e.clientY/innerHeight-.5)*2;start();},{passive:true});pin.addEventListener('pointerleave',()=>{tx=ty=0;},{passive:true});
 motion.addEventListener('change',()=>{button.hidden=!motion.matches||optIn;measure();});document.addEventListener('visibilitychange',()=>{last=0;if(!document.hidden)start();});
 new ResizeObserver(measure).observe(story);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start();},{rootMargin:'100px'}).observe(story);
 const reveal=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('is-visible');reveal.unobserve(e.target);}},{threshold:.08,rootMargin:'0px 0px -20px'});document.querySelectorAll('[data-reveal]').forEach(s=>reveal.observe(s));
 document.fonts.ready.then(measure);document.querySelector('#personal-portrait').addEventListener('load',measure,{once:true});measure();
})();