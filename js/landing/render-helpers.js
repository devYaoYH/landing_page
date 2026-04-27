/* Tiny helpers shared by the data-driven section renderers. */

export const escape = (s) => String(s).replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

// Split prose on blank lines so authors can write real paragraphs in
// template literals. Each paragraph gets escaped individually.
export const paragraphs = (text, className) =>
  String(text).trim().split(/\n\s*\n/)
    .map((p) => `<p class="${className}">${escape(p.trim())}</p>`)
    .join('');
