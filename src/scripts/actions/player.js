import ActionTypes from '../actionTypes';

import { PLAYER_ACTION } from '../middlewares/player';
import { send } from './osc';

export function startPlayer(id, triggerName, moduleName, options, dependencies) {
  return dispatch => {
    dispatch({
      [PLAYER_ACTION]: {
        dependencies,
        id,
        moduleName,
        options,
        triggerName,
        type: 'start',
      },
    });
  };
};

export function stopPlayer(id) {
  return dispatch => {
    dispatch({
      [PLAYER_ACTION]: {
        id,
        type: 'stop',
      },
    });
  };
};

export function changeParameterState(hash, isActive) {
  return (dispatch, getState) => {
    const state = getState();
    const { setup } = state.setup;
    const { min, max, id } = setup.parameters.find(p => p.hash === hash);
    const value = isActive ? max : min;

    dispatch(send('/param', id, value));

    dispatch({
      hash,
      isActive,
      type: ActionTypes.PLAYER_STATE_CHANGE,
    });
  };
};
