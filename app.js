(() => {
  const filters = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('[data-category]')];
  const count = document.querySelector('#project-count');
  filters.forEach(button => button.addEventListener('click', () => {
    const value = button.dataset.filter;
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let visible = 0;
    cards.forEach(card => { card.hidden = value !== 'all' && card.dataset.category !== value; if (!card.hidden) visible++; });
    if (count) count.textContent = `${String(visible).padStart(2, '0')} projects · ${value === 'all' ? 'all work' : value === 'digital' ? 'digital games' : 'tabletop games'}`;
  }));

  const dialog = document.querySelector('#lightbox');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const triggers = [...document.querySelectorAll('[data-lightbox]')];
  let images = [];
  const preview = dialog.querySelector('.lightbox-image');
  const caption = dialog.querySelector('[data-caption]');
  const counter = dialog.querySelector('[data-counter]');
  const viewerLabel = dialog.querySelector('[data-viewer-label]');
  const zoom = dialog.querySelector('[data-zoom-toggle]');
  let index = 0;
  const resetZoom = () => { dialog.dataset.zoom = 'false'; zoom.textContent = 'Full size'; zoom.setAttribute('aria-pressed','false'); };
  const show = next => {
    index = (next + images.length) % images.length;
    const trigger = images[index];
    preview.src = trigger.dataset.lightbox;
    preview.alt = trigger.dataset.caption;
    caption.textContent = trigger.dataset.imageGroup==='portfolio'?trigger.dataset.caption:'';
    caption.hidden = !caption.textContent;
    counter.textContent = `${index + 1} / ${images.length}`;
    resetZoom();
  };
  triggers.forEach(trigger => trigger.addEventListener('click', () => {
    const group=trigger.dataset.imageGroup||'gallery';
    images = triggers.filter(item => (item.dataset.imageGroup||'gallery')===group && (!item.closest('details') || item.closest('details').open));
    if(viewerLabel)viewerLabel.textContent=group==='portfolio'?'DESIGN PORTFOLIO':'PROJECT GALLERY';
    show(images.indexOf(trigger)); dialog.showModal(); document.body.classList.add('dialog-open');
  }));
  dialog.querySelector('[data-close]').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>document.body.classList.remove('dialog-open'));
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  dialog.querySelector('[data-prev]').addEventListener('click',()=>show(index-1));
  dialog.querySelector('[data-next]').addEventListener('click',()=>show(index+1));
  dialog.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();show(index+1)}if(event.key==='ArrowLeft'){event.preventDefault();show(index-1)}});
  zoom.addEventListener('click',()=>{const enlarged=dialog.dataset.zoom!=='true';dialog.dataset.zoom=String(enlarged);zoom.setAttribute('aria-pressed',String(enlarged));zoom.textContent=enlarged?'Fit to screen':'Full size';});
})();
