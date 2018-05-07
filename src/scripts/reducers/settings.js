import update from 'immutability-helper';

import ActionTypes from '../actionTypes';
import { getItem, setItem, hasItem } from '../services/storage';

const STORAGE_KEY = 'settings';

const initialState = {
  network: {
    host: 'localhost',
    port: 9789,
  },
  parameterHashes: [],
};

function updateStorage(state) {
  setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
}

export default function settings(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SETTINGS_NETWORK_SAVE:
      return updateStorage(
        update(state, {
          network: { $set: action.settings },
        })
      );
    case ActionTypes.SETTINGS_LOAD:
      if (hasItem(STORAGE_KEY)) {
        return update(state, { $set: JSON.parse(getItem(STORAGE_KEY)) });
      }

      return state;
    case ActionTypes.SETTINGS_PARAMETERS_ADD:
      return updateStorage(
        update(state, {
          parameterHashes: { $push: [action.hash] },
        })
      );
    case ActionTypes.SETTINGS_PARAMETERS_REMOVE:
      return updateStorage(
        update(state, {
          parameterHashes: {
            $splice: [[state.parameterHashes.indexOf(action.hash), 1]],
          },
        })
      );
    case ActionTypes.SETTINGS_RESET:
      return updateStorage(
        update(state, { $set: initialState }),
      );
    default:
      return state;
  }
}
