import ActionTypes from '../actionTypes';

export function changeViewTo(name) {
  return {
    type: ActionTypes.VIEW_CHANGE,
    name,
  };
};

export function expandBar(mode) {
  return {
    mode,
    type: ActionTypes.VIEW_EXPAND_BAR,
  };
}

export function collapseBar() {
  return {
    type: ActionTypes.VIEW_COLLAPSE_BAR,
  };
}
