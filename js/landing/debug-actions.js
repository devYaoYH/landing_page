/* Handlers for the debug toolbar buttons. */

function toggleGameOfLife(btn) {
  SHOW_GOL = !SHOW_GOL;
  btn.classList.toggle('active');
}

function toggleNightMode(btn) {
  flag_enable_night_mode = !flag_enable_night_mode;
  btn.classList.toggle('active');
  document.getElementById('headline').style.color = flag_enable_night_mode ? '#FFFFFF' : '';
}

function explodeAllClouds(btn) {
  if (btn.dataset.cooldown) return;
  clouds.forEach(c => {
    if (!c.isDissapated) {
      c.isDissapated = true;
      cloud_maker.explodeCloud(c);
    }
  });
  setTimeout(() => { clouds = []; }, 2000);
  btn.dataset.cooldown = 1;
  btn.classList.add('cooldown');
  setTimeout(() => {
    delete btn.dataset.cooldown;
    btn.classList.remove('cooldown');
  }, 3000);
}
