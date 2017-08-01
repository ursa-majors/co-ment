import { LOGIN } from '../actions';

const INITIAL_STATE = {
  loggedIn: false,
  authToken: {},
};

function appState(state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOGIN:
      return Object.assign({}, state, { loggedIn: true, authToken: action.payload });

    default:
      return state;
  }
}

export default appState;
