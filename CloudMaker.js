/* Cloud Generation */
function CloudMaker() {
  // Configurations
  let min_speed = 0.5;
  let max_speed = 2;
  let min_radius = 30;
  let max_radius = 80;
  let speed_range = max_speed - min_speed;
  let radius_range = max_radius - min_radius;
  
  // Factory function for making cloud AnimationObjects
  function makeCloud(direction = 0){
    const anim_obj = AnimationObject();
    const x = -max_radius*2 - (x_lim*0.5*Math.random()); // horizontal offset
    const y = y_lim*(0.3*Math.random()+0.05); // vertical offset
    const speed = speed_range*Math.random()+min_speed; // horizontal speed
    const base_color = 255 - Math.random()*10; // Color
    // Draw base elipse
    const base_radiusX = radius_range*Math.random()+min_radius;
    const base_radiusY = base_radiusX*3/4 - Math.max(0, base_radiusX - min_radius)*(Math.random()/2) // should be smaller than radiusX

    anim_obj.rgba = [base_color, base_color, base_color, 1];
    // Flip direction Right-to-Left
    anim_obj.location = direction === 1
      ? makePoint(-x+x_lim, y)
      : makePoint(x,y);
    anim_obj.velocity = direction === 1
      ? makeVector(-speed, 0)
      : makeVector(speed, 0);
    anim_obj.shape = Dellipse(anim_obj, base_radiusX, base_radiusY, 0, 0, Math.PI*2, false);
    // Set default animation movement
    anim_obj.setAnimationFn(function(obj){
      return Atranslate(obj, obj.velocity);
    });
    genCloudChildren(anim_obj, base_radiusX, base_radiusY);
    return anim_obj;
  }

  function genCloudChildren(parent, base_radiusX, base_radiusY){
    // Render some childrens
    for (let i=0;i<Math.random()*5+5;++i) {
      const child_obj = AnimationObject(parent);
      const dx = Math.random()*base_radiusX*1.4-base_radiusX*0.7;
      const dy = Math.random()*base_radiusY*1.4-base_radiusY*0.7;
      const radiusX = radius_range/2*Math.random()+min_radius/2;
      const radiusY = radius_range/2*Math.random()+min_radius/2;
      const rot = Math.PI*0.5*Math.random();
      child_obj.rgba = parent.rgba;
      child_obj.rgba[4] = Math.random()/2+0.5;
      child_obj.location = makePoint(dx, dy);
      child_obj.shape = Dellipse(child_obj, radiusX, radiusY, rot, 0, Math.PI*2, false);
      child_obj.setAnimationFn(function(obj){
        return Atranslate(obj, obj.velocity);
      });
    }
  }

  // Check if cloud is still visible
  function isOnScreen(cloud){
    let max_neg_dx = 0; // maximum negative dx
    cloud.children.forEach((e) => {
      max_neg_dx = Math.min(max_neg_dx, e.location.x-e.shape.boundingBox.x);
    });
    return cloud.location.x+max_neg_dx-10 < x_lim; // base 10 delay
  }

  // Explode a cloud
  function explodeCloud(cloud){
    cloud.setAnimationFn(function(obj){
      return Atranslate(Ascale(obj,makePoint(0.99, 0.99)), obj.velocity);
    });
    cloud.children.forEach((child) => {
      child.velocity = makeVector(Math.random()-0.5, Math.random()-0.5);
      child.setAnimationFn(function(obj){
        return Atranslate(Aopacity(obj, 0.995), obj.velocity);
      });
    });
  }

  return {
    setMinSpeed: function(min_speed) {
      this.min_speed = min_speed;
      this.speed_range = this.max_speed - this.min_speed;
    },
    setMaxSpeed: function(max_speed) {
      this.max_speed = max_speed;
      this.speed_range = this.max_speed - this.min_speed;
    },
    setMinRadius: function(min_radius) {
      this.min_radius = min_radius;
      this.radius_range = this.max_radius - this.min_radius;
    },
    setMaxRadius: function(max_radius) {
      this.max_radius = max_radius;
      this.radius_range = this.max_radius - this.min_radius;
    },
    update: function(x_lim, y_lim){
      this.x_lim = x_lim;
      this.y_lim = y_lim;
    },
    makeCloud: makeCloud,
    isOnScreen: isOnScreen,
    explodeCloud: explodeCloud,
  };
}
