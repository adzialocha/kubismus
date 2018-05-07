import update from 'immutability-helper';

import ActionTypes from '../actionTypes';
import { getItem, setItem, hasItem } from '../services/storage';

const STORAGE_KEY = 'scenes';

const initialState = {
  currentSceneId: null,
  scenes: [],
};

const initialSceneState = {
  id: 1,
  parameters: {},
};

function updateStorage(state) {
  setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
}

export default function scenes(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SCENES_LOAD:
      if (hasItem(STORAGE_KEY)) {
        return update(state, { $set: JSON.parse(getItem(STORAGE_KEY)) });
      }

      return state;
    case ActionTypes.SCENES_ADD:
      const newScene = Object.assign({}, initialSceneState);

      if (state.scenes.length > 0) {
        newScene.id = state.scenes[state.scenes.length - 1].id + 1;
      }

      return updateStorage(
        update(state, {
          currentSceneId: { $set: newScene.id },
          scenes: { $push: [newScene] },
        })
      );
    case ActionTypes.SCENES_REMOVE:
      return updateStorage(
        update(state, {
          currentSceneId: { $set: null },
          scenes: {
            $splice: [[state.scenes.findIndex(s => s.id === action.id), 1]],
          },
        })
      );
    case ActionTypes.SCENES_SELECT:
      return updateStorage(
        update(state, {
          currentSceneId: { $set: action.id },
        })
      );
    case ActionTypes.SCENES_RESET:
      return updateStorage(
        update(state, { $set: initialState }),
      );
    case ActionTypes.SCENES_UPDATE_PARAMETER:
      const sceneIndex = state.scenes.findIndex(s => s.id === action.sceneId);

      return updateStorage(
        update(state, {
          scenes: {
            [sceneIndex]: {
              parameters: {
                [action.parameterHash]: { $set: action.values },
              },
            },
          },
        })
      );
    default:
      return state;
  }
}
