// Play ball in place, reducing boredom.
export const PlayBall = {
  name: 'PlayBall',

  utility(agent) {
    return 0.1 + agent.needs.boredom * 1.0 + Math.random() * 0.1;
  },

  onBegin(agent) {
    agent._playTimer = 2.5 + Math.random() * 3.0;
    agent.path = [];
    agent.target = null;
  },

  step(agent, world, dt) {
    agent.state = 'play_ball';
    agent._playTimer -= dt;
    agent.needs.boredom = Math.max(0, agent.needs.boredom - 0.2 * dt);
    // Playing is tiring and works up an appetite.
    agent.needs.sleepiness = Math.min(1, agent.needs.sleepiness + 0.03 * dt);
    agent.needs.hunger     = Math.min(1, agent.needs.hunger     + 0.03 * dt);
  },

  isDone(agent) {
    return agent._playTimer <= 0;
  },
};
