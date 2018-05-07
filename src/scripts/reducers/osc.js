import update from 'immutability-helper';

import ActionTypes from '../actionTypes';

const initialState = {
  errorMessage: '',
  isError: false,
  isOpen: false,
  isReady: false,
};

export default function osc(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.OSC_READY:
      return update(state, {
        isReady: { $set: true },
      });
    case ActionTypes.OSC_OPEN:
      return update(state, {
        errorMessage: { $set: '' },
        isError: { $set: false },
        isOpen: { $set: true },
      });
    case ActionTypes.OSC_CLOSE:
      return update(state, {
        isOpen: { $set: false },
      });
    case ActionTypes.OSC_ERROR:
      return update(state, {
        errorMessage: { $set: action.error.message || '' },
        isError: { $set: true },
      });
    default:
      return state;
  }
}
