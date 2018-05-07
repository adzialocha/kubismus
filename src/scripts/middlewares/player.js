import player from '../services/player';
import { changeParameterState } from '../actions/player';

export const PLAYER_ACTION = Symbol('player-middleware-action');

export default store => next => action => {
  if (!(PLAYER_ACTION in action)) {
    return next(action);
  }

  const params = action[PLAYER_ACTION];

  if (params.type === 'start') {
    const { id, triggerName, moduleName, options } = params;

    player.start(id, triggerName, moduleName, options, isActive => {
      store.dispatch(changeParameterState(id, isActive));
    });
  } else if (params.type === 'stop') {
    const { id } = params;

    player.stop(id);
    store.dispatch(changeParameterState(id, false));
  }
};
