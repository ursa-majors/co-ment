import { combineReducers } from 'redux';
import appState from '../reducers/appState';
import register from '../reducers/register';
import login from '../reducers/login';
import posts from '../reducers/posts';

const rootReducer = combineReducers({
  appState, register, login, posts,
});

export default rootReducer;
