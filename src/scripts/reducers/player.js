import update from 'immutability-helper';

import ActionTypes from '../actionTypes';

const initialState = {
  parameters: {},
};

export default function player(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.PLAYER_STATE_CHANGE:
      return update(state, {
        parameters: {
          [action.hash]: {
            $set: action.isActive,
          },
        },
      });
    default:
      return state;
  }
}
