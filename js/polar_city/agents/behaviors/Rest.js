// Sit in place for a while, recovering stamina.
// Extensibility: a later RestAt(building) behavior can target a nearest igloo
// first via BFS, then call this once in place.
export const Rest = {
  name: 'Rest',

  // Very high when tired, low when fresh.
  utility(agent) {
    return 0.2 + (1 - agent.needs.stamina) * 0.9 + Math.random() * 0.1;
  },

  onBegin(agent /* , world */) {
    agent._restTimer = 1.5 + Math.random() * 3.0;
    agent.path = [];
    agent.target = null;
  },

  step(agent, world, dt) {
    agent.state = 'sit';
    agent._restTimer -= dt;
    agent.needs.stamina = Math.min(1, agent.needs.stamina + 0.12 * dt);
  },

  isDone(agent) {
    return agent._restTimer <= 0;
  },
};
