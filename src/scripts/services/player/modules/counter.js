export default {
  parameters: {
    length: {
      default: 2,
      label: 'Active every %nd step',
      max: 100,
      min: 1,
      step: 1,
      type: 'number',
    },
  },
  value: (runtime, options) => {
    return (runtime.counter - 1) % options.length === 0;
  },
};
