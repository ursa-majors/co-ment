import { combineReducers } from 'redux';
import appState from '../reducers/appState';
import register from '../reducers/register';

const rootReducer = combineReducers({
  appState, register,
});

export default rootReducer;
