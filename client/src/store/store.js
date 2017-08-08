import { createStore, applyMiddleware } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import rootReducer from './reducers/';

const store = createStore(rootReducer, applyMiddleware(apiMiddleware));

export default store;
