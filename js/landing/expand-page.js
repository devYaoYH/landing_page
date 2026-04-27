/* Hero→banner transition: cloud wipe wave, blog reveal, polar-city handoff. */

// Spawn a dense L→R sweep of fast clouds that fully covers the banner before
// drifting off the right edge. The polar city is mounted on a layer behind
// this curtain so it's revealed as the clouds clear. Existing slow-drifting
// clouds get caught up in the wave too.
function triggerCloudWipe() {
  for (const c of clouds) {
    c.velocity.x = Math.max(c.velocity.x, 0) + 4 + Math.random() * 12;
  }
  const bannerH = Math.max(window.innerHeight * 0.20, 180);
  for (let i = 0; i < 45; i++) {
    const c = cloud_maker.makeCloud();
    c.location.x = -300 + Math.random() * x_lim * 0.6;
    c.location.y = Math.random() * bannerH * 1.05;
    c.velocity.x = 4 + Math.random() * 14;
    clouds.push(c);
  }
}

function expandPage() {
  const hero = document.getElementById('hero');
  const blog = document.getElementById('blog');
  const arrow = document.getElementById('scroll-arrow');
  const headline = document.getElementById('headline');
  arrow.classList.remove('visible');
  headline.classList.add('fading');
  document.querySelector('.debug-toolbar')?.style.setProperty('display', 'none');
  hero.classList.add('collapsed');

  setTimeout(() => {
    headline.style.display = 'none';
    arrow.style.display = 'none';
  }, 400);

  setTimeout(() => {
    blog.classList.add('visible');
  }, 700);

  const WIPE_DELAY = 350;
  setTimeout(() => {
    CLOUD_WIPE_ACTIVE = true;
    triggerCloudWipe();
  }, WIPE_DELAY);

  // Mount polar city BEHIND the cloud canvas while the curtain covers the
  // banner. Hero has finished collapsing by now, so PIXI sizes to the final
  // 20vh strip.
  setTimeout(() => {
    const callout = document.querySelector('.callout');
    const cloudCanvas = document.getElementById('canvas');
    const polarStage = document.createElement('div');
    polarStage.id = 'polar-stage';
    callout.insertBefore(polarStage, cloudCanvas);
    if (window.__mountPolarCity) window.__mountPolarCity();
  }, WIPE_DELAY + 600);

  // Once the wave has drifted off-right, retire the cloud animation and
  // remove its canvas — the polar stage is what stays.
  setTimeout(() => {
    PLAY_ANIMATION = false;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      document.getElementById('canvas')?.remove();
      document.body.style.background = '#f4f7fa';
    }));
  }, WIPE_DELAY + 4200);
}
