import { init, open, close } from './osc';
import { loadScenes } from './scenes';
import { loadSettings } from './settings';
import { loadSetup } from './setup';

export function initializeApp() {
  return dispatch => {
    dispatch(init());

    dispatch(loadScenes());
    dispatch(loadSetup());
    dispatch(loadSettings());

    dispatch(open());
  };
};

export function unloadApp() {
  return dispatch => {
    dispatch(close());
  };
}
