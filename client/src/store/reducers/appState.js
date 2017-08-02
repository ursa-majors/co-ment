import { LOGIN, LOGOUT } from '../actions';

const INITIAL_STATE = {
  loggedIn: false,
  authToken: {},
  userID: '5980d7397f59c400656f5bf3',
};

function appState(state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOGIN:
      window.localStorage.setItem('authToken', JSON.stringify(action.payload));
      return Object.assign({}, state, { loggedIn: true, authToken: action.payload });

    case LOGOUT:
      window.localStorage.removeItem('authToken');
      return Object.assign({}, state, { loggedIn: false, authToken: {} });
    default:
      return state;
  }
}

export default appState;
