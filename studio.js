(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const clamp = (v,a,b) => Math.min(b,Math.max(a,v));
  const ease = t => 1-Math.pow(1-t,4);

  // All keeps the curated layout; a format filter reveals every matching project.
  const gamesToggle=document.querySelector('[data-toggle-games]');
  const more=document.querySelector('#more-games');
  if(gamesToggle&&more){
    const work=document.querySelector('#work'),selected=work.querySelector('.selected-grid');
    const cards=[...work.querySelectorAll('[data-game-category]')];
    const filters=[...work.querySelectorAll('[data-work-filter]')];
    const status=work.querySelector('[data-work-status]');
    let category='all',allExpanded=false;
    more.querySelectorAll('.studio-project').forEach((card,i)=>card.style.setProperty('--item-i',i));
    const update=()=>{
      const open=category!=='all'||allExpanded;
      gamesToggle.setAttribute('aria-expanded',String(open));
      gamesToggle.querySelector('[data-games-label]').textContent=open?'Show selected work':'View all 9 games';
      more.inert=!open;more.classList.toggle('is-open',open);
      work.dataset.category=category;
      cards.forEach(card=>card.hidden=category!=='all'&&card.dataset.gameCategory!==category);
      selected.hidden=![...selected.children].some(card=>!card.hidden);
      gamesToggle.closest('.all-games-action').hidden=category!=='all';
      filters.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.workFilter===category)));
      const count=category==='all'&&!open?3:cards.filter(card=>!card.hidden).length;
      status.textContent=`Showing ${count} ${category==='all'&&!open?'selected':category==='all'?'':category} games.`;
    };
    gamesToggle.addEventListener('click',()=>{allExpanded=!allExpanded;update();});
    filters.forEach(button=>button.addEventListener('click',()=>{
      if(category===button.dataset.workFilter)return;
      category=button.dataset.workFilter;update();
      if(!reduced.matches)for(const grid of [selected,more])if(!grid.hidden)grid.animate([{opacity:.25,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],{duration:380,easing:'cubic-bezier(.16,1,.3,1)'});
    }));
  }

  // A soft, local Bayer-dither brush. Only runs while the pointer is nearby.
  const vertexSource=`attribute vec2 a_position; varying vec2 v_uv; void main(){v_uv=a_position*.5+.5;gl_Position=vec4(a_position,0.,1.);}`;
  const fragmentSource=`
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    varying vec2 v_uv; uniform sampler2D u_image; uniform vec2 u_resolution; uniform vec2 u_imageSize; uniform vec2 u_mouse; uniform float u_reveal; uniform float u_radius; uniform float u_pixel; uniform float u_contain;
    float bayer(vec2 p){float x=mod(p.x,4.);float y=mod(p.y,4.);if(y<1.){if(x<1.)return 0.;if(x<2.)return 8.;if(x<3.)return 2.;return 10.;}if(y<2.){if(x<1.)return 12.;if(x<2.)return 4.;if(x<3.)return 14.;return 6.;}if(y<3.){if(x<1.)return 3.;if(x<2.)return 11.;if(x<3.)return 1.;return 9.;}if(x<1.)return 15.;if(x<2.)return 7.;if(x<3.)return 13.;return 5.;}
    void main(){
      // Transparent pixels must also carry zero RGB for page compositing.
      if(u_reveal<=0.){gl_FragColor=vec4(0.);return;}
      // Normalize before length() so high-DPI pixel distances cannot overflow mediump.
      vec2 delta=(v_uv-u_mouse)*(u_resolution/u_radius);
      float d=length(delta);
      if(d>=1.08){gl_FragColor=vec4(0.);return;}
      float angle=atan(delta.y,delta.x+.00001);
      float rough=sin(angle*21.)*.045+sin(angle*43.+1.)*.025;
      float opacity=(1.-smoothstep(.53+rough,1.+rough,d))*clamp(u_reveal,0.,1.);
      vec2 uv=v_uv;float ca=u_resolution.x/u_resolution.y;float ia=u_imageSize.x/u_imageSize.y;
      if(u_contain>.5){if(ia>ca)uv.y=(uv.y-.5)*ia/ca+.5;else uv.x=(uv.x-.5)*ca/ia+.5;}
      else{if(ia>ca)uv.x=(uv.x-.5)*ca/ia+.5;else uv.y=(uv.y-.5)*ia/ca+.5;}
      if(uv.x<0.||uv.x>1.||uv.y<0.||uv.y>1.){gl_FragColor=vec4(0.);return;}
      vec3 col=texture2D(u_image,uv).rgb;
      float lum=dot(col,vec3(.2126,.7152,.0722));
      float threshold=(bayer(floor(gl_FragCoord.xy/u_pixel))+.5)/16.;
      vec3 ink=mix(vec3(.14,.16,.14),vec3(.97,.96,.91),step(threshold,lum));
      gl_FragColor=vec4(ink*opacity,opacity);
    }`;

  function ditherEffect(surface){
    const img=surface.querySelector('img');
    let canvas=surface.querySelector('canvas');
    if(!img||!canvas)return;
    let gl=null,context=null,program=null,uniforms={},processed=null;
    let width=1,height=1,ratio=1,active=false,visible=true,alpha=0,frame=0,enabled=true,lastTime=0;
    let mouse={x:.5,y:.5},target={x:.5,y:.5},contain=getComputedStyle(img).objectFit==='contain';
    canvas.style.opacity='0';
    try{gl=canvas.getContext('webgl',{alpha:true,antialias:false,premultipliedAlpha:true,preserveDrawingBuffer:false,depth:false,stencil:false});}catch{}
    if(gl){
      const compile=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){gl.deleteShader(s);throw new Error('Shader compilation failed');}return s;};
      try{
        const vs=compile(gl.VERTEX_SHADER,vertexSource),fs=compile(gl.FRAGMENT_SHADER,fragmentSource);
        program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
        if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('Shader link failed');
        gl.deleteShader(vs);gl.deleteShader(fs);gl.useProgram(program);
        const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
        const a=gl.getAttribLocation(program,'a_position');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
        for(const key of ['image','resolution','imageSize','mouse','reveal','radius','pixel','contain'])uniforms[key]=gl.getUniformLocation(program,'u_'+key);
        const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);gl.uniform1i(uniforms.image,0);gl.uniform2f(uniforms.imageSize,img.naturalWidth,img.naturalHeight);gl.uniform1f(uniforms.contain,Number(contain));
        surface.dataset.effect='webgl';
      }catch{gl=null;const replacement=canvas.cloneNode();canvas.replaceWith(replacement);canvas=replacement;}
    }
    if(!gl){
      context=canvas.getContext('2d');if(!context)return;surface.dataset.effect='canvas';
    }
    const prepareFallback=()=>{
      processed=document.createElement('canvas');processed.width=Math.min(800,Math.round(width));processed.height=Math.round(processed.width*height/width);
      const c=processed.getContext('2d',{willReadFrequently:true}),w=processed.width,h=processed.height;
      const scale=(contain?Math.min:Math.max)(w/img.naturalWidth,h/img.naturalHeight);c.drawImage(img,(w-img.naturalWidth*scale)/2,(h-img.naturalHeight*scale)/2,img.naturalWidth*scale,img.naturalHeight*scale);
      const data=c.getImageData(0,0,w,h),matrix=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
      for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4;const lum=(.2126*data.data[i]+.7152*data.data[i+1]+.0722*data.data[i+2])/255;const v=lum>(matrix[(Math.floor(y/2)%4)*4+Math.floor(x/2)%4]+.5)/16?245:36;data.data[i]=v;data.data[i+1]=v;data.data[i+2]=v===245?233:35;}
      c.putImageData(data,0,0);
    };
    function resetEffect(){
      active=false;alpha=0;cancelAnimationFrame(frame);frame=0;lastTime=0;canvas.style.opacity='0';
      if(gl&&!gl.isContextLost()){gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);}
      else if(context){context.setTransform(1,0,0,1,0,0);context.clearRect(0,0,canvas.width,canvas.height);}
    }
    const resize=()=>{const r=surface.getBoundingClientRect();if(!r.width||!r.height)return;resetEffect();width=r.width;height=r.height;ratio=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);if(gl)gl.viewport(0,0,canvas.width,canvas.height);else{try{prepareFallback();}catch{enabled=false;}}};
    function paint(now){
      frame=0;if(!enabled||!visible||document.hidden){resetEffect();return;}
      const elapsed=lastTime?Math.max(0,now-lastTime):1000/60;lastTime=now;
      const fade=1-Math.exp(-elapsed/110),follow=1-Math.exp(-elapsed/84);
      alpha+=(Number(active)-alpha)*fade;mouse.x+=(target.x-mouse.x)*follow;mouse.y+=(target.y-mouse.y)*follow;
      if(!active&&alpha<.003)alpha=0;
      const radius=Math.min(150,width*.34);
      // The DOM layer independently enforces idle visibility and the brush boundary.
      // This keeps the original artwork intact even if a GPU compositor mishandles alpha.
      canvas.style.opacity=alpha>0?'1':'0';
      canvas.style.clipPath=`circle(${radius*1.08}px at ${mouse.x*width}px ${mouse.y*height}px)`;
      if(gl){gl.useProgram(program);gl.uniform2f(uniforms.resolution,canvas.width,canvas.height);gl.uniform2f(uniforms.mouse,mouse.x,1-mouse.y);gl.uniform1f(uniforms.reveal,alpha);gl.uniform1f(uniforms.radius,radius*ratio);gl.uniform1f(uniforms.pixel,2.5*ratio);gl.drawArrays(gl.TRIANGLES,0,6);}
      else if(processed){context.setTransform(ratio,0,0,ratio,0,0);context.clearRect(0,0,width,height);context.globalCompositeOperation='source-over';context.globalAlpha=alpha;context.drawImage(processed,0,0,width,height);context.globalAlpha=1;context.globalCompositeOperation='destination-in';const grad=context.createRadialGradient(mouse.x*width,mouse.y*height,radius*.35,mouse.x*width,mouse.y*height,radius);grad.addColorStop(0,'#fff');grad.addColorStop(1,'#fff0');context.fillStyle=grad;context.fillRect(0,0,width,height);context.globalCompositeOperation='source-over';}
      if(active||alpha>0)frame=requestAnimationFrame(paint);else lastTime=0;
    }
    const start=()=>{if(!frame&&visible&&enabled)frame=requestAnimationFrame(paint);};
    surface.addEventListener('pointermove',e=>{if(!enabled||!finePointer.matches||reduced.matches||e.pointerType==='touch')return;const r=surface.getBoundingClientRect();target={x:clamp((e.clientX-r.left)/r.width,0,1),y:clamp((e.clientY-r.top)/r.height,0,1)};active=true;start();});
    surface.addEventListener('pointerleave',()=>{active=false;start();});
    surface.addEventListener('pointercancel',resetEffect);
    surface.closest('a').addEventListener('focus',()=>{if(!finePointer.matches||reduced.matches)return;target={x:.5,y:.5};active=true;start();});
    surface.closest('a').addEventListener('blur',()=>{active=false;start();});
    new ResizeObserver(resize).observe(surface);
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible)resetEffect();},{rootMargin:'80px'}).observe(surface);
    window.addEventListener('blur',resetEffect);
    document.addEventListener('visibilitychange',()=>{if(document.hidden)resetEffect();});
    reduced.addEventListener('change',resetEffect);finePointer.addEventListener('change',resetEffect);
    canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();enabled=false;resetEffect();});
    resize();
  }
  document.querySelectorAll('[data-dither]').forEach(surface=>{const img=surface.querySelector('img');if(img.complete&&img.naturalWidth)ditherEffect(surface);else img.addEventListener('load',()=>ditherEffect(surface),{once:true});});

  // Real canvas marks: the eraser removes the title and drawings alike.
  const board=document.querySelector('[data-blackboard]');
  if(board){
    const canvas=board.querySelector('#chalk-canvas'),ctx=canvas.getContext('2d',{willReadFrequently:true});
    const cursor=board.querySelector('.board-cursor'),cursorImage=cursor.querySelector('img');
    const toolButtons=[...board.querySelectorAll('[data-board-tool]')];
    const title=board.querySelector('h1'),roleLabels=[...board.querySelectorAll('.board-roles span')],hint=board.querySelector('.board-hint');
    let w=0,h=0,dpr=1,tool=null,drawing=false,draggingTool=false,last=null,revealFrame=0,cursorFrame=0;
    let cursorTarget={x:0,y:0},cursorPos={x:0,y:0},inside=false,ready=false;
    // A repeatable dry pigment pattern leaves the board visible between chalk grains.
    const grain=document.createElement('canvas');grain.width=128;grain.height=128;
    const grainContext=grain.getContext('2d'),pigment=grainContext.createImageData(128,128);let chalkSeed=72017;
    for(let i=0;i<pigment.data.length;i+=4){chalkSeed=(chalkSeed*1664525+1013904223)>>>0;const n=chalkSeed/4294967296;pigment.data[i]=238;pigment.data[i+1]=239;pigment.data[i+2]=224;pigment.data[i+3]=n<.19?0:Math.round(55+n*135);}
    grainContext.putImageData(pigment,0,0);const chalkPigment=ctx.createPattern(grain,'repeat');
    function textLayer(animate=false){
      if(!w||!h)return;
      cancelAnimationFrame(revealFrame);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.globalCompositeOperation='source-over';ctx.clearRect(0,0,w,h);
      const rect=board.getBoundingClientRect();
      for(const el of [title,...roleLabels]){
        const style=getComputedStyle(el),r=el.getBoundingClientRect(),size=parseFloat(style.fontSize),lh=parseFloat(style.lineHeight)||size*1.5;
        ctx.font=`${style.fontWeight} ${size}px ${style.fontFamily}`;ctx.letterSpacing=style.letterSpacing==='normal'?'0px':style.letterSpacing;ctx.textBaseline='alphabetic';ctx.fillStyle=el===title?'#efeee3':'#e0e5d8';
        const metrics=ctx.measureText('Mg'),baseline=(lh-metrics.actualBoundingBoxAscent-metrics.actualBoundingBoxDescent)/2+metrics.actualBoundingBoxAscent;
        const lines=el.innerText.split('\n');lines.forEach((line,i)=>ctx.fillText(line,r.left-rect.left,r.top-rect.top+baseline+i*lh));
        if(el!==title){
          const x=r.left-rect.left,y=r.bottom-rect.top+3;
          ctx.strokeStyle='#ccd7c3';ctx.lineWidth=.9;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+r.width*.48,y+1.8,x+r.width,y-.8);ctx.stroke();
        }
      }
      ctx.letterSpacing='0px';
      const data=ctx.getImageData(0,0,canvas.width,canvas.height);let seed=73471;
      for(let i=3;i<data.data.length;i+=4){if(!data.data[i])continue;seed=(seed*1664525+1013904223)>>>0;const n=seed/4294967296;data.data[i]=Math.round(data.data[i]*(n<.07?0:.57+n*.43));}
      ctx.putImageData(data,0,0);board.classList.add('canvas-ready');
      if(animate&&!reduced.matches){const base=document.createElement('canvas');base.width=canvas.width;base.height=canvas.height;base.getContext('2d').drawImage(canvas,0,0);const begin=performance.now();const tick=now=>{const t=clamp((now-begin)/1000,0,1);ctx.clearRect(0,0,w,h);ctx.save();ctx.beginPath();ctx.rect(0,0,w*ease(t),h);ctx.clip();ctx.drawImage(base,0,0,w,h);ctx.restore();if(t<1)revealFrame=requestAnimationFrame(tick);else revealFrame=0;};revealFrame=requestAnimationFrame(tick);}
    }
    const resize=()=>{const r=board.getBoundingClientRect();if(!r.width||!r.height||(!ready))return;if(Math.abs(w-r.width)<.5&&Math.abs(h-r.height)<.5)return;w=r.width;h=r.height;dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);textLayer(false);};
    document.fonts.ready.then(()=>{ready=true;resize();textLayer(true);});new ResizeObserver(resize).observe(board);
    const selectTool=next=>{tool=next;board.classList.toggle('tool-active',!!tool);toolButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.boardTool===tool)));if(tool){cursor.dataset.tool=tool;cursorImage.src=`assets/studio/${tool}.webp`;hint.textContent=tool==='chalk'?'press & drag to draw':'wipe a little space';}else{cursor.style.opacity='0';hint.textContent='leave a little doodle ↘';}};
    const localPoint=e=>{const r=board.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};};
    function moveCursor(){cursorFrame=0;cursorPos.x+=(cursorTarget.x-cursorPos.x)*.46;cursorPos.y+=(cursorTarget.y-cursorPos.y)*.46;const tilt=clamp((cursorTarget.x-cursorPos.x)*.28,-12,12);cursor.style.transform=tool==='eraser'?`translate(${cursorPos.x-48}px,${cursorPos.y-25}px) rotate(${tilt-6}deg)`:`translate(${cursorPos.x-2}px,${cursorPos.y-cursor.offsetHeight/2}px) rotate(${-40+tilt}deg)`;if(tool&&inside&&Math.abs(cursorPos.x-cursorTarget.x)+Math.abs(cursorPos.y-cursorTarget.y)>.25)cursorFrame=requestAnimationFrame(moveCursor);}
    const follow=e=>{const p=localPoint(e);inside=p.x>=0&&p.x<=w&&p.y>=0&&p.y<=h;cursorTarget=p;if(tool&&inside&&!reduced.matches){cursor.style.opacity='1';if(drawing||draggingTool){cancelAnimationFrame(cursorFrame);cursorPos={...p};moveCursor();}else if(!cursorFrame)cursorFrame=requestAnimationFrame(moveCursor);}else cursor.style.opacity='0';return p;};
    function mark(p){
      if(!tool||!ready)return;if(revealFrame){cancelAnimationFrame(revealFrame);revealFrame=0;textLayer(false);}
      if(p.x<0||p.x>w||p.y<0||p.y>h){last=null;return;}
      const prev=last||p;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.lineCap='round';ctx.lineJoin='round';ctx.globalAlpha=1;
      if(tool==='eraser'){ctx.globalCompositeOperation='destination-out';ctx.strokeStyle='#000';ctx.lineWidth=48;ctx.beginPath();ctx.moveTo(prev.x,prev.y);ctx.lineTo(p.x+.01,p.y+.01);ctx.stroke();}
      else{const diameter=(cursor.offsetWidth||66)*(cursorImage.naturalHeight/cursorImage.naturalWidth||.148)*.92;ctx.globalCompositeOperation='source-over';ctx.strokeStyle=chalkPigment;ctx.lineWidth=diameter;ctx.beginPath();ctx.moveTo(prev.x,prev.y);ctx.lineTo(p.x+.01,p.y+.01);ctx.stroke();const n=Math.max(1,Math.ceil(Math.hypot(p.x-prev.x,p.y-prev.y)/1.5));for(let i=0;i<n;i++){const t=i/n;ctx.fillStyle=`rgba(236,238,224,${.06+Math.random()*.15})`;ctx.fillRect(prev.x+(p.x-prev.x)*t+(Math.random()-.5)*(diameter+3),prev.y+(p.y-prev.y)*t+(Math.random()-.5)*(diameter+3),.4+Math.random()*.7,.4+Math.random()*.7);}}
      ctx.globalCompositeOperation='source-over';last=p;
    }
    canvas.addEventListener('pointerdown',e=>{if(!tool)return;e.preventDefault();drawing=true;canvas.setPointerCapture(e.pointerId);last=null;mark(follow(e));});
    canvas.addEventListener('pointermove',e=>{const p=follow(e);if(drawing)mark(p);});
    canvas.addEventListener('pointerleave',()=>{if(!drawing){inside=false;cursor.style.opacity='0';}});
    const release=()=>{drawing=false;draggingTool=false;last=null;};canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);
    toolButtons.forEach(button=>{
      button.addEventListener('click',()=>selectTool(button.dataset.boardTool));
      button.addEventListener('pointerdown',e=>{e.preventDefault();selectTool(button.dataset.boardTool);button.setPointerCapture(e.pointerId);draggingTool=true;last=null;cursorPos=localPoint(e);});
      button.addEventListener('pointermove',e=>{if(draggingTool)mark(follow(e));});
      button.addEventListener('pointerup',release);button.addEventListener('pointercancel',release);
    });
    document.querySelector('[data-restore-board]').addEventListener('click',()=>{selectTool(null);textLayer(true);});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')selectTool(null);});
  }

  const cat=document.querySelector('[data-pet-cat]');
  if(cat){
    const bubble=document.querySelector('[data-pet-bubble]');let pets=0,petTimer,blinkTimer,lastPet=Date.now();
    function blink(){clearTimeout(blinkTimer);blinkTimer=setTimeout(()=>{if(!document.hidden&&cat.dataset.state!=='pet'){if(Date.now()-lastPet>65000){cat.dataset.state='sleep';}else{cat.dataset.state='blink';setTimeout(()=>{if(cat.dataset.state==='blink')cat.dataset.state='idle';},150);}}blink();},4500+Math.random()*3500);}
    cat.addEventListener('click',()=>{pets++;lastPet=Date.now();clearTimeout(petTimer);cat.dataset.state='idle';void cat.offsetWidth;cat.dataset.state='pet';bubble.textContent=pets>4?'okay, we’re friends now ♡':pets>1?'purrrr… ♡':'oh! hello, you ♡';bubble.classList.add('is-visible');petTimer=setTimeout(()=>{cat.dataset.state='idle';bubble.classList.remove('is-visible');},2400);});
    cat.addEventListener('pointerenter',()=>{if(cat.dataset.state==='sleep'){lastPet=Date.now();cat.dataset.state='idle';bubble.textContent='oh, you’re back.';}});
    if(!reduced.matches)blink();
  }

  const radio=document.querySelector('#studio-radio'),radioToggle=document.querySelector('[data-radio-toggle]');
  if(radio&&radioToggle){
    let loaded=false;
    function toggleRadio(open){
      if(open&&!loaded){const iframe=document.createElement('iframe');iframe.src='https://open.spotify.com/embed/playlist/2PaJIekKDK5GO3qzfKL73n?utm_source=generator&theme=0';iframe.title='Erica’s studio playlist on Spotify';iframe.width='100%';iframe.height='152';iframe.allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';iframe.loading='lazy';radio.querySelector('[data-spotify-holder]').append(iframe);loaded=true;}
      radio.inert=!open;radio.classList.toggle('is-open',open);radioToggle.setAttribute('aria-expanded',String(open));
      if(!open&&radio.contains(document.activeElement))radioToggle.focus();
    }
    radioToggle.addEventListener('click',()=>toggleRadio(!radio.classList.contains('is-open')));
    radio.querySelector('[data-radio-close]').addEventListener('click',()=>toggleRadio(false));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')toggleRadio(false);});
  }
})();
