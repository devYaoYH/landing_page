// Sleep in place, reducing sleepiness. Preferred over idling/Rest once
// sleepiness crosses a threshold.
export const Sleep = {
  name: 'Sleep',

  utility(agent) {
    // Ramps past Wander/Rest once sleepiness is high.
    return 0.2 + agent.needs.sleepiness * 1.2 + Math.random() * 0.05;
  },

  onBegin(agent) {
    agent._sleepTimer = 3.0 + Math.random() * 4.0;
    agent.path = [];
    agent.target = null;
  },

  step(agent, world, dt) {
    agent.state = 'sleep';
    agent._sleepTimer -= dt;
    agent.needs.sleepiness = Math.max(0, agent.needs.sleepiness - 0.25 * dt);
  },

  isDone(agent) {
    return agent._sleepTimer <= 0;
  },
};
