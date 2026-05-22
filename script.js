/* ── CURSOR ── */
const cur=document.getElementById('cursor'),ring=document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  cur.style.transform=`translate(${mx-5}px,${my-5}px)`;
  rx+=(mx-rx)*.12;ry+=(my-ry)*.12;
  ring.style.transform=`translate(${rx-18}px,${ry-18}px)`;
});
document.querySelectorAll('a,button,.project-card,.filter-btn').forEach(el=>{
  el.addEventListener('mouseenter',()=>{ring.style.width='56px';ring.style.height='56px';ring.style.borderColor='rgba(91,140,255,.9)'});
  el.addEventListener('mouseleave',()=>{ring.style.width='36px';ring.style.height='36px';ring.style.borderColor='rgba(91,140,255,.5)'});
});
function updateRing(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ring.style.transform=`translate(${rx-18}px,${ry-18}px)`;requestAnimationFrame(updateRing)}
updateRing();
 
/* ── STARS ── */
const sc=document.getElementById('stars-canvas'),sctx=sc.getContext('2d');
let stars=[];
function initStars(){
  sc.width=window.innerWidth;sc.height=window.innerHeight;
  stars=[];
  for(let i=0;i<260;i++){
    stars.push({x:Math.random()*sc.width,y:Math.random()*sc.height,r:Math.random()*1.4+.2,speed:Math.random()*.3+.05,twinkle:Math.random()*Math.PI*2,bright:Math.random()});
  }
}
function drawStars(){
  sctx.clearRect(0,0,sc.width,sc.height);
  const t=Date.now()/1000;
  stars.forEach(s=>{
    const a=.3+.5*(Math.sin(t*1.2+s.twinkle)*0.5+0.5)*s.bright;
    sctx.beginPath();sctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    sctx.fillStyle=`rgba(200,210,255,${a})`;sctx.fill();
    s.y+=s.speed;if(s.y>sc.height){s.y=0;s.x=Math.random()*sc.width}
  });
  requestAnimationFrame(drawStars);
}
initStars();drawStars();
window.addEventListener('resize',initStars);
 
/* ── NAV SCROLL ── */
window.addEventListener('scroll',()=>{
  document.getElementById('navbar').classList.toggle('scrolled',scrollY>60);
});
 
/* ── REVEAL ── */
const revObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revObs.unobserve(e.target);}});
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>revObs.observe(el));
 
/* ── COUNTER ANIMATION ── */
function animCount(id,target,dur){
  const el=document.getElementById(id);let start=0,prev=null;
  function step(ts){
    if(!prev)prev=ts;
    const p=Math.min((ts-prev)/dur,1);
    const eased=1-Math.pow(1-p,3);
    el.textContent=Math.round(eased*target);
    if(p<1)requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const statsObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      animCount('c1',15,1400);animCount('c2',892,1600);animCount('c3',47,1500);animCount('c4',84,1800);
      statsObs.unobserve(e.target);
    }
  });
},{threshold:.4});
statsObs.observe(document.querySelector('.stats'));
 
/* ── PROGRESS BARS ── */
const progObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.querySelectorAll('.progress-fill').forEach(bar=>{
        bar.style.width=bar.dataset.w+'%';
      });
    }
  });
},{threshold:.3});
document.querySelectorAll('.project-card').forEach(c=>progObs.observe(c));
 
/* ── FILTERS ── */
document.querySelectorAll('.filter-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const f=btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card=>{
      const match=f==='all'||card.dataset.cat===f;
      card.style.transition='all .35s';
      card.style.opacity=match?'1':'.2';
      card.style.transform=match?'':'scale(.97)';
    });
  });
});
 
