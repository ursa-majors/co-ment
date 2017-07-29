import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
// import reducer from './reducers';
import store from './store/store'
import {Provider} from 'react-redux'
import App from './App';
import './style.scss';

const root = document.getElementById('root');

render(
  <Provider store={store}>
    <AppContainer>
      <App />
    </AppContainer>
  </Provider>,
  root,
);

if (module.hot) module.hot.accept(App, () => render(App));
