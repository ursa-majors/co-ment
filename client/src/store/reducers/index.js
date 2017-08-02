import { combineReducers } from 'redux';
import appState from '../reducers/appState';
import register from '../reducers/register';
import login from '../reducers/login';

const rootReducer = combineReducers({
  appState, register, login,
});

export default rootReducer;
