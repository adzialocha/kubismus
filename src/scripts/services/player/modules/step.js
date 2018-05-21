const ACTIVE = 'x';
const INACTIVE = '_';

export default {
  parameters: {
    sequence: {
      default: '',
      label: `Sequence (use ${ACTIVE} and ${INACTIVE})`,
      type: 'text',
    },
    offset: {
      default: 0,
      label: 'Offset',
      max: 32,
      min: 0,
      step: 1,
      type: 'number',
    },
  },
  value: (runtime, options) => {
    const { sequence, offset } = options;
    const length = sequence.length;
    const position = (runtime.counter - 1) % (length + offset);
    const current = sequence[position];

    return current === ACTIVE;
  },
};
