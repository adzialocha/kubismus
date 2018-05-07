import update from 'immutability-helper';

import ActionTypes from '../actionTypes';

const initialState = {
  currentView: 'editor',
  extraBarMode: 'play',
  isBarExpanded: false,
};

export default function view(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.VIEW_CHANGE:
      return update(state, {
        currentView: { $set: action.name },
      });
    case ActionTypes.VIEW_EXPAND_BAR:
      const changes = {
        isBarExpanded: { $set: true },
      };

      if (typeof action.mode === 'string') {
        changes.extraBarMode = { $set: action.mode };
      }

      return update(state, changes);
    case ActionTypes.VIEW_COLLAPSE_BAR:
      return update(state, {
        isBarExpanded: { $set: false },
      });
    default:
      return state;
  }
}