/* ── CANVAS VISUALS ── */
function makeNebula(id){
  const c=document.getElementById(id);if(!c)return;
  const ctx=c.getContext('2d');
  c.width=c.offsetWidth||600;c.height=c.offsetHeight||300;
  const W=c.width,H=c.height;
  function draw(){
    ctx.clearRect(0,0,W,H);
    const t=Date.now()/4000;
    // clouds
    for(let i=0;i<6;i++){
      const gx=W*.3+Math.sin(t+i)*W*.25,gy=H*.5+Math.cos(t*.7+i)*H*.2;
      const g=ctx.createRadialGradient(gx,gy,0,gx,gy,W*.35);
      const colors=['rgba(91,60,200,',`rgba(167,100,250,`,'rgba(60,100,200,','rgba(200,60,140,','rgba(40,140,200,','rgba(100,60,180,'];
      g.addColorStop(0,colors[i%colors.length]+(0.12+Math.sin(t+i*.7)*.04)+')');
      g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    }
    // stars
    ctx.fillStyle='rgba(255,255,255,0.9)';
    for(let i=0;i<60;i++){
      const bx=(Math.sin(i*137.5)*0.5+0.5)*W,by=(Math.cos(i*97.3)*0.5+0.5)*H;
      const br=.5+Math.sin(t*3+i)*.4;
      ctx.beginPath();ctx.arc(bx,by,br,0,Math.PI*2);ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
}
 
function makeOrbit(id){
  const c=document.getElementById(id);if(!c)return;
  const ctx=c.getContext('2d');
  c.width=c.offsetWidth||600;c.height=c.offsetHeight||300;
  const W=c.width,H=c.height,cx=W/2,cy=H/2;
  function draw(){
    ctx.clearRect(0,0,W,H);
    const t=Date.now()/1000;
    // center star
    const sg=ctx.createRadialGradient(cx,cy,0,cx,cy,40);
    sg.addColorStop(0,'rgba(255,200,80,.9)');sg.addColorStop(.4,'rgba(255,140,30,.4)');sg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=sg;ctx.fillRect(0,0,W,H);
    ctx.beginPath();ctx.arc(cx,cy,12,0,Math.PI*2);ctx.fillStyle='rgba(255,200,80,1)';ctx.fill();
    // orbits
    [[55,.6,'#5b8cff',.5],[90,.35,'#a78bfa',.4],[130,.22,'#34d399',.3]].forEach(([r,speed,col,a],i)=>{
      ctx.beginPath();ctx.ellipse(cx,cy,r,r*.38,0,0,Math.PI*2);
      ctx.strokeStyle=`rgba(255,255,255,.08)`;ctx.lineWidth=1;ctx.setLineDash([4,8]);ctx.stroke();ctx.setLineDash([]);
      const angle=t*speed*(i%2?1:-1);
      const px=cx+r*Math.cos(angle),py=cy+r*.38*Math.sin(angle);
      ctx.beginPath();ctx.arc(px,py,i===0?6:i===1?5:4,0,Math.PI*2);
      ctx.fillStyle=col;ctx.fill();
      // trail
      for(let j=1;j<=8;j++){
        const ta=angle-j*.12*(i%2?1:-1);
        const tx2=cx+r*Math.cos(ta),ty2=cy+r*.38*Math.sin(ta);
        ctx.beginPath();ctx.arc(tx2,ty2,1.5,0,Math.PI*2);
        ctx.fillStyle=col.replace(')',`,${a*(1-j/8)})`).replace('#','rgba(').replace(/[^rgba(,\d.)]/g,'');
        ctx.fillStyle=`${col}${Math.round((1-j/8)*60).toString(16).padStart(2,'0')}`;
        ctx.fill();
      }
    });
    requestAnimationFrame(draw);
  }
  draw();
}
 
function makePulse(id){
  const c=document.getElementById(id);if(!c)return;
  const ctx=c.getContext('2d');
  c.width=c.offsetWidth||400;c.height=c.offsetHeight||220;
  const W=c.width,H=c.height;
  function draw(){
    ctx.clearRect(0,0,W,H);
    const t=Date.now()/1000;
    ctx.strokeStyle='rgba(52,211,153,.7)';ctx.lineWidth=1.5;
    ctx.beginPath();
    for(let x=0;x<W;x++){
      const nx=x/W*8-t*2;
      let y=H/2;
      y+=Math.sin(nx*Math.PI)*30*Math.exp(-Math.pow((nx%1-.5)*3,2));
      y+=Math.sin(nx*Math.PI*3)*.8*(Math.random()-.5)*3;
      x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.stroke();
    // glow dots
    for(let i=0;i<3;i++){
      const bx=(((t*.6+i*.33)%1)*W);
      const by=H/2+Math.sin(bx/W*8*Math.PI)*25;
      const g=ctx.createRadialGradient(bx,by,0,bx,by,15);
      g.addColorStop(0,'rgba(52,211,153,.6)');g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=g;ctx.fillRect(bx-15,by-15,30,30);
    }
    requestAnimationFrame(draw);
  }
  draw();
}
 
function makeGalaxy(id){
  const c=document.getElementById(id);if(!c)return;
  const ctx=c.getContext('2d');
  c.width=c.offsetWidth||400;c.height=c.offsetHeight||220;
  const W=c.width,H=c.height;
  const pts=[];
  for(let i=0;i<350;i++){
    const arm=Math.floor(Math.random()*3);
    const r=Math.random()*.45*Math.min(W,H);
    const base=arm*(Math.PI*2/3);
    const angle=base+r/(.45*Math.min(W,H))*Math.PI*1.5+(Math.random()-.5)*.5;
    pts.push({x:W/2+r*Math.cos(angle),y:H/2+r*.6*Math.sin(angle),r:Math.random()*1.5+.3,a:Math.random()*.8+.2});
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    const t=Date.now()/8000;
    ctx.save();ctx.translate(W/2,H/2);ctx.rotate(t);ctx.translate(-W/2,-H/2);
    pts.forEach(p=>{
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      const hue=250+p.a*60;
      ctx.fillStyle=`hsla(${hue},80%,75%,${p.a})`;ctx.fill();
    });
    // core
    const g=ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,30);
    g.addColorStop(0,'rgba(200,180,255,.9)');g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g;ctx.fillRect(W/2-30,H/2-30,60,60);
    ctx.restore();
    requestAnimationFrame(draw);
  }
  draw();
}
 
function makeRadar(id){
  const c=document.getElementById(id);if(!c)return;
  const ctx=c.getContext('2d');
  c.width=c.offsetWidth||400;c.height=c.offsetHeight||220;
  const W=c.width,H=c.height,cx=W/2,cy=H/2,R=Math.min(W,H)*.42;
  const blips=[{a:.4,r:.6,life:1},{a:2.1,r:.4,life:.5},{a:3.8,r:.75,life:.7},{a:1.2,r:.85,life:.3}];
  function draw(){
    ctx.clearRect(0,0,W,H);
    const t=Date.now()/1000;
    // grid
    for(let i=1;i<=4;i++){
      ctx.beginPath();ctx.arc(cx,cy,R*i/4,0,Math.PI*2);
      ctx.strokeStyle='rgba(52,211,153,.1)';ctx.lineWidth=1;ctx.stroke();
    }
    for(let i=0;i<6;i++){
      const a=i*Math.PI/3;ctx.beginPath();ctx.moveTo(cx,cy);
      ctx.lineTo(cx+R*Math.cos(a),cy+R*Math.sin(a));
      ctx.strokeStyle='rgba(52,211,153,.08)';ctx.stroke();
    }
    // sweep
    const sa=(t*.8)%(Math.PI*2);
    const sg=ctx.createConicalGradient?null:null;
    ctx.save();ctx.translate(cx,cy);
    const sweep=ctx.createLinearGradient(0,0,R*Math.cos(sa),R*Math.sin(sa));
    sweep.addColorStop(0,'rgba(52,211,153,.35)');sweep.addColorStop(1,'rgba(52,211,153,0)');
    ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,R,sa,sa+.8);ctx.fillStyle=sweep;ctx.fill();
    ctx.restore();
    // sweep line
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+R*Math.cos(sa),cy+R*Math.sin(sa));
    ctx.strokeStyle='rgba(52,211,153,.8)';ctx.lineWidth=1.5;ctx.stroke();
    // blips
    blips.forEach(b=>{
      const bx=cx+R*b.r*Math.cos(b.a),by=cy+R*b.r*Math.sin(b.a);
      const diff=((sa-b.a)%(Math.PI*2)+Math.PI*2)%(Math.PI*2);
      const intensity=diff<1?1-diff:0;
      if(intensity>.01){
        ctx.beginPath();ctx.arc(bx,by,3,0,Math.PI*2);
        ctx.fillStyle=`rgba(52,211,153,${intensity})`;ctx.fill();
      }
    });
    requestAnimationFrame(draw);
  }
  draw();
}
 
