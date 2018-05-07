import ActionTypes from '../actionTypes';
import { requestStatus, stop } from '../actions/transport';

const UPDATE_STATUS_INTERVAL = 1000 * 30;

let interval;

export default store => next => action => {
  if (!('type' in action)) {
    return next(action);
  }

  if (action.type === ActionTypes.OSC_OPEN) {
    interval = setInterval(() => {
      store.dispatch(requestStatus());
    }, UPDATE_STATUS_INTERVAL);

    store.dispatch(requestStatus());
  } else if (action.type === ActionTypes.OSC_CLOSE) {
    store.dispatch(stop());
    clearInterval(interval);
  }

  return next(action);
};
