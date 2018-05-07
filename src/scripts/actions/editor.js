import ActionTypes from '../actionTypes';

export function toggleSidebar() {
  return {
    type: ActionTypes.EDITOR_TOGGLE_SIDEBAR,
  };
};

export function selectParameter(hash) {
  return {
    hash,
    type: ActionTypes.EDITOR_PARAMETER_SELECT,
  };
};