function makeSolar(id){
  const c=document.getElementById(id);if(!c)return;
  const ctx=c.getContext('2d');
  c.width=c.offsetWidth||400;c.height=c.offsetHeight||220;
  const W=c.width,H=c.height;
  // solar wind particles
  const pts=Array.from({length:80},()=>({x:Math.random()*W*.3,y:Math.random()*H,vx:Math.random()*3+1,vy:(Math.random()-.5)*.5,life:Math.random()}));
  function draw(){
    ctx.clearRect(0,0,W,H);
    const t=Date.now()/1000;
    // sun
    const sg=ctx.createRadialGradient(60,H/2,0,60,H/2,80);
    sg.addColorStop(0,'rgba(255,220,80,1)');sg.addColorStop(.3,'rgba(255,140,30,.6)');sg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=sg;ctx.fillRect(0,0,W,H);
    // flares
    for(let i=0;i<4;i++){
      const fa=t*.5+i*1.5;
      ctx.beginPath();ctx.moveTo(60,H/2);
      ctx.quadraticCurveTo(60+Math.cos(fa)*50,H/2+Math.sin(fa)*50,60+Math.cos(fa+.5)*80,H/2+Math.sin(fa+.5)*80);
      ctx.strokeStyle='rgba(255,180,30,.3)';ctx.lineWidth=2;ctx.stroke();
    }
    // particles (sail)
    pts.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;
      if(p.x>W){p.x=0;p.y=Math.random()*H}
      ctx.beginPath();ctx.arc(p.x,p.y,p.life*.8+.3,0,Math.PI*2);
      ctx.fillStyle=`rgba(255,220,100,${p.life*.4})`;ctx.fill();
    });
    // sail
    const sx=W*.7,sy=H/2;
    ctx.save();ctx.translate(sx,sy);
    ctx.beginPath();ctx.moveTo(-20,-50);ctx.lineTo(20,-50);ctx.lineTo(30,50);ctx.lineTo(-30,50);ctx.closePath();
    ctx.strokeStyle='rgba(200,220,255,.6)';ctx.lineWidth=1.5;ctx.stroke();
    ctx.fillStyle='rgba(150,180,255,.1)';ctx.fill();
    ctx.restore();
    requestAnimationFrame(draw);
  }
  draw();
}
 
