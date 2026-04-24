import { Agent } from './Agent.js';
import { Wander } from './behaviors/Wander.js';
import { Rest } from './behaviors/Rest.js';
import { DrinkCoffee } from './behaviors/DrinkCoffee.js';
import { PlayBall } from './behaviors/PlayBall.js';
import { Sleep } from './behaviors/Sleep.js';

// PolarBear's only job here is to assemble a behavior set and pick among them
// by utility. Add a new behavior by importing it and including it in BEHAVIORS
// — no other code changes.
const BEHAVIORS = [Wander, Rest, DrinkCoffee, PlayBall, Sleep];

export class PolarBear extends Agent {
  constructor(world, x, y) {
    super(world, x, y);
    this.speed = 0.6;
    // Stagger initial drives so bears don't all pick the same action at once.
    this.needs.hunger     = Math.random() * 0.3;
    this.needs.boredom    = Math.random() * 0.3;
    this.needs.sleepiness = Math.random() * 0.3;
  }

  tick(dt) {
    // Drives drift upward over time; behaviors pull them back down.
    this.needs.hunger     = Math.min(1, this.needs.hunger     + 0.04 * dt);
    this.needs.boredom    = Math.min(1, this.needs.boredom    + 0.05 * dt);
    this.needs.sleepiness = Math.min(1, this.needs.sleepiness + 0.03 * dt);

    if (!this.behavior || this.behavior.isDone(this)) {
      this.behavior = pickBest(this, BEHAVIORS);
      this.behavior.onBegin(this, this.world);
    }
    this.behavior.step(this, this.world, dt);
  }
}

function pickBest(agent, behaviors) {
  let best = behaviors[0], bestU = -Infinity;
  for (const b of behaviors) {
    const u = b.utility(agent, agent.world);
    if (u > bestU) { best = b; bestU = u; }
  }
  return best;
}
