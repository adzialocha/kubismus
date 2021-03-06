export default {
  parameters: {
    chance: {
      default: 50,
      label: 'Chance (in %)',
      max: 100,
      min: 1,
      step: 1,
      type: 'number',
    },
  },
  value: (runtime, options) => {
    return Math.random() < (options.chance / 100);
  },
};
