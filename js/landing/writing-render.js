/* Render the writing list from data/writing.js. */

import { writing } from '../../data/writing.js';
import { escape, paragraphs } from './render-helpers.js';

function entryHtml(w) {
  const tags = (w.tags || [])
    .map((t) => `<span class="tag">${escape(t)}</span>`)
    .join('');
  const link = w.link
    ? `<a href="${escape(w.link.href)}" class="post-link">${escape(w.link.label)}</a>`
    : '';

  return `<li class="post-item">
    <span class="post-date">${escape(w.date)}</span>
    <div class="post-body">
      <div class="post-tags">${tags}</div>
      <h3 class="post-title">${escape(w.title)}</h3>
      ${paragraphs(w.excerpt, 'post-excerpt')}
      ${link}
    </div>
  </li>`;
}

window.fragmentsReady.then(() => {
  const list = document.querySelector('#section-writing .post-list');
  if (!list) return;
  list.innerHTML = writing.map(entryHtml).join('');
});
