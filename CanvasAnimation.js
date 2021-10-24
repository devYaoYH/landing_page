// 2D Mathematical Objects
function makePoint(ix, iy){
  return {
    x: ix,
    y: iy,
    // Adding two points should yield another point
    addPoint: function(p){
      return makePoint(this.x + p.x, this.y + p.y);
    },
    // Subtracting two points should yield a vector
    subPoint: function(p){
      return makeVector(this.x - p.x, this.y - p.y);
    },
    // Adding to a vector yields another point
    addVector: function(v){
      return makePoint(this.x + v.x, this.y + v.y);
    },
    // Subtracting a veector also yields a point
    subVector: function(v){
      return makePoint(this.x - v.x, this.y - v.y);
    },
  };
}

function makeVector(vx, vy){
  return {
    ...makePoint(vx, vy),
    // Adding to a point should yield another point
    addPoint: function(p){
      return makePoint(this.x + p.x, this.y + p.y);
    },
    // Two vectors added gives another vector
    addVector: function(v){
      return makeVector(this.x + v.x, this.y + v.y);
    },
    // Subtracting a vector yields another vector
    subVector: function(v){
      return makeVector(this.x - v.x, this.y - v.y);
    },
    length: function(){
      return Math.sqrt(this.x*this.x + this.y*this.y);
    },
    mul: function(c){
      return makeVector(this.x*c, this.y*c);
    },
    // Dot product between 2D vectors
    dot: function(v){
      return this.x*v.x + this.y*v.x;
    },
    // Unit vector representation
    norm: function(){
      if (this.length() == 0){
        return makeVector(0, 0);
      }
      else{
        return this.mul(1/this.length());
      }
    },
  };
}

/* Animation Transformations
 *
 * Each function should return the object for chaining
 */

// Unitary transform
function Aunit(animationObject){
  // console.debug("Aunit");
  return animationObject;
}

// Translate a location
function Atranslate(animationObject, v){
  // console.debug("Atranslate:");
  // console.debug(v);
  animationObject.location = animationObject.location.addVector(v);
  return animationObject;
}

// Scale an object by .x, .y
function Ascale(animationObject, s){
  // console.debug("Ascale:");
  // console.debug(s);
  return AscaleY(AscaleX(animationObject, s.x), s.y);
}

function AscaleX(animationObject, sx){
  animationObject.scale.x *= sx;
  return animationObject;
}

function AscaleY(animationObject, sy){
  animationObject.scale.y *= sy;
  return animationObject;
}

// Sets the scale of an object
function setScale(animationObject, s){
  // console.debug("setScale:");
  // console.debug(s);
  animationObject.scale = s;
  return animationObject;
}

// Scales the opacity of an object
function Aopacity(animationObject, o){
  // console.debug("Aopacity:");
  // console.debug(o);
  animationObject.rgba[3] *= o;
  return animationObject;
}

// Sets the opacity of an object
function setOpacity(animationObject, o){
  // console.debug("setOpacity:");
  // console.debug(o);
  animationObject.rgba[3] = o;
  return animationObject;
}

// Constructor for collidable object (rigid body physics)
const CollisionObject = (function(animationObject){
  return {
    getLocation: function(){
      return animationObject.location;
    },
    // Check intersection between two CollisionObjects
    doesIntersect: (_) => false,
  };
});

function Cpoint(animationObject){
  return {
    ...CollisionObject(animationObject),
    // Double Dispatch
    doesIntersect: function(collider){
      return collider.doesIntersectPoint(this);
    },
    // Point - Point intersection
    doesIntersectPoint: function(collider){
      return (this.getLocation().x == collider.getLocation().x && this.getLocation().y == collider.getLocation().y);
    },
    // Point - Ellipse intersection
    doesIntersectEllipse: function(collider){
      return collider.doesIntersectPoint(this);
    },
  };
}

