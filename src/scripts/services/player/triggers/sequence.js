const MS_PER_MINUTE = 60000;

const DURATIONS = ['_', '/', '-', '*', '.', ',', ';'];

function generateDurationsString() {
  return DURATIONS.map((duration, index) => {
    return `${Math.pow(2, index)}nd = ${DURATIONS[index]}`;
  }).join(' ');
}

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
    sequence: {
      default: '',
      label: `Sequence (${generateDurationsString()})`,
      type: 'text',
    },
  },
  value: (runtime, options) => {
    const { sequence, bpm } = options;
    const length = sequence.length;
    const position = (runtime.counter - 1) % length;
    const duration = DURATIONS.indexOf(sequence[position]);

    return ((MS_PER_MINUTE * 4) / Math.pow(2, duration)) / bpm;
  },
};
