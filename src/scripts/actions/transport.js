import ActionTypes from '../actionTypes';
import { send } from './osc';
import { startPlayer, stopPlayer } from './player';

export function startAllPlayers() {
  return (dispatch, getState) => {
    const state = getState();

    const scene = state.scenes.scenes.find(scene => {
      return scene.id === state.scenes.currentSceneId;
    });

    Object.keys(scene.parameters).forEach(hash => {
      const parameter = scene.parameters[hash];

      const {
        moduleName,
        moduleOptions,
        triggerName,
        triggerOptions,
      } = parameter;

      if (!triggerName || !moduleName) {
        return;
      }

      const options = {
        trigger: triggerOptions,
        module: moduleOptions,
      };

      let dependencies = [];
      if (hash in scene.dependencies) {
        dependencies = scene.dependencies[hash];
      }

      dispatch(
        startPlayer(
          hash,
          triggerName,
          moduleName,
          options,
          dependencies
        )
      );
    });
  };
}

export function stopAllPlayers() {
  return (dispatch, getState) => {
    const state = getState();

    const scene = state.scenes.scenes.find(scene => {
      return scene.id === state.scenes.currentSceneId;
    });

    Object.keys(scene.parameters).forEach(hash => {
      dispatch(stopPlayer(hash));
    });

    Object.keys(scene.dependencies).forEach(hash => {
      scene.dependencies[hash].forEach(dependency => {
        dispatch(stopPlayer(dependency.parameter));
      });
    });
  };
}

export function play() {
  return dispatch => {
    dispatch(startAllPlayers());
    dispatch(send('/transport/start'));
    dispatch({ type: ActionTypes.TRANSPORT_PLAY });
  };
}

export function playAtCue(cueIndex) {
  return dispatch => {
    dispatch(send('/transport/jump', cueIndex));
    dispatch(startAllPlayers());
    dispatch(send('/transport/continue'));
    dispatch({ type: ActionTypes.TRANSPORT_PLAY });
  };
}

export function stop() {
  return dispatch => {
    dispatch(stopAllPlayers());
    dispatch(send('/transport/stop'));
    dispatch({ type: ActionTypes.TRANSPORT_STOP });
  };
}

export function record() {
  return dispatch => {
    dispatch(startAllPlayers());
    dispatch(send('/transport/record'));
    dispatch({ type: ActionTypes.TRANSPORT_RECORD });
  };
}

export function recordAtCue(cueIndex) {
  return dispatch => {
    dispatch(send('/transport/jump', cueIndex));
    dispatch(record());
  };
}

export function requestStatus() {
  return dispatch => {
    dispatch(send('/status'));
  };
}
