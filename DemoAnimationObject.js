function makeDemoAnimationObject() {
  const ani_obj = AnimationObject();
  ani_obj.velocity = makeVector(2,1);
  ani_obj.rgba = [32, 34, 36, 1];
  ani_obj.shape = Drectangle(ani_obj, -20, -2.5, 40, 5);
  ani_obj.setAnimationFn(function(obj){
    const k = Math.sin(getAnimationTime()/500);
    return Atranslate(obj, obj.velocity);
  });

  const wing_left = AnimationObject(ani_obj);
  wing_left.location = makePoint(-20, 0);
  wing_left.rgba = [32, 34, 36, 1];
  wing_left.shape = Darc(wing_left, 20, 30, 0, 0, -Math.PI/2, true, 5);
  wing_left.setAnimationFn(function(obj){
    const k = Math.sin(getAnimationTime()/500);
    return setScale(obj, makePoint(1, k*k*0.7+0.3));
  });

  const wing_right = AnimationObject(ani_obj);
  wing_right.location = makePoint(20, 0);
  wing_right.rgba = [32, 34, 36, 1];
  wing_right.shape = Darc(wing_right, 20, 30, 0, -Math.PI/2, -Math.PI, true, 5);
  wing_right.setAnimationFn(function(obj){
    const k = Math.sin(getAnimationTime()/500);
    return setScale(obj, makePoint(1, k*k*0.7+0.3));
  });
  
  return ani_obj;
}