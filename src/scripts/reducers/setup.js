import update from 'immutability-helper';

import ActionTypes from '../actionTypes';
import { getItem, setItem, hasItem } from '../services/storage';

const STORAGE_KEY = 'setup';

const initialState = {
  isComplete: false,
  isLoading: false,
  setup: {
    devices: [],
    parameters: [],
    tracks: [],
  },
};

function updateStorage(state) {
  setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
}

export default function setup(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SETUP_LOAD:
      if (hasItem(STORAGE_KEY)) {
        return update(state, {
          isComplete: { $set: true },
          setup: { $set: JSON.parse(getItem(STORAGE_KEY)) },
        });
      }

      return state;
    case ActionTypes.SETUP_UPDATE_BEGIN:
      return update(state, {
        isComplete: { $set: false },
        isLoading: { $set: true },
        setup: {
          devices: { $set: [] },
          parameters: { $set: [] },
          tracks: { $set: [] },
        },
      });
    case ActionTypes.SETUP_UPDATE_END:
      updateStorage(action.setup);

      return update(state, {
        isComplete: { $set: true },
        isLoading: { $set: false },
        setup: { $set: action.setup },
      });
    default:
      return state;
  }
}