function makeWorm(id){
  const c=document.getElementById(id);if(!c)return;
  const ctx=c.getContext('2d');
  c.width=c.offsetWidth||400;c.height=c.offsetHeight||220;
  const W=c.width,H=c.height;
  function draw(){
    ctx.clearRect(0,0,W,H);
    const t=Date.now()/1500;
    const cx=W/2,cy=H/2;
    // accretion disc glow
    for(let r=80;r>10;r-=5){
      const g=ctx.createRadialGradient(cx,cy,r-5,cx,cy,r);
      const a=.015*(80-r)/80;
      g.addColorStop(0,'rgba(100,80,200,0)');g.addColorStop(1,`rgba(140,100,255,${a})`);
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    }
    // rings (wormhole)
    for(let i=5;i>=1;i--){
      const radius=i*18+Math.sin(t)*5;
      const stretch=.35+Math.sin(t*.7)*.05;
      ctx.save();ctx.translate(cx,cy);
      ctx.beginPath();ctx.ellipse(0,0,radius,radius*stretch,0,0,Math.PI*2);
      ctx.strokeStyle=`rgba(${100+i*30},${60+i*20},255,${.15+i*.06})`;
      ctx.lineWidth=2;ctx.stroke();ctx.restore();
    }
    // center void
    const vg=ctx.createRadialGradient(cx,cy,0,cx,cy,22);
    vg.addColorStop(0,'rgba(0,0,5,1)');vg.addColorStop(.7,'rgba(20,10,50,.8)');vg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=vg;ctx.beginPath();ctx.arc(cx,cy,28,0,Math.PI*2);ctx.fill();
    // light ring
    ctx.beginPath();ctx.arc(cx,cy,20,0,Math.PI*2);
    ctx.strokeStyle='rgba(160,120,255,.9)';ctx.lineWidth=1.5;ctx.stroke();
    requestAnimationFrame(draw);
  }
  draw();
}
 
