import { combineReducers } from 'redux';
import appState from '../reducers/appState';
import register from '../reducers/register';
import login from '../reducers/login';
import posts from '../reducers/posts';
import profiles from '../reducers/profiles';
import connection from '../reducers/connection';
import gridControls from '../reducers/gridControls';
import tour from '../reducers/tour';
import connectionEmail from '../reducers/connectionEmail';

const rootReducer = combineReducers({
  appState, register, login, posts, profiles, connection, gridControls, tour, connectionEmail,
});

export default rootReducer;
