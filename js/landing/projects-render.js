/* Render the projects timeline from data/projects.js. Waits for the page
   fragments to be injected so the .project-timeline target exists. */

import { projects } from '../../data/projects.js';
import { escape, paragraphs } from './render-helpers.js';

// "Claude Approved" sticker overlay — toggles open on click to reveal bullets.
function stampHtml(s) {
  const bullets = (s.bullets || []).map((b) => `<li>${escape(b)}</li>`).join('');
  return `<div class="stamp-sticker" onclick="this.classList.toggle('stamp-open')">
    <div class="stamp-badge">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D97757" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
    </div>
    <div class="stamp-title">
      <svg class="stamp-icon" viewBox="0 0 100 100" fill="#D97757"><path d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z"/></svg> ${escape(s.title)}
    </div>
    <div class="stamp-details"><ul>${bullets}</ul></div>
  </div>`;
}

function entryHtml(p, i) {
  const idx = String(i + 1).padStart(2, '0');
  const tags = (p.tags || [])
    .map((t) => `<span class="stack-tag">${escape(t)}</span>`)
    .join('');
  const link = p.link
    ? `<a href="${escape(p.link.href)}" class="project-offsite" target="_blank" rel="noopener">${escape(p.link.label)} ↗</a>`
    : '';
  const stamp = p.stamp ? stampHtml(p.stamp) : '';
  const linkAttr = p.link && !p.imageNoLink ? ` href="${escape(p.link.href)}" target="_blank" rel="noopener"` : '';
  const mediaTag = p.link && !p.imageNoLink ? 'a' : 'div';
  let media;
  if (p.youtube) {
    media = `<div class="project-media-cell"><div class="project-media project-media--video"><iframe src="https://www.youtube-nocookie.com/embed/${escape(p.youtube)}" title="${escape(p.title)}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>${stamp}</div></div>`;
  } else if (p.image) {
    media = `<div class="project-media-cell"><${mediaTag} class="project-media${p.link ? ' project-media--linked' : ''}"${linkAttr}><img src="${escape(p.image)}" alt="${escape(p.title)}" loading="lazy" decoding="async" onerror="this.style.display='none'">${stamp}</${mediaTag}></div>`;
  } else {
    media = `<div class="project-media-cell"></div>`;
  }

  return `<li class="project-entry">
    <div class="project-content">
      <h3 class="project-name">${escape(p.title)}</h3>
      <div class="project-stack">${tags}</div>
      ${paragraphs(p.description, 'project-desc')}
      ${link}
    </div>
    <div class="project-marker"><span class="project-index">${idx}</span></div>
    ${media}
  </li>`;
}

window.fragmentsReady.then(() => {
  const list = document.querySelector('#section-projects .project-timeline');
  if (!list) return;
  list.innerHTML = projects.map(entryHtml).join('');
});
