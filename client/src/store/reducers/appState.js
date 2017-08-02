import { LOGIN, LOGOUT } from '../actions';

const INITIAL_STATE = {
  loggedIn: false,
  authToken: {},
  profile: {}
};

function appState(state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOGIN:
      window.localStorage.setItem('authToken', JSON.stringify(action.payload));
      return Object.assign({}, state, {
        loggedIn: true, authToken: action.token, profile: action.profile,
      });

    case LOGOUT:
      window.localStorage.removeItem('authToken');
      return Object.assign({}, state, { loggedIn: false, authToken: {} });
    default:
      return state;
  }
}

export default appState;
