(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const clamp = (v,a,b) => Math.min(b,Math.max(a,v));
  const ease = t => 1-Math.pow(1-t,4);

  // The archive expands in place; its real links remain available without JS.
  const gamesToggle=document.querySelector('[data-toggle-games]');
  const more=document.querySelector('#more-games');
  if(gamesToggle&&more){
    more.querySelectorAll('.studio-project').forEach((card,i)=>card.style.setProperty('--item-i',i));
    gamesToggle.addEventListener('click',()=>{
      const open=gamesToggle.getAttribute('aria-expanded')!=='true';
      gamesToggle.setAttribute('aria-expanded',String(open));
      gamesToggle.querySelector('[data-games-label]').textContent=open?'Show selected work':'View all 9 games';
      more.inert=!open;more.classList.toggle('is-open',open);
    });
  }

  const paperScene=document.querySelector('[data-paper-scene]');
  if(paperScene){
    const papers=document.querySelector('#personal-papers');
    const buttons=[...document.querySelectorAll('[data-toggle-about]')];
    const paperCards=[...papers.querySelectorAll('.personal-paper')];
    const spacePapers=()=>{
      let offset=0;
      paperCards.forEach(card=>{card.style.setProperty('--paper-top',`${offset}px`);offset+=card.offsetHeight+42;});
      paperScene.style.setProperty('--paper-stack-height',`${offset+70}px`);
    };
    const paperSizes=new ResizeObserver(spacePapers);
    paperCards.forEach(card=>paperSizes.observe(card));
    spacePapers();
    buttons.forEach(button=>button.addEventListener('click',()=>{
      const open=!paperScene.classList.contains('is-open');
      const envelope=paperScene.querySelector('.paper-envelope');
      if(open&&document.activeElement===envelope)buttons[0].focus();
      envelope.inert=open;
      paperScene.classList.toggle('is-open',open);
      papers.inert=!open;papers.setAttribute('aria-hidden',String(!open));
      buttons.forEach(b=>{b.setAttribute('aria-expanded',String(open));if(b.classList.contains('paper-envelope'))b.setAttribute('aria-label',open?'Close Erica’s personal folder':'Open Erica’s personal folder');});
      document.querySelector('[data-about-label]').textContent=open?'tuck everything away':'open my little folder';
      if(!open&&papers.contains(document.activeElement))buttons[0].focus();
    }));
  }

  // A soft, local Bayer-dither brush. Only runs while the pointer is nearby.
  const vertexSource=`attribute vec2 a_position; varying vec2 v_uv; void main(){v_uv=a_position*.5+.5;gl_Position=vec4(a_position,0.,1.);}`;
  const fragmentSource=`precision mediump float;
    varying vec2 v_uv; uniform sampler2D u_image; uniform vec2 u_resolution; uniform vec2 u_imageSize; uniform vec2 u_mouse; uniform float u_reveal; uniform float u_radius; uniform float u_pixel;
    float bayer(vec2 p){float x=mod(p.x,4.);float y=mod(p.y,4.);if(y<1.){if(x<1.)return 0.;if(x<2.)return 8.;if(x<3.)return 2.;return 10.;}if(y<2.){if(x<1.)return 12.;if(x<2.)return 4.;if(x<3.)return 14.;return 6.;}if(y<3.){if(x<1.)return 3.;if(x<2.)return 11.;if(x<3.)return 1.;return 9.;}if(x<1.)return 15.;if(x<2.)return 7.;if(x<3.)return 13.;return 5.;}
    void main(){vec2 uv=v_uv;float ca=u_resolution.x/u_resolution.y;float ia=u_imageSize.x/u_imageSize.y;if(ia>ca)uv.x=(uv.x-.5)*ca/ia+.5;else uv.y=(uv.y-.5)*ia/ca+.5;vec3 col=texture2D(u_image,uv).rgb;float lum=dot(col,vec3(.2126,.7152,.0722));float threshold=(bayer(floor(gl_FragCoord.xy/u_pixel))+.5)/16.;float bit=step(threshold,lum);vec3 ink=mix(vec3(.14,.16,.14),vec3(.97,.96,.91),bit);vec2 delta=gl_FragCoord.xy-u_mouse;float angle=atan(delta.y,delta.x);float rough=sin(angle*21.)*.045+sin(angle*43.+1.)*.025;float d=length(delta)/u_radius;float mask=1.-smoothstep(.53+rough,1.+rough,d);gl_FragColor=vec4(ink,mask*u_reveal);}`;

  function ditherEffect(surface){
    const img=surface.querySelector('img');
    let canvas=surface.querySelector('canvas');
    if(!img||!canvas)return;
    let gl=null,context=null,program=null,uniforms={},processed=null;
    let width=1,height=1,ratio=1,active=false,visible=true,alpha=0,frame=0;
    let mouse={x:.5,y:.5},target={x:.5,y:.5};
    try{gl=canvas.getContext('webgl',{alpha:true,antialias:false,premultipliedAlpha:false,preserveDrawingBuffer:false});}catch{}
    if(gl){
      const compile=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){gl.deleteShader(s);throw new Error('Shader compilation failed');}return s;};
      try{
        const vs=compile(gl.VERTEX_SHADER,vertexSource),fs=compile(gl.FRAGMENT_SHADER,fragmentSource);
        program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
        if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('Shader link failed');
        gl.deleteShader(vs);gl.deleteShader(fs);gl.useProgram(program);
        const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
        const a=gl.getAttribLocation(program,'a_position');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
        for(const key of ['image','resolution','imageSize','mouse','reveal','radius','pixel'])uniforms[key]=gl.getUniformLocation(program,'u_'+key);
        const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);gl.uniform1i(uniforms.image,0);gl.uniform2f(uniforms.imageSize,img.naturalWidth,img.naturalHeight);
        surface.dataset.effect='webgl';
      }catch{gl=null;const replacement=canvas.cloneNode();canvas.replaceWith(replacement);canvas=replacement;}
    }
    if(!gl){
      context=canvas.getContext('2d');if(!context)return;surface.dataset.effect='canvas';
    }
    const prepareFallback=()=>{
      processed=document.createElement('canvas');processed.width=Math.min(800,Math.round(width));processed.height=Math.round(processed.width*height/width);
      const c=processed.getContext('2d',{willReadFrequently:true}),w=processed.width,h=processed.height;
      const scale=Math.max(w/img.naturalWidth,h/img.naturalHeight);c.drawImage(img,(w-img.naturalWidth*scale)/2,(h-img.naturalHeight*scale)/2,img.naturalWidth*scale,img.naturalHeight*scale);
      const data=c.getImageData(0,0,w,h),matrix=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
      for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4;const lum=(.2126*data.data[i]+.7152*data.data[i+1]+.0722*data.data[i+2])/255;const v=lum>(matrix[(Math.floor(y/2)%4)*4+Math.floor(x/2)%4]+.5)/16?245:36;data.data[i]=v;data.data[i+1]=v;data.data[i+2]=v===245?233:35;}
      c.putImageData(data,0,0);
    };
    const resize=()=>{const r=surface.getBoundingClientRect();if(!r.width||!r.height)return;width=r.width;height=r.height;ratio=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);if(gl)gl.viewport(0,0,canvas.width,canvas.height);else prepareFallback();};
    function paint(){
      frame=0;if(!visible||document.hidden)return;
      alpha+=(Number(active)-alpha)*.14;mouse.x+=(target.x-mouse.x)*.18;mouse.y+=(target.y-mouse.y)*.18;
      if(!active&&alpha<.003)alpha=0;
      const radius=Math.min(150,width*.34);
      if(gl){gl.useProgram(program);gl.uniform2f(uniforms.resolution,canvas.width,canvas.height);gl.uniform2f(uniforms.mouse,mouse.x*canvas.width,(1-mouse.y)*canvas.height);gl.uniform1f(uniforms.reveal,alpha);gl.uniform1f(uniforms.radius,radius*ratio);gl.uniform1f(uniforms.pixel,2.5*ratio);gl.drawArrays(gl.TRIANGLES,0,6);}
      else if(processed){context.setTransform(ratio,0,0,ratio,0,0);context.clearRect(0,0,width,height);context.globalCompositeOperation='source-over';context.globalAlpha=alpha;context.drawImage(processed,0,0,width,height);context.globalAlpha=1;context.globalCompositeOperation='destination-in';const grad=context.createRadialGradient(mouse.x*width,mouse.y*height,radius*.35,mouse.x*width,mouse.y*height,radius);grad.addColorStop(0,'#fff');grad.addColorStop(1,'#fff0');context.fillStyle=grad;context.fillRect(0,0,width,height);context.globalCompositeOperation='source-over';}
      if(active||alpha>0)frame=requestAnimationFrame(paint);
    }
    const start=()=>{if(!frame&&visible)frame=requestAnimationFrame(paint);};
    surface.addEventListener('pointermove',e=>{if(!finePointer.matches||reduced.matches)return;const r=surface.getBoundingClientRect();target={x:clamp((e.clientX-r.left)/r.width,0,1),y:clamp((e.clientY-r.top)/r.height,0,1)};active=true;start();});
    surface.addEventListener('pointerleave',()=>{active=false;start();});
    surface.closest('a').addEventListener('focus',()=>{if(reduced.matches)return;target={x:.5,y:.5};active=true;start();});
    surface.closest('a').addEventListener('blur',()=>{active=false;start();});
    new ResizeObserver(resize).observe(surface);
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible){cancelAnimationFrame(frame);frame=0;active=false;alpha=0;}else start();},{rootMargin:'80px'}).observe(surface);
    canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(frame);canvas.style.opacity='0';});
    resize();
  }
  document.querySelectorAll('[data-dither]').forEach(surface=>{const img=surface.querySelector('img');if(img.complete&&img.naturalWidth)ditherEffect(surface);else img.addEventListener('load',()=>ditherEffect(surface),{once:true});});

  // Real canvas marks: the eraser removes the title and drawings alike.
  const board=document.querySelector('[data-blackboard]');
  if(board){
    const canvas=board.querySelector('#chalk-canvas'),ctx=canvas.getContext('2d',{willReadFrequently:true});
    const cursor=board.querySelector('.board-cursor'),cursorImage=cursor.querySelector('img');
    const toolButtons=[...board.querySelectorAll('[data-board-tool]')];
    const title=board.querySelector('h1'),intro=board.querySelector('.board-copy p'),hint=board.querySelector('.board-hint');
    let w=0,h=0,dpr=1,tool=null,drawing=false,draggingTool=false,last=null,revealFrame=0,cursorFrame=0;
    let cursorTarget={x:0,y:0},cursorPos={x:0,y:0},inside=false,ready=false;
    function textLayer(animate=false){
      if(!w||!h)return;
      cancelAnimationFrame(revealFrame);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.globalCompositeOperation='source-over';ctx.clearRect(0,0,w,h);
      const rect=board.getBoundingClientRect();
      for(const el of [title,intro]){
        const style=getComputedStyle(el),r=el.getBoundingClientRect(),size=parseFloat(style.fontSize),lh=parseFloat(style.lineHeight)||size*1.5;
        ctx.font=`${style.fontWeight} ${size}px ${style.fontFamily}`;ctx.letterSpacing=style.letterSpacing==='normal'?'0px':style.letterSpacing;ctx.textBaseline='alphabetic';ctx.fillStyle=el===title?'#efeee3':'#e0e5d8';
        const lines=el.innerText.split('\n');lines.forEach((line,i)=>ctx.fillText(line,r.left-rect.left,r.top-rect.top+size*.84+i*lh));
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
    function moveCursor(){cursorFrame=0;cursorPos.x+=(cursorTarget.x-cursorPos.x)*.46;cursorPos.y+=(cursorTarget.y-cursorPos.y)*.46;const tilt=clamp((cursorTarget.x-cursorPos.x)*.28,-12,12);cursor.style.transform=tool==='eraser'?`translate(${cursorPos.x-48}px,${cursorPos.y-25}px) rotate(${tilt-6}deg)`:`translate(${cursorPos.x-9}px,${cursorPos.y-6}px) rotate(${-40+tilt}deg)`;if(tool&&inside&&Math.abs(cursorPos.x-cursorTarget.x)+Math.abs(cursorPos.y-cursorTarget.y)>.25)cursorFrame=requestAnimationFrame(moveCursor);}
    const follow=e=>{const p=localPoint(e);inside=p.x>=0&&p.x<=w&&p.y>=0&&p.y<=h;cursorTarget=p;if(tool&&inside&&!reduced.matches){cursor.style.opacity='1';if(!cursorFrame)cursorFrame=requestAnimationFrame(moveCursor);}else cursor.style.opacity='0';return p;};
    function mark(p){
      if(!tool||!ready)return;if(revealFrame){cancelAnimationFrame(revealFrame);revealFrame=0;textLayer(false);}
      if(p.x<0||p.x>w||p.y<0||p.y>h){last=null;return;}
      const prev=last||p;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.lineCap='round';ctx.lineJoin='round';ctx.globalAlpha=1;
      if(tool==='eraser'){ctx.globalCompositeOperation='destination-out';ctx.strokeStyle='#000';ctx.lineWidth=48;ctx.beginPath();ctx.moveTo(prev.x,prev.y);ctx.lineTo(p.x+.01,p.y+.01);ctx.stroke();}
      else{ctx.globalCompositeOperation='source-over';ctx.strokeStyle='#edeedeae';ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(prev.x,prev.y);ctx.lineTo(p.x+.01,p.y+.01);ctx.stroke();const n=Math.max(1,Math.ceil(Math.hypot(p.x-prev.x,p.y-prev.y)/2));for(let i=0;i<n;i++){const t=i/n;ctx.fillStyle=`rgba(236,238,224,${.08+Math.random()*.22})`;ctx.fillRect(prev.x+(p.x-prev.x)*t+(Math.random()-.5)*7,prev.y+(p.y-prev.y)*t+(Math.random()-.5)*7,.5+Math.random(),.5+Math.random());}}
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
