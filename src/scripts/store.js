import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import ActionTypes from './actionTypes';
import osc from './middlewares/osc';
import player from './middlewares/player';
import reducers from './reducers';
import transport from './middlewares/transport';

let store;

export default function configureStore() {
  const middleware = [
    osc,
    player,
    thunk,
    transport,
  ];

  if (process.env.NODE_ENV === 'development') {
    middleware.push(
      createLogger({
        predicate: (getState, action) => {
          return action.type !== ActionTypes.PLAYER_STATE_CHANGE;
        },
      })
    );
  }

  store = createStore(
    reducers,
    applyMiddleware(...middleware),
  );

  return store;
}

export function getStore() {
  return store;
}
