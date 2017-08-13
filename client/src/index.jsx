import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import Redbox from 'redbox-react';

// import reducer from './reducers';
import store from './store/store';
import App from './App';
import './style.scss';

delete AppContainer.prototype.unstable_handleError;

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
