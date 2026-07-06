/* Render the research section as a question-led journal layout. Distinct
   shape from the projects timeline — each entry leads with the open question
   in a serif display face, followed by lab/date metadata and prose. */

import { research } from '../../data/research.js';
import { escape, paragraphs } from './render-helpers.js';

function entryHtml(r) {
  const tags = (r.tags || [])
    .map((t) => `<span class="research-tag">${escape(t)}</span>`)
    .join('');
  const links = (r.links || (r.link ? [r.link] : []))
    .map((l) => `<a href="${escape(l.href)}" class="research-link" target="_blank" rel="noopener">${escape(l.label)} ↗</a>`)
    .join('');
  const linkRow = links ? `<div class="research-links">${links}</div>` : '';
  const meta = [r.lab, r.date].filter(Boolean).map(escape).join(' · ');

  return `<li class="research-entry">
    <p class="research-question">${escape(r.question)}</p>
    <div class="research-meta">${meta}</div>
    ${paragraphs(r.description, 'research-prose')}
    <div class="research-tags">${tags}</div>
    ${linkRow}
  </li>`;
}

window.fragmentsReady.then(() => {
  const list = document.querySelector('#section-research .research-list');
  if (!list) return;
  list.innerHTML = research.map(entryHtml).join('');
});
