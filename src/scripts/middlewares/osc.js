import OSC from 'osc-js';

import AbletonSetup from '../services/ableton-setup';
import ActionTypes from '../actionTypes';

const osc = new OSC();

const abletonSetup = new AbletonSetup({
  osc,
});

export const OSC_ACTION = Symbol('osc-middleware-action');
export const OSC_SEND = Symbol('osc-middleware-send');

function registerEventHandlers(store) {
  osc.on('open', () => {
    store.dispatch({
      type: ActionTypes.OSC_OPEN,
    });
  });

  osc.on('close', () => {
    store.dispatch({
      type: ActionTypes.OSC_CLOSE,
    });
  });

  osc.on('error', error => {
    store.dispatch({
      type: ActionTypes.OSC_ERROR,
      error,
    });
  });
}

function registerMessageHandlers(store) {
  osc.on('/status', message => {
    store.dispatch({
      cuePointCount: message.args[3],
      isCuePointSelected: message.args[0] === 1,
      isPlaying: message.args[1] === 1,
      isRecording: message.args[2] === 1,
      type: ActionTypes.TRANSPORT_STATUS_RECEIVED,
    });
  });
}

function handleAction(store, type) {
  const state = store.getState();
  const { host, port } = state.settings.network;

  if (type === 'init') {
    registerEventHandlers(store);
    registerMessageHandlers(store);

    store.dispatch({
      type: ActionTypes.OSC_READY,
    });
  } else if (type === 'open') {
    if (!state.osc.isOpen) {
      osc.open({ host, port });
    }
  } else if (type === 'close') {
    if (state.osc.isOpen) {
      osc.close();
    }
  } else if (type === 'setup') {
    if (abletonSetup.isLoading) {
      return;
    }

    store.dispatch({
      type: ActionTypes.SETUP_UPDATE_BEGIN,
    });

    abletonSetup.load()
      .then(setup => {
        store.dispatch({
          setup,
          type: ActionTypes.SETUP_UPDATE_END,
        });
      });
  }
}

function sendMessage(address, args) {
  if (typeof args !== 'object') {
    osc.send(new OSC.Message(address, ...args));
  } else {
    const message = new OSC.Message(address);

    args.forEach(item => {
      message.add(item);
    });

    osc.send(message);
  }
}

export default store => next => action => {
  if (OSC_ACTION in action) {
    const { type } = action[OSC_ACTION];
    handleAction(store, type);
  } else if (OSC_SEND in action) {
    const { address, args } = action[OSC_SEND];
    sendMessage(address, args);
  } else {
    return next(action);
  }
};
