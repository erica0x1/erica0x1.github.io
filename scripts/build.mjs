import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderHome } from './home-template.mjs';
import { renderProject } from './project-template.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const projects=JSON.parse(fs.readFileSync(path.join(root,'content/projects.json'),'utf8'));
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const image=(name,prefix='')=>`${prefix}assets/images/${name}.webp`;
const external='target="_blank" rel="noopener noreferrer"';
const header=(prefix='')=>`<a class="skip" href="#main">Skip to content</a><header class="site-header"><div class="wrap header-inner"><a class="brand" href="${prefix}index.html" aria-label="Erica Lin — home"><span class="brand-name">erica lin</span> <span class="brand-face" aria-hidden="true"><span>:</span><span>3</span></span></a><nav class="nav" aria-label="Main navigation"><a href="${prefix}index.html#work">Work</a><a href="${prefix}index.html#about">About</a><a class="nav-contact" href="${prefix}index.html#contact">Contact ↗</a></nav></div></header>`;
const footer=(prefix='')=>`<footer class="wrap footer"><span>© 2026 Erica Lin</span><a href="${prefix}index.html#work">Made for play. Built with curiosity. ↗</a></footer>`;
const head=(title,description,prefix='')=>`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f4f2eb"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="website"><link rel="icon" href="${prefix}favicon.ico?v=3" sizes="any"><link rel="icon" type="image/png" sizes="32x32" href="${prefix}favicon-32.png?v=3"><link rel="icon" type="image/svg+xml" href="${prefix}favicon.svg?v=3"><link rel="apple-touch-icon" sizes="180x180" href="${prefix}apple-touch-icon.png?v=3"><meta name="apple-mobile-web-app-title" content="Erica Lin"><link rel="stylesheet" href="${prefix}styles.css"><link rel="stylesheet" href="${prefix}studio.css?v=12"><script src="${prefix}app.js?v=6" defer></script></head><body>`;
const tail=prefix=>`${footer(prefix)}</body></html>`;
const card=(p,i)=>{
 const fit=['spatial-tinting','melodic-function','dismember','makeup-class','dear-little-alice','sleepwalk'].includes(p.slug)?' contain':p.slug==='last-call'?' portrait':'';
 return `<article class="project-card" data-category="${p.category}"><a href="projects/${p.slug}.html"><div class="card-image${fit}"><img src="${image(p.cover)}" alt="${esc(p.coverAlt)}" loading="${i<3?'eager':'lazy'}" decoding="async" width="900" height="600"><span class="card-arrow" aria-hidden="true">↗</span></div><div class="card-meta"><span class="tag">${esc(p.eyebrow)}</span><span class="card-role">${esc(p.role)}</span></div><h3 class="card-title">${esc(p.title)}</h3><p class="card-summary">${esc(p.summary)}</p></a></article>`;
};

const homepage=renderHome({projects,esc,image,head,header,tail});
fs.writeFileSync(path.join(root,'index.html'),homepage);

const lightbox=`<dialog class="lightbox" id="lightbox" aria-label="Project image viewer" data-zoom="false"><div class="lightbox-top"><p><span data-viewer-label>PROJECT GALLERY</span> · <span data-counter></span></p><button class="close" data-close aria-label="Close image viewer">×</button></div><div class="lightbox-image-wrap"><img class="lightbox-image" alt=""></div><div class="lightbox-bottom"><p data-caption></p><div class="lightbox-controls"><button data-prev aria-label="Previous image">←</button><button data-zoom-toggle aria-pressed="false">Full size</button><button data-next aria-label="Next image">→</button></div></div></dialog>`;
const figures=(items,prefix='../')=>items.map(item=>`<figure${items.length===1?' class="wide"':''}><button type="button" data-lightbox="${image(item.image,prefix)}" data-caption="${esc(item.caption)}" aria-label="Enlarge: ${esc(item.caption)}"><img src="${image(item.image,prefix)}" alt="${esc(item.caption)}" loading="lazy" decoding="async"></button></figure>`).join('');
fs.mkdirSync(path.join(root,'projects'),{recursive:true});
projects.forEach((p,i)=>{
 const next=projects[(i+1)%projects.length];
 const page=renderProject({p,next,esc,image,head,header,tail,figures,lightbox,external});
 fs.writeFileSync(path.join(root,'projects',`${p.slug}.html`),page);
});
const rules=Array.from({length:10},(_,i)=>({image:`makeup-rulebook-${i+1}`,caption:`Makeup Class rulebook — page ${i+1} of 10.`}));
fs.writeFileSync(path.join(root,'projects','makeup-class-rulebook.html'),`${head('Makeup Class — Rulebook','The complete ten-page rulebook for Makeup Class, a physical board game by Erica Lin.','../')}${header('../')}<main class="wrap" id="main"><a class="breadcrumb" href="makeup-class.html">← Back to Makeup Class</a><header class="project-header"><p class="eyebrow">Makeup Class / How to play</p><h1>The rulebook.</h1></header><p class="rulebook-intro">All ten pages from the original game. Select a page to open it, then choose “Full size” to read it at its original resolution.</p><section class="gallery-section" aria-label="Rulebook pages"><div class="gallery">${figures(rules)}</div></section></main>${lightbox}${tail('../')}`);
console.log(`Built homepage, ${projects.length} project pages, and the complete rulebook.`);
