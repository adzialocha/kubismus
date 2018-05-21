import update from 'immutability-helper';

import ActionTypes from '../actionTypes';
import { getItem, setItem, hasItem } from '../services/storage';

const STORAGE_KEY = 'scenes';

const initialState = {
  currentSceneId: null,
  scenes: [],
};

const initialSceneState = {
  dependencies: {},
  id: 1,
  parameters: {},
};

const initialDependencyState = {
  id: 1,
  parameter: '',
  type: '',
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
      return updateStorage(
        update(state, {
          scenes: {
            [state.scenes.findIndex(s => s.id === action.sceneId)]: {
              parameters: {
                [action.parameterHash]: { $set: action.values },
              },
            },
          },
        })
      );
    case ActionTypes.SCENES_ADD_DEPENDENCY:
      const sceneIndex = state.scenes.findIndex(s => s.id === action.sceneId);
      const newDependency = Object.assign({}, initialDependencyState);

      if (action.parameterHash in state.scenes[sceneIndex].dependencies) {
        const dependencies = state.scenes[sceneIndex].dependencies[action.parameterHash];

        if (dependencies.length > 0) {
          newDependency.id = dependencies[dependencies.length - 1].id + 1;
        }
      }

      const updateAction = {};

      if (action.parameterHash in state.scenes[sceneIndex].dependencies) {
        updateAction.$push = [newDependency];
      } else {
        updateAction.$set = [newDependency];
      }

      return updateStorage(
        update(state, {
          scenes: {
            [sceneIndex]: {
              dependencies: {
                [action.parameterHash]: updateAction,
              },
            },
          },
        })
      );
    case ActionTypes.SCENES_UPDATE_DEPENDENCY:
      const indexScene = state.scenes.findIndex(s => s.id === action.sceneId);
      const dependencyIndex = state.scenes[indexScene].dependencies[action.parameterHash]
        .findIndex(d => d.id === action.id);

      return updateStorage(
        update(state, {
          scenes: {
            [indexScene]: {
              dependencies: {
                [action.parameterHash]: {
                  [dependencyIndex]: {
                    parameter: { $set: action.values.parameter },
                    type: { $set: action.values.type },
                  },
                },
              },
            },
          },
        })
      );
    case ActionTypes.SCENES_REMOVE_DEPENDENCY:
      const index = state.scenes.findIndex(s => s.id === action.sceneId);

      return updateStorage(
        update(state, {
          scenes: {
            [index]: {
              dependencies: {
                [action.parameterHash]: {
                  $splice: [[
                    state.scenes[index].dependencies[action.parameterHash]
                      .findIndex(d => d.id === action.id), 1,
                  ]],
                },
              },
            },
          },
        })
      );
    default:
      return state;
  }
}
