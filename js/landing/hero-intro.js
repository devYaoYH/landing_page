/* Typewriter intro for the headline + reveal of the scroll arrow. */

let isOdd = false;
const blinkInterval = setInterval(() => {
  const mainDiv = document.getElementById('headline');
  if (!mainDiv || mainDiv.dataset.transitioning) return;
  const disp = 'Construction in Progress'+(isOdd?'_':'.');
  mainDiv.innerHTML = disp;
  isOdd = !isOdd;
}, 1000);

setTimeout(() => {
  const headline = document.getElementById('headline');
  headline.dataset.transitioning = 'true';
  clearInterval(blinkInterval);

  const baseText = 'Construction in Progress.';
  let i = baseText.length;
  headline.innerHTML = baseText;

  const backspaceId = setInterval(() => {
    i--;
    headline.innerHTML = baseText.substring(0, i) + '_';
    if (i <= 0) {
      clearInterval(backspaceId);
      headline.innerHTML = '_';
      setTimeout(typeNewMessage, 200);
    }
  }, 60);

  function typeNewMessage() {
    const msg = "Let's see what we've been working on!";
    let j = 0;
    const typeId = setInterval(() => {
      j++;
      headline.innerHTML = msg.substring(0, j) + (j % 2 === 0 ? '_' : '');
      if (j >= msg.length) {
        clearInterval(typeId);
        headline.innerHTML = msg;
        setTimeout(() => {
          const arrow = document.getElementById('scroll-arrow');
          arrow.classList.add('visible');
          window.addEventListener('wheel', function onScroll(e) {
            if (e.deltaY > 0 && arrow.classList.contains('visible')) {
              window.removeEventListener('wheel', onScroll);
              expandPage();
            }
          }, { passive: true });
        }, 500);
      }
    }, 50);
  }
}, 2000);
