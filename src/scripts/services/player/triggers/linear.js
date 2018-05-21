export default {
  parameters: {
    min: {
      default: 500,
      label: 'From frequency (ms)',
      max: Number.MAX_SAFE_INTEGER,
      min: 1,
      step: 1,
      type: 'number',
    },
    max: {
      default: 2000,
      label: 'To frequency (ms)',
      max: Number.MAX_SAFE_INTEGER,
      min: 1,
      step: 1,
      type: 'number',
    },
  },
  value: (runtime, options) => {
    const { min, max } = options;
    const position = (runtime.counter - 1) % (max - min);

    return position + min;
  },
};
