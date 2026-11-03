export function renderHome({projects,esc,image,head,header,tail}) {
  const featured=['line-by-line','sleepwalk','to-rei'].map(slug=>projects.find(p=>p.slug===slug));
  const rest=projects.filter(p=>!featured.includes(p));
  const tile=(p,i,shader=false)=>`<article class="studio-project ${i===0&&shader?'studio-feature':''}"><a href="projects/${p.slug}.html"><div class="studio-project-image${p.slug==='sleepwalk'?' sleepwalk-image':''}"${shader?' data-dither':''}><img src="${image(p.cover)}" alt="${esc(p.coverAlt)}" loading="${shader?'eager':'lazy'}" decoding="async">${shader?'<canvas class="dither-layer" aria-hidden="true"></canvas>':''}<span class="project-open" aria-hidden="true">↗</span></div><div class="studio-project-caption"><h3>${esc(p.title)}</h3><p>${esc(p.role)}${p.slug==='line-by-line'?' · USC AGP':''}</p></div></a></article>`;
  return `${head('Erica Lin — Games & little worlds','Games, spaces, and interactive stories by Erica Lin. Game and level design at USC.').replace('<body>','<body class="studio-home">')}${header()}
<main id="main">
  <section class="studio-hero wrap" aria-labelledby="hero-title">
    <div class="blackboard-frame"><img class="holiday-ornaments" src="assets/studio/holiday-ornaments.svg" alt="" aria-hidden="true" draggable="false">
      <div class="blackboard" data-blackboard>
        <div class="board-copy"><h1 id="hero-title">Erica Lin.</h1><p>Game & level designer at USC.<br>Spaces to explore.<br>Stories to piece together.</p></div>
        <canvas id="chalk-canvas" aria-label="An interactive chalkboard. Pick up the chalk to draw, or the eraser to wipe it." role="img"></canvas>
        <div class="board-cursor" aria-hidden="true"><img src="assets/studio/chalk.webp" alt=""></div>
        <div class="board-tool-row"><span class="board-hint" id="board-hint">leave a little doodle ↘</span><div class="board-tools" role="group" aria-label="Chalkboard tools"><button class="chalk-tool" type="button" data-board-tool="chalk" aria-label="Pick up the chalk" aria-pressed="false" aria-describedby="board-hint"><img src="assets/studio/chalk.webp" alt="A piece of white chalk" draggable="false"></button><button class="eraser-tool" type="button" data-board-tool="eraser" aria-label="Pick up the eraser" aria-pressed="false" aria-describedby="board-hint"><img src="assets/studio/eraser.webp" alt="A wooden chalkboard eraser with charcoal felt" draggable="false"></button></div></div>
      </div><div class="board-ledge" aria-hidden="true"></div>
    </div>
    <div class="board-foot"><span>a little space to play.</span><button type="button" class="quiet-button" data-restore-board>↺ restore the board</button></div>
  </section>
  <section class="selected-work wrap" id="work" aria-labelledby="work-title">
    <div class="studio-section-heading"><h2 id="work-title">Selected work</h2><span>digital + tabletop · 2026</span></div>
    <div class="selected-grid">${featured.map((p,i)=>tile(p,i,true)).join('')}</div>
    <div class="all-games-action"><button type="button" class="all-games-toggle" aria-expanded="false" aria-controls="more-games" data-toggle-games><span data-games-label>View all 9 games</span><span class="toggle-mark" aria-hidden="true">+</span></button><span class="handwritten">a few more worlds to get lost in</span></div>
    <div class="more-games" id="more-games" inert><div class="more-games-inner"><div class="archive-grid">${rest.map((p,i)=>tile(p,i)).join('')}</div></div></div>
  </section>
  <section class="studio-about wrap" id="about" aria-labelledby="about-title">
    <div class="about-heading"><div><p class="studio-kicker">off the screen</p><h2 id="about-title">A little more me.</h2></div><button type="button" class="quiet-button about-toggle-label" aria-controls="personal-papers" aria-expanded="false" data-toggle-about><span data-about-label>open my little folder</span><span aria-hidden="true"> ↗</span></button></div>
    <div class="paper-scene" data-paper-scene>
      <div class="personal-papers" id="personal-papers" inert aria-hidden="true">
        <figure class="personal-paper portrait-paper" style="--paper-i:0;--paper-rotation:-5deg"><div class="tape" aria-hidden="true"></div><img src="${image('erica-portrait')}" alt="Erica Lin" loading="lazy"><figcaption>hi, i'm erica :)</figcaption><span class="paper-small">currently making games at USC</span></figure>
        <article class="personal-paper letter-paper" style="--paper-i:1;--paper-rotation:2deg"><p class="paper-date">a note from my desk</p><h3>Hello, you.</h3><p>I’m Erica, a game designer and developer at USC.</p><p>I make spaces to explore, systems to figure out, and stories to piece together.</p><p>I’m drawn to that little moment when a place, a rule, or a relationship starts to make sense.</p><span class="paper-signature">erica</span></article>
        <article class="personal-paper notebook-paper" style="--paper-i:2;--paper-rotation:5deg"><span class="paper-small">things on my worktable</span><h3>Always making.</h3><p>Spatial puzzles.<br>Quiet little stories.<br>Theatre layouts.<br>Games around a table.</p><div class="notebook-tags"><span>level design</span><span>game design</span><span>Unity</span><span>prototyping</span></div><a href="https://ericalin.itch.io/" target="_blank" rel="noopener noreferrer">find my games on itch.io ↗</a></article>
      </div>
      <button class="paper-envelope" type="button" data-toggle-about aria-label="Open Erica's personal folder" aria-controls="personal-papers" aria-expanded="false"><span class="envelope-back"></span><span class="envelope-flap"></span><span class="envelope-front"><span class="envelope-stamp" aria-hidden="true"><img src="assets/studio/holly-stamp.svg" alt="" draggable="false"></span><span class="envelope-address">a little more me.</span><span class="envelope-subtitle">photos, notes & other little things</span></span></button>
      <span class="envelope-caption handwritten" data-envelope-caption>there's a person behind the pixels.</span>
    </div>
  </section>
  <section class="studio-contact wrap" id="contact"><div><p class="studio-kicker">say hello</p><h2>Let’s make<br><em>something playful.</em></h2></div><div class="studio-contact-links"><a href="mailto:ericalin@usc.edu">ericalin@usc.edu ↗</a><a href="https://ericalin.itch.io/" target="_blank" rel="noopener noreferrer">itch.io ↗</a></div></section>
</main>
<aside class="desk-companions" aria-label="Your little studio companions"><img class="cat-present" src="assets/studio/pixel-present.svg" alt="" aria-hidden="true" draggable="false">
  <div class="pet-bubble" role="status" aria-live="polite" data-pet-bubble>psst… pet me?</div>
  <button class="desktop-cat" type="button" aria-label="Pet the little gray cat" data-pet-cat><span class="cat-sprites"><img class="cat-frame cat-idle" src="assets/studio/cat-idle.webp" alt="A small gray and white pixel kitten" draggable="false"><img class="cat-frame cat-blink" src="assets/studio/cat-blink.webp" alt="" draggable="false"><img class="cat-frame cat-pet" src="assets/studio/cat-pet.webp" alt="" draggable="false"><img class="cat-frame cat-sleep" src="assets/studio/cat-sleep.webp" alt="" draggable="false"></span><span class="pet-heart" aria-hidden="true">♡</span></button>
  <button class="radio-toggle" type="button" aria-expanded="false" aria-controls="studio-radio" data-radio-toggle><span class="mini-record" aria-hidden="true"></span><span>studio radio</span><span class="radio-plus" aria-hidden="true">+</span></button>
</aside>
<section class="studio-radio" id="studio-radio" aria-label="Erica's Spotify playlist" inert><div class="radio-panel-head"><span>a soundtrack for wandering</span><button type="button" aria-label="Close music player" data-radio-close>×</button></div><div class="spotify-holder" data-spotify-holder></div><a class="spotify-external" href="https://open.spotify.com/playlist/2PaJIekKDK5GO3qzfKL73n" target="_blank" rel="noopener noreferrer">open the full playlist in Spotify ↗</a></section>
<script src="studio.js" defer></script>
${tail('')}`;
}
