function makeDemoAnimationObject() {
  const ani_obj = AnimationObject();
  ani_obj.velocity = makeVector(2,1);
  ani_obj.rgba = [255, 0, 0, 1];
  ani_obj.shape = Dellipse(ani_obj, 20, 30, 0, 0, Math.PI*2, false);
  ani_obj.setAnimationFn(function(obj){
    const k = Math.sin(getAnimationTime()/500);
    return Atranslate(setOpacity(obj, k*k), obj.velocity);
  });

  const child_obj = AnimationObject(ani_obj);
  child_obj.location = makePoint(-10, 0);
  child_obj.velocity = makeVector(-0.02, 0.01);
  child_obj.rgba = [0, 255, 0, 1];
  child_obj.shape = Dellipse(child_obj, 10, 10, 0, 0, Math.PI*2, false);
  child_obj.setAnimationFn(function(obj){
    const k = Math.sin(getAnimationTime()/1000);
    return Atranslate(setScale(obj, makePoint(k*k, k*k)), obj.velocity);
  });
  
  return ani_obj;
}