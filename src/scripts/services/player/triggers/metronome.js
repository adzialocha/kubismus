const MS_PER_MINUTE = 60000;

export default {
  parameters: {
    bpm: {
      default: 120,
      label: 'BPM',
      max: 300,
      min: 1,
      step: 1,
      type: 'number',
    },
  },
  value: (runtime, options) => {
    return MS_PER_MINUTE / options.bpm;
  },
};
