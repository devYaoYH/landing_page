function showSection(name, el) {
  document.querySelectorAll('.blog-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.blog-nav-bar a').forEach(a => a.classList.remove('active'));
  document.getElementById('section-' + name).classList.add('active');
  el.classList.add('active');
  document.getElementById('blog').scrollTop = 0;
}
