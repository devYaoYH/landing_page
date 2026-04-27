// Drink coffee in place, reducing hunger.
// Hunger is a generic "needs food/drink" drive; coffee is the stand-in here.
export const DrinkCoffee = {
  name: 'DrinkCoffee',

  utility(agent) {
    return 0.1 + agent.needs.hunger * 1.1 + Math.random() * 0.1;
  },

  onBegin(agent) {
    agent._coffeeTimer = 2.0 + Math.random() * 2.0;
    agent.path = [];
    agent.target = null;
  },

  step(agent, world, dt) {
    agent.state = 'coffee';
    agent._coffeeTimer -= dt;
    agent.needs.hunger = Math.max(0, agent.needs.hunger - 0.25 * dt);
  },

  isDone(agent) {
    return agent._coffeeTimer <= 0;
  },
};
