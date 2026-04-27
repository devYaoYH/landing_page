/* Cloud + Game-of-Life canvas scene that owns the hero animation. Globals are
   intentional — inline onclick handlers and other landing scripts read them. */

let PLAY_ANIMATION = true;
let SHOW_DEMO = false;
let SHOW_GOL = true;
// While true, suppress the auto cloud-spawn in draw() — we're running a
// hand-crafted wipe wave during the hero→banner transition.
let CLOUD_WIPE_ACTIVE = false;
let PAUSE_TIME = 0;
let PAUSE_OFFSET = 0;
function getAnimationTime(){
  return window.performance.now()+PAUSE_OFFSET;
}
let flag_enable_night_mode = false;
const cur_hour = (new Date()).getHours();
const is_night_time = (cur_hour >= 20 || cur_hour < 6);

const cloud_maker = CloudMaker();
const game_of_life = GameOfLife();
const demo_obj = makeDemoAnimationObject();
const game_of_life_grid = AnimationObject();

function initialize(){
  if (flag_enable_night_mode){
    document.getElementById('headline').style.color = "#FFFFFF";
  }
  game_of_life_grid.location = makePoint(0, window.innerHeight*0);
  game_of_life.initialize(game_of_life_grid, window.innerWidth, window.innerHeight);
}

function dissapateCloud(){
  if (!PLAY_ANIMATION) return;
  clouds.forEach(function(cloud){
    if (cloud.isDissapated === true) return;
    const mouse_obj = AnimationObject();
    mouse_obj.location = mouse_location;
    const did_intersect = cloud.shape.getCollider().doesIntersect(Cpoint(mouse_obj));
    if (did_intersect === true){
      cloud.isDissapated = true;
      cloud_maker.explodeCloud(cloud);
      setTimeout(function(){
        clouds = clouds.filter((c) => c !== cloud);
      }, 2000);
    }
  });
}

let x_lim = 0, y_lim = 0;
let mouse_location = makePoint(0, 0);
let clouds = [];
let birds = [];

window.addEventListener('load', () => {
  initialize();
  resize();
  const canvas = document.getElementById('canvas');
  canvas.addEventListener('mousemove', (evt) => {
    const mPos = getMousePos(canvas, evt);
    mouse_location = makePoint(mPos.x, mPos.y);
  });
  document.body.onkeyup = function(e){
    if(e.keyCode == 32){
      PLAY_ANIMATION = !PLAY_ANIMATION;
      if (PLAY_ANIMATION){
        PAUSE_OFFSET += PAUSE_TIME - window.performance.now();
        window.requestAnimationFrame(draw);
      }
      else {
        PAUSE_TIME = window.performance.now();
      }
    }
    else if (e.keyCode == 69){
      clouds.forEach(function(cloud){
        cloud.children.forEach((child) => child.velocity = makeVector(Math.random()-0.5, Math.random()-0.5));
      });
    }
  };
  canvas.addEventListener('click', dissapateCloud, false);
  window.requestAnimationFrame(draw);
});
window.onresize = resize;

function resize(){
  const canvas = document.getElementById('canvas');
  if (canvas === null) return;
  x_lim = canvas.width = window.innerWidth;
  y_lim = canvas.height = window.innerHeight;
  game_of_life_grid.location = makePoint(0, y_lim*0);
  game_of_life.initialize(game_of_life_grid, x_lim, y_lim);
}
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function draw() {
  const ctx = document.getElementById('canvas').getContext('2d');
  ctx.clearRect(0, 0, x_lim, y_lim);
  clouds = clouds.filter((cloud) => cloud_maker.isOnScreen(cloud));
  if (!CLOUD_WIPE_ACTIVE && clouds.length < Math.round(x_lim/100)) clouds.push(cloud_maker.makeCloud());
  clouds.forEach((cloud) => { cloud.animate(); cloud.draw(ctx); });
  if (SHOW_GOL) {
    game_of_life.play();
    game_of_life_grid.animate();
    game_of_life_grid.draw(ctx);
  }
  birds = birds.filter(b => b.location.x > -50 && b.location.x < x_lim+50 && b.location.y > -50);
  birds.forEach(bird => { bird.animate(); bird.draw(ctx); });
  if (SHOW_DEMO) {
    const towardsMouse = mouse_location.subPoint(demo_obj.location);
    demo_obj.velocity = demo_obj.velocity.addVector(towardsMouse.norm().mul(0.01));
    demo_obj.animate();
    demo_obj.draw(ctx);
  }
  if (flag_enable_night_mode){
    ctx.fillStyle = 'rgba(32,12,32,0.5)';
    ctx.fillRect(0, 0, x_lim, y_lim);
  }
  if (PLAY_ANIMATION) {
    window.requestAnimationFrame(draw);
  }
}
