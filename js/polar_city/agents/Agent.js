// Engine-agnostic agent base.
// Agents live in tile coords (float during travel). Subclasses implement
// tick(dt); behaviors read/write these fields.
export class Agent {
  constructor(world, x, y) {
    this.world = world;
    this.pos = { x, y };          // float tile coords
    this.state = 'idle';          // 'idle' | 'walk' | 'sit' | ...
    this.speed = 0.6;             // tiles/sec
    this.path = [];               // remaining tile waypoints (BFS output)
    this.target = null;           // convenience: path[0] or null
    this.behavior = null;         // current Behavior
    this.needs = {                // 0..1 — utility-AI inputs
      stamina: 1, caffeine: 1, social: 0.5,
      hunger: 0, boredom: 0, sleepiness: 0,
    };
  }

  tileXY() {
    return { x: Math.round(this.pos.x), y: Math.round(this.pos.y) };
  }

  // Move toward this.target at this.speed. Advances path when target reached.
  // Returns true if still walking, false if path is empty.
  stepAlongPath(dt) {
    if (!this.path.length) { this.target = null; return false; }
    this.target = this.path[0];
    const dx = this.target.x - this.pos.x;
    const dy = this.target.y - this.pos.y;
    const dist = Math.hypot(dx, dy);
    const step = this.speed * dt;
    if (dist <= step) {
      this.pos.x = this.target.x;
      this.pos.y = this.target.y;
      this.path.shift();
      this.target = this.path[0] ?? null;
    } else {
      this.pos.x += (dx / dist) * step;
      this.pos.y += (dy / dist) * step;
    }
    return true;
  }

  tick(/* dt */) {}
}
