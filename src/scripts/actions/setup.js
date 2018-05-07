import ActionTypes from '../actionTypes';

import { OSC_ACTION } from '../middlewares/osc';

export function loadSetup() {
  return {
    type: ActionTypes.SETUP_LOAD,
  };
};

export function updateAbletonSetup() {
  return {
    [OSC_ACTION]: {
      type: 'setup',
    },
  };
};
