import update from 'immutability-helper';
import { LOGIN, LOGOUT } from '../actions';

const INITIAL_STATE = {
  loggedIn: false,
  authToken: {},
  profile: {},
};

function appState(state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOGIN: {
      console.log(typeof action.token);
      window.localStorage.setItem('authToken', JSON.stringify(action.token));
      const newState = update(state,
        { profile: { $set: action.profile },
          authToken: { $set: action.token },
          loggedIn: { $set: true },
        },
      );
      return newState;
    }

    case LOGOUT:
      window.localStorage.removeItem('authToken');
      return Object.assign({}, state, { loggedIn: false, authToken: {} });
    default:
      return state;
  }
}

export default appState;