function makeQuantum(id){
  const c=document.getElementById(id);if(!c)return;
  const ctx=c.getContext('2d');
  c.width=c.offsetWidth||400;c.height=c.offsetHeight||220;
  const W=c.width,H=c.height;
  const nodes=Array.from({length:16},(_,i)=>({
    x:W/2+(Math.cos(i/16*Math.PI*2)*W*.35),
    y:H/2+(Math.sin(i/16*Math.PI*2)*H*.38),
    phase:i/16*Math.PI*2
  }));
  function draw(){
    ctx.clearRect(0,0,W,H);
    const t=Date.now()/1000;
    // connections
    nodes.forEach((n,i)=>{
      nodes.forEach((m,j)=>{
        if(j<=i)return;
        if(Math.random()>.7)return;
        const a=.05+.08*Math.sin(t+n.phase+m.phase);
        ctx.beginPath();ctx.moveTo(n.x,n.y);ctx.lineTo(m.x,m.y);
        ctx.strokeStyle=`rgba(91,140,255,${a})`;ctx.lineWidth=.5;ctx.stroke();
      });
    });
    // nodes
    nodes.forEach(n=>{
      const pulse=.5+.5*Math.sin(t*2+n.phase);
      ctx.beginPath();ctx.arc(n.x,n.y,3+pulse*2,0,Math.PI*2);
      ctx.fillStyle=`rgba(91,140,255,${.5+pulse*.4})`;ctx.fill();
      // glow
      const g=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,12);
      g.addColorStop(0,`rgba(91,140,255,${.2*pulse})`);g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=g;ctx.fillRect(n.x-12,n.y-12,24,24);
    });
    // center
    const cg=ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,40);
    cg.addColorStop(0,'rgba(167,139,250,.3)');cg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=cg;ctx.fillRect(W/2-40,H/2-40,80,80);
    requestAnimationFrame(draw);
  }
  draw();
}
 
