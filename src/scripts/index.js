import '../styles/app.scss';

import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';

import configureStore from './store';
import { App } from './views';
import { initializeApp, unloadApp } from './actions/app';

const store = configureStore();

store.dispatch(initializeApp());

window.onbeforeunload = () => {
  store.dispatch(unloadApp());
};

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