function Cellipse(animationObject, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise){
  // Copy ellipse attributes
  const rx = radiusX;
  const ry = radiusY;
  const phi = rotation;
  const minAlpha = startAngle;
  const maxAlpha = endAngle;
  const isArcCounterClockwise = counterclockwise;
  return {
    ...CollisionObject(animationObject),
    getRadius: function(){
      return makePoint(rx, ry);
    },
    getRotation: function(){
      return phi;
    },
    getArc: function(){
      return (minAlpha, maxAlpha);
    },
    // Double Dispatch
    doesIntersect: function(collider){
      return collider.doesIntersectEllipse(this);
    },
    // Ellipse - Point intersection
    doesIntersectPoint: function(collider){
      //if (this.phi != 0 || this.minAlpha != 0 || this.maxAlpha != Math.PI*2) return false;
      const p = collider.getLocation();
      const c = this.getLocation();
      const dx = p.x - c.x;
      const dy = p.y - c.y;
      return ((dx*dx)/(rx*rx)) + ((dy*dy)/(ry*ry)) <= 1;
    },
  }
}

// Constructor for drawable object
const DrawableObject = (function(animationObject){
  const collider = Cpoint(animationObject);
  return {
    boundingBox: makePoint(0,0), // Deprecated, use CollisionObject.doesIntersect(...)
    // Collision Object
    getCollider: () => collider,
    // Get the current animationObject's location
    getLocation: () => animationObject.location,
    // Get the current animationObject's scale
    getScale: () => animationObject.scale,
    // Get the current animationObject's color (rgba)
    getRgba: () => animationObject.rgba,
    // 2DCanvas drawing function
    // e.g. function(ctx, offset){
    //        ctx.fillStyle();
    //        ctx.circle(...);
    //        ctx.fill();
    //      }
    draw: function(ctx, offset = makePoint(0,0)){

    },
  };
});

function Dellipse(animationObject, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise){
  const collider = Cellipse(animationObject, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise);
  return {
    ...DrawableObject(animationObject),
    boundingBox: makePoint(radiusX, radiusY), // Deprecated, use CollisionObject.doesIntersect(...)
    getCollider: () => collider,
    draw: function(ctx, offset = makePoint(0,0)){
      const loc = this.getLocation();
      const scale = this.getScale();
      const rgba = this.getRgba();
      ctx.fillStyle = `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${rgba[3]})`;
      ctx.beginPath();
      ctx.ellipse(loc.x+offset.x, loc.y+offset.y, radiusX*scale.x, radiusY*scale.y, rotation, startAngle, endAngle, counterclockwise);
      ctx.fill();
    }
  };
}

// Constructor for animation object
const AnimationObject = (function(parent = null){
  animationObject = {
    parent: parent, // Parent object in animation hierarchy (null => canvas)
    scale: makePoint(1,1), // Size transformation scaling
    rgba: [255,255,255,1], // RGB + Opacity of object [0,1]
    location: makePoint(0,0), // Position (relative to parent)
    velocity: makeVector(0,0), // Vector velocity (relative to parent)
    shape: DrawableObject(this), // Object which has a 'draw' function
    children: [], // List of child AnimationObjects
    animationFn: Aunit, // Default animation function
    animate: function(parentAnimationFn = Aunit) { // Animates the object
      // console.debug(this);
      // console.debug(this.animationFn);
      // console.debug(parentAnimationFn);
      // First apply 'inherited' parent animations, then apply own animation
      this.animationFn(parentAnimationFn(this));
      // console.debug(this.location);
      // Propagate to children
      // Create a function enclosing the current animation to pass to children
      this.children.forEach((child) => child.animate((obj) => this.animationFn(parentAnimationFn(obj))));
    },
    draw: function(ctx, offset = makePoint(0,0)) { // How should we paint this object?
      this.shape.draw(ctx, offset);
      offset = this.location.addPoint(offset);
      this.children.forEach((child) => child.draw(ctx, offset));
    },
    setAnimationFn: function(fn) { // Function that describes transformations
      this.animationFn = fn;
    },
  };

  // Attach the created object to parent
  if (parent != null){
    parent.children.push(animationObject);
  }

  return animationObject;
});