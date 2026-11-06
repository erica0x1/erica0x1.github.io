export function renderHome({projects,esc,image,head,header,tail}) {
  const featured=projects.slice(0,3);
  const rest=projects.slice(3);
  const cardDetails=p=>[
    ...[p.slug==='line-by-line'?'USC AGP':null,p.solo?'Solo project':p.role].filter(Boolean).map(esc),
    ...(p.period?[`<span class="card-period">${esc(p.period)}</span>`]:[])
  ].join(' · ');
  const tile=(p,i,featured=false)=>`<article class="studio-project ${i===0&&featured?'studio-feature':''}" data-game-category="${p.category}"${p.slug==='line-by-line'?' style="--card-background:#39352e"':''}><a href="projects/${p.slug}.html"><div class="studio-project-image${p.cardFit==='contain'?' fit-contain':''}" data-dither><img src="${image(p.cover)}" alt="${esc(p.coverAlt)}" loading="${featured?'eager':'lazy'}" decoding="async"><canvas class="dither-layer" aria-hidden="true"></canvas></div><div class="studio-project-caption"><h3>${esc(p.title)}</h3><p>${cardDetails(p)}</p></div></a></article>`;
  return `${head('Erica Lin — Games & little worlds','Games, spaces, and interactive stories by Erica Lin. Game and level design at USC.').replace('<body>','<body class="studio-home">')}${header()}
<main id="main">
  <section class="studio-hero wrap" aria-labelledby="hero-title">
    <div class="blackboard-frame"><picture class="board-paper-chain" aria-hidden="true"><source media="(max-width:760px)" srcset="assets/studio/classroom-paper-chain-mobile.svg"><img src="assets/studio/classroom-paper-chain.svg" alt="" draggable="false"></picture><img class="board-paper-stars" src="assets/studio/classroom-paper-stars.svg" alt="" aria-hidden="true" draggable="false"><img class="holiday-ornaments" src="assets/studio/holiday-ornaments.svg" alt="" aria-hidden="true" draggable="false">
      <div class="blackboard" data-blackboard>
        <div class="board-copy"><h1 id="hero-title">Erica Lin</h1><ul class="board-roles" aria-label="What I do"><li><span>Game Designer</span></li><li><span>Level Designer</span></li><li><span>Systems Designer</span></li><li><span>Gameplay Programmer</span></li></ul></div>
        <canvas id="chalk-canvas" aria-label="An interactive chalkboard. Pick up the chalk to draw, or the eraser to wipe it." role="img"></canvas>
        <div class="board-cursor-clip" aria-hidden="true"><div class="board-cursor"><img src="assets/studio/chalk.webp" alt=""></div></div>
        <div class="board-tool-row"><span class="board-hint" id="board-hint">leave a little doodle ↘</span><div class="board-tools" role="group" aria-label="Chalkboard tools"><button class="chalk-tool" type="button" data-board-tool="chalk" aria-label="Pick up the chalk" aria-pressed="false" aria-describedby="board-hint"><img src="assets/studio/chalk.webp" alt="A piece of white chalk" draggable="false"></button><button class="eraser-tool" type="button" data-board-tool="eraser" aria-label="Pick up the eraser" aria-pressed="false" aria-describedby="board-hint"><img src="assets/studio/eraser.webp" alt="A wooden chalkboard eraser with charcoal felt" draggable="false"></button></div></div>
      </div><div class="board-ledge" aria-hidden="true"></div>
    </div>
    <div class="board-foot"><button type="button" class="quiet-button" data-restore-board>↺ restore the board</button></div>
  </section>
  <section class="selected-work wrap" id="work" aria-labelledby="work-title">
    <div class="studio-section-heading"><h2 id="work-title">my games</h2><div class="work-filters" role="group" aria-label="Filter games by format"><button type="button" data-work-filter="all" aria-pressed="true">All</button><button type="button" data-work-filter="digital" aria-pressed="false">Digital</button><button type="button" data-work-filter="tabletop" aria-pressed="false">Tabletop</button></div></div>
    <p class="sr-only" aria-live="polite" data-work-status>Showing ${featured.length} selected games.</p>
    <div class="selected-grid">${featured.map((p,i)=>tile(p,i,true)).join('')}</div>
    <div class="more-games" id="more-games" inert><div class="more-games-inner"><div class="archive-grid">${rest.map((p,i)=>tile(p,i)).join('')}</div></div></div>
    <div class="all-games-action"><button type="button" class="all-games-toggle" aria-expanded="false" aria-controls="more-games" data-toggle-games><span data-games-label>view all games</span><span class="toggle-mark" aria-hidden="true">+</span></button></div>
  </section>
  <section class="studio-about wrap" id="about" aria-labelledby="about-title">
    <h2 id="about-title">about me !</h2>
    <div class="about-layout">
      <figure class="about-photo"><img src="${image('erica-portrait-boo')}" alt="Erica Lin" loading="lazy" decoding="async" width="1084" height="2080"></figure>
      <div class="about-bio">
        <p>I'm an MS student in Game Design and Development at USC’s School of Cinematic Arts, with an undergraduate degree in Mathematics with Applied Mathematics from the University of Nottingham, UK.</p>
        <p>I enjoy deck-builders like Dicey Dungeons and Slay the Spire, and story-driven games like OMORI and Doki Doki Literature Club. I also love rhythm games like maimai.</p>
        <p>Outside of games, I’m a huge Vocaloid fan, love dancing, and get especially excited about Christmas.</p>
      </div>
    </div>
  </section>
  <section class="studio-contact wrap" id="contact"><h2>contact me</h2><div class="studio-contact-links"><a href="mailto:ericaalin@outlook.com">ericaalin@outlook.com</a><a href="https://ericalin.itch.io/" target="_blank" rel="noopener noreferrer">itch.io</a></div></section>
</main>
<aside class="desk-companions" aria-label="Your little studio companions"><img class="cat-present" src="assets/studio/pixel-present.svg" alt="" aria-hidden="true" draggable="false">
  <div class="pet-bubble" role="status" aria-live="polite" data-pet-bubble>psst… pet me?</div>
  <button class="desktop-cat" type="button" aria-label="Pet the little gray cat" data-pet-cat><span class="cat-sprites"><img class="cat-frame cat-idle" src="assets/studio/cat-idle.webp" alt="A small gray and white pixel kitten" draggable="false"><img class="cat-frame cat-blink" src="assets/studio/cat-blink.webp" alt="" draggable="false"><img class="cat-frame cat-pet" src="assets/studio/cat-pet.webp" alt="" draggable="false"><img class="cat-frame cat-sleep" src="assets/studio/cat-sleep.webp" alt="" draggable="false"><img class="cat-frame cat-music" src="assets/studio/cat-music.webp" alt="" draggable="false"></span><span class="pet-heart" aria-hidden="true">♡</span></button>
  <div class="music-bubble" aria-hidden="true">wanna listen to music?</div>
  <button class="radio-toggle" type="button" aria-label="Open Erica’s playlist" aria-expanded="false" aria-controls="studio-radio" data-radio-toggle><img class="pixel-cd" src="assets/studio/pixel-cd.svg" alt="" draggable="false"></button>
</aside>
<section class="studio-radio" id="studio-radio" aria-label="Erica's Spotify playlist" inert><div class="radio-panel-head"><span>a soundtrack for wandering</span><button type="button" aria-label="Close music player" data-radio-close>×</button></div><div class="spotify-holder" data-spotify-holder></div><a class="spotify-external" href="https://open.spotify.com/playlist/2PaJIekKDK5GO3qzfKL73n" target="_blank" rel="noopener noreferrer">open the full playlist in Spotify</a></section>
<script src="studio.js?v=12" defer></script>
${tail('')}`;
}
