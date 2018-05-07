import ActionTypes from '../actionTypes';

import { startAllPlayers, stopAllPlayers } from './transport';

export function loadScenes() {
  return {
    type: ActionTypes.SCENES_LOAD,
  };
};

export function addScene(id) {
  return {
    id,
    type: ActionTypes.SCENES_ADD,
  };
};

export function removeScene(id) {
  return {
    id,
    type: ActionTypes.SCENES_REMOVE,
  };
};

export function resetScenes() {
  return {
    type: ActionTypes.SCENES_RESET,
  };
};

export function selectScene(id) {
  return (dispatch, getState) => {
    const state = getState();

    if (state.transport.isPlaying) {
      dispatch(stopAllPlayers());
    }

    dispatch({
      id,
      type: ActionTypes.SCENES_SELECT,
    });

    if (state.transport.isPlaying) {
      dispatch(startAllPlayers());
    }
  };
};

export function updateSceneParameter(sceneId, parameterHash, values) {
  return {
    parameterHash,
    sceneId,
    type: ActionTypes.SCENES_UPDATE_PARAMETER,
    values,
  };
};