function makeWave(id){
  const c=document.getElementById(id);if(!c)return;
  const ctx=c.getContext('2d');
  c.width=c.offsetWidth||400;c.height=c.offsetHeight||220;
  const W=c.width,H=c.height;
  function draw(){
    ctx.clearRect(0,0,W,H);
    const t=Date.now()/1000;
    [1,.6,.35].forEach((a,layer)=>{
      ctx.beginPath();
      for(let x=0;x<=W;x+=2){
        const nx=x/W;
        const y=H/2+Math.sin(nx*8*Math.PI+t*(1.2-layer*.3))*22*(1-layer*.2)+
                Math.sin(nx*14*Math.PI-t*(.8+layer*.2))*8;
        x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }
      const colors=['rgba(34,211,238,','rgba(91,140,255,','rgba(167,139,250,'];
      ctx.strokeStyle=colors[layer]+a+')';ctx.lineWidth=1.5-layer*.3;ctx.stroke();
      // fill
      ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.closePath();
      ctx.fillStyle=colors[layer]+(a*.05)+')';ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}
 
function makeAstro(id){
  const c=document.getElementById(id);if(!c)return;
  const ctx=c.getContext('2d');
  c.width=c.offsetWidth||400;c.height=c.offsetHeight||220;
  const W=c.width,H=c.height;
  // spore particles
  const spores=Array.from({length:50},()=>({
    x:Math.random()*W,y:Math.random()*H,
    vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.3,
    r:Math.random()*2+.5,life:Math.random(),
    color:`hsl(${120+Math.random()*60},70%,60%)`
  }));
  function draw(){
    ctx.clearRect(0,0,W,H);
    const t=Date.now()/3000;
    // background planet
    const pg=ctx.createRadialGradient(W*.6,H*.55,0,W*.6,H*.55,70);
    pg.addColorStop(0,'rgba(40,120,60,.5)');pg.addColorStop(.5,'rgba(20,80,40,.3)');pg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=pg;ctx.fillRect(0,0,W,H);
    ctx.beginPath();ctx.arc(W*.6,H*.55,60,0,Math.PI*2);
    ctx.strokeStyle='rgba(40,180,80,.2)';ctx.lineWidth=1;ctx.stroke();
    // spores
    spores.forEach(s=>{
      s.x+=s.vx;s.y+=s.vy;
      if(s.x<0)s.x=W;if(s.x>W)s.x=0;if(s.y<0)s.y=H;if(s.y>H)s.y=0;
      ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle=s.color.replace(')',`,${s.life*.7})`).replace('hsl','hsla');ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}
 
function makeBlack(id){
  const c=document.getElementById(id);if(!c)return;
  const ctx=c.getContext('2d');
  c.width=c.offsetWidth||400;c.height=c.offsetHeight||220;
  const W=c.width,H=c.height,cx=W/2,cy=H/2;
  function draw(){
    ctx.clearRect(0,0,W,H);
    const t=Date.now()/2000;
    // accretion disk
    for(let angle=0;angle<Math.PI*2;angle+=.02){
      const r=50+Math.sin(angle*3+t)*8;
      const x=cx+r*Math.cos(angle),y=cy+r*.35*Math.sin(angle);
      const heat=Math.sin(angle+t)*0.5+0.5;
      ctx.beginPath();ctx.arc(x,y,2.5,0,Math.PI*2);
      ctx.fillStyle=`rgba(${255},${Math.round(120+heat*120)},${Math.round(30+heat*60)},.5)`;ctx.fill();
    }
    // photon ring
    ctx.beginPath();ctx.ellipse(cx,cy,45,16,0,0,Math.PI*2);
    ctx.strokeStyle='rgba(255,220,100,.4)';ctx.lineWidth=2;ctx.stroke();
    // event horizon
    const bhg=ctx.createRadialGradient(cx,cy,0,cx,cy,32);
    bhg.addColorStop(0,'rgba(0,0,0,1)');bhg.addColorStop(.8,'rgba(0,0,10,.95)');bhg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=bhg;ctx.beginPath();ctx.arc(cx,cy,35,0,Math.PI*2);ctx.fill();
    requestAnimationFrame(draw);
  }
  draw();
}
 
function makeMars(id){
  const c=document.getElementById(id);if(!c)return;
  const ctx=c.getContext('2d');
  c.width=c.offsetWidth||400;c.height=c.offsetHeight||220;
  const W=c.width,H=c.height;
  function draw(){
    ctx.clearRect(0,0,W,H);
    const t=Date.now()/3000;
    // Mars surface
    const mg=ctx.createLinearGradient(0,H*.4,0,H);
    mg.addColorStop(0,'rgba(160,60,20,.6)');mg.addColorStop(1,'rgba(80,30,10,.3)');
    ctx.fillStyle=mg;ctx.fillRect(0,H*.4,W,H*.6);
    // radar waves
    for(let i=1;i<=5;i++){
      const r=(t*80+i*30)%180;
      ctx.beginPath();ctx.arc(W/2,H*.4,r,Math.PI,Math.PI*2);
      ctx.strokeStyle=`rgba(251,146,60,${Math.max(0,(1-r/180)*.4)})`;ctx.lineWidth=1;ctx.stroke();
    }
    // subsurface layers
    [.55,.65,.75].forEach((y,i)=>{
      ctx.beginPath();ctx.setLineDash([8,5]);
      ctx.moveTo(0,H*y);ctx.lineTo(W,H*y);
      ctx.strokeStyle=`rgba(251,146,60,${.12-i*.03})`;ctx.lineWidth=1;ctx.stroke();
      ctx.setLineDash([]);
    });
    // scanner
    ctx.beginPath();ctx.moveTo(W/2,H*.4);ctx.lineTo(W/2,H*.4+((t*100)%H*.35));
    ctx.strokeStyle='rgba(251,146,60,.8)';ctx.lineWidth=1.5;ctx.stroke();
    requestAnimationFrame(draw);
  }
  draw();
}
 
function makeComet(id){
  const c=document.getElementById(id);if(!c)return;
  const ctx=c.getContext('2d');
  c.width=c.offsetWidth||400;c.height=c.offsetHeight||220;
  const W=c.width,H=c.height;
  const comets=Array.from({length:4},(_,i)=>({
    x:W*(.1+i*.2),y:H*(.2+i*.15),
    vx:2+i*.5,vy:.3+i*.2,
    len:60+i*20,color:['#5b8cff','#a78bfa','#34d399','#22d3ee'][i]
  }));
  function draw(){
    ctx.clearRect(0,0,W,H);
    const t=Date.now()/1000;
    // laser beams
    for(let i=0;i<8;i++){
      const angle=t*.1+i*Math.PI/4;
      const ox=W*.15,oy=H/2;
      const tx=W*.8+Math.cos(angle)*W*.1,ty=H/2+Math.sin(angle)*H*.1;
      const g=ctx.createLinearGradient(ox,oy,tx,ty);
      g.addColorStop(0,'rgba(91,140,255,.7)');g.addColorStop(1,'rgba(91,140,255,0)');
      ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(tx,ty);
      ctx.strokeStyle=g;ctx.lineWidth=1;ctx.stroke();
    }
    // laser source
    const sg=ctx.createRadialGradient(W*.15,H/2,0,W*.15,H/2,25);
    sg.addColorStop(0,'rgba(91,140,255,.8)');sg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=sg;ctx.fillRect(W*.15-25,H/2-25,50,50);
    // target craft
    const tx=W*.8+Math.sin(t*.4)*20,ty=H/2+Math.cos(t*.3)*15;
    ctx.save();ctx.translate(tx,ty);
    ctx.beginPath();ctx.moveTo(15,0);ctx.lineTo(-10,-8);ctx.lineTo(-10,8);ctx.closePath();
    ctx.fillStyle='rgba(200,220,255,.7)';ctx.fill();
    ctx.restore();
    requestAnimationFrame(draw);
  }
  draw();
}
 
function makeExo(id){
  const c=document.getElementById(id);if(!c)return;
  const ctx=c.getContext('2d');
  c.width=c.offsetWidth||400;c.height=c.offsetHeight||220;
  const W=c.width,H=c.height;
  const stars2=Array.from({length:6},(_,i)=>({
    x:W*(.1+i*.15),y:H/2+(i%2?-20:20),
    brightness:Array.from({length:200},(_,j)=>1-Math.exp(-Math.pow((j-50-i*15)/(8+i*2),2))*.3-Math.exp(-Math.pow((j-130+i*8)/(6+i),2))*.3)
  }));
  let frame=0;
  function draw(){
    ctx.clearRect(0,0,W,H);
    frame++;
    // light curves
    stars2.forEach((s,si)=>{
      ctx.beginPath();
      for(let x=0;x<W;x++){
        const idx=(Math.floor(frame/1)+x)%200;
        const y=s.y+s.brightness[idx]*30;
        x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }
      const colors2=['#5b8cff','#a78bfa','#34d399','#22d3ee','#fb923c','#f472b6'];
      ctx.strokeStyle=colors2[si];ctx.lineWidth=1.2;ctx.stroke();
      // planet label
      const dip=s.brightness.indexOf(Math.min(...s.brightness));
      if(dip>20&&dip<180){
        const lx=(dip-frame%200+W)%W;
        if(lx>20&&lx<W-20){
          ctx.beginPath();ctx.arc(lx,s.y-20,3,0,Math.PI*2);
          ctx.fillStyle=colors2[si];ctx.fill();
        }
      }
    });
    requestAnimationFrame(draw);
  }
  draw();
}
 
function makeDark(id){
  const c=document.getElementById(id);if(!c)return;
  const ctx=c.getContext('2d');
  c.width=c.offsetWidth||400;c.height=c.offsetHeight||220;
  const W=c.width,H=c.height;
  // supernova data points
  const data=Array.from({length:30},(_,i)=>({
    z:.01+i*.05,mu:33+i*2.5+(Math.random()-.5)*.8+(i>.15?.5:0)
  }));
  function draw(){
    ctx.clearRect(0,0,W,H);
    const t=Date.now()/4000;
    // axes
    ctx.strokeStyle='rgba(255,255,255,.1)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(40,H-30);ctx.lineTo(W-20,H-30);ctx.stroke();
    ctx.beginPath();ctx.moveTo(40,20);ctx.lineTo(40,H-30);ctx.stroke();
    // expected line (no DE)
    ctx.beginPath();
    for(let x=0;x<=W-60;x+=3){
      const z=(x/(W-60))*1.5;const mu=33+z*2*Math.log10(z+1)*8;
      const px=40+x,py=H-30-(mu-33)/28*(H-50);
      x===0?ctx.moveTo(px,py):ctx.lineTo(px,py);
    }
    ctx.strokeStyle='rgba(255,255,255,.15)';ctx.setLineDash([4,6]);ctx.stroke();ctx.setLineDash([]);
    // actual (with DE)
    ctx.beginPath();
    for(let x=0;x<=W-60;x+=3){
      const z=(x/(W-60))*1.5;const mu=33+z*2.5*Math.log10(z+1)*8+z*1.2;
      const px=40+x,py=H-30-(mu-33)/28*(H-50);
      x===0?ctx.moveTo(px,py):ctx.lineTo(px,py);
    }
    ctx.strokeStyle='rgba(167,139,250,.7)';ctx.lineWidth=2;ctx.stroke();
    // data points
    data.forEach((d,i)=>{
      const px=40+(d.z/1.55)*(W-60);const py=H-30-(d.mu-33)/28*(H-50);
      const pulse=.5+.5*Math.sin(t*4+i);
      ctx.beginPath();ctx.arc(px,py,3,0,Math.PI*2);
      ctx.fillStyle=`rgba(91,140,255,${.5+pulse*.4})`;ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}
 
// Init all canvases
const inits={
  'c-nebula':makeNebula,'c-orbit':makeOrbit,'c-pulse':makePulse,'c-galaxy':makeGalaxy,
  'c-radar':makeRadar,'c-solar':makeSolar,'c-worm':makeWorm,'c-quantum':makeQuantum,
  'c-wave':makeWave,'c-astro':makeAstro,'c-black':makeBlack,'c-mars':makeMars,
  'c-comet':makeComet,'c-exo':makeExo,'c-dark':makeDark
};
Object.entries(inits).forEach(([id,fn])=>{
  const obs2=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){fn(id);obs2.unobserve(e.target)}});
  },{threshold:.1});
  const el=document.getElementById(id);
  if(el)obs2.observe(el.closest('.project-card')||el.closest('.card-visual')||el);
});
 
// Resize canvases on window resize
window.addEventListener('resize',()=>{
  Object.keys(inits).forEach(id=>{
    const c=document.getElementById(id);
    if(c){c.width=c.offsetWidth||400;c.height=c.offsetHeight||220}
  });
});
