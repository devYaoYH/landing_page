import { bfs } from '../../world/pathfind.js';

// Pick a random walkable tile and walk to it along a BFS path.
// Extensibility: make target selection smarter (bias toward unvisited tiles,
// toward other bears for "social" behavior, etc.) without changing the shape.
export const Wander = {
  name: 'Wander',

  // Higher when the bear has energy; lower when tired.
  utility(agent) {
    return 0.4 + agent.needs.stamina * 0.5 + Math.random() * 0.1;
  },

  onBegin(agent, world) {
    const start = agent.tileXY();

    // 60% chance: pick a tile near a random building as attractor.
    if (world.buildings.length && Math.random() < 0.6) {
      const b = world.buildings[Math.floor(Math.random() * world.buildings.length)];
      for (let i = 0; i < 20; i++) {
        const dx = Math.floor((Math.random() - 0.5) * 8);
        const dy = Math.floor((Math.random() - 0.5) * 8);
        const tx = b.x + dx, ty = b.y + dy;
        if (!world.isWalkable(tx, ty)) continue;
        const path = bfs(world, start, { x: tx, y: ty });
        if (path && path.length) { agent.path = path; return; }
      }
    }

    // Fallback: random walkable tile.
    for (let i = 0; i < 30; i++) {
      const tx = Math.floor(Math.random() * world.cols);
      const ty = Math.floor(Math.random() * world.rows);
      if (!world.isWalkable(tx, ty)) continue;
      const path = bfs(world, start, { x: tx, y: ty });
      if (path && path.length) { agent.path = path; return; }
    }
    agent.path = [];
  },

  step(agent, world, dt) {
    agent.state = 'walk';
    agent.stepAlongPath(dt);
    // Walking costs stamina.
    agent.needs.stamina = Math.max(0, agent.needs.stamina - 0.02 * dt);
  },

  isDone(agent) {
    return agent.path.length === 0;
  },
};
