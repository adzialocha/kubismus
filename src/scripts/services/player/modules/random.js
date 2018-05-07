export default {
  parameters: {
    chance: {
      default: 50,
      label: 'Chance (in %)',
      max: 100,
      min: 1,
      step: 1,
    },
  },
  value: options => {
    return Math.random() < (options.chance / 100);
  },
};
