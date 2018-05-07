import ActionTypes from '../actionTypes';

export function loadSettings() {
  return {
    type: ActionTypes.SETTINGS_LOAD,
  };
};

export function saveNetworkSettings(settings) {
  return {
    settings,
    type: ActionTypes.SETTINGS_NETWORK_SAVE,
  };
};

export function addParameterHash(hash) {
  return {
    hash,
    type: ActionTypes.SETTINGS_PARAMETERS_ADD,
  };
};

export function removeParameterHash(hash) {
  return {
    hash,
    type: ActionTypes.SETTINGS_PARAMETERS_REMOVE,
  };
};

export function resetSettings() {
  return {
    type: ActionTypes.SETTINGS_RESET,
  };
};
