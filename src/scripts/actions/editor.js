import ActionTypes from '../actionTypes';
import { changeParameterState } from './player';

export function toggleSidebar() {
  return {
    type: ActionTypes.EDITOR_TOGGLE_SIDEBAR,
  };
};

export function selectParameter(hash, isDirect) {
  return (dispatch, getState) => {
    // Change the state of the parameter directly outside of the player
    if (isDirect) {
      const { player } = getState();
      const isActive = player.parameters[hash];

      dispatch(changeParameterState(hash, !isActive));
    }

    dispatch({
      hash,
      type: ActionTypes.EDITOR_PARAMETER_SELECT,
    });
  };
};
