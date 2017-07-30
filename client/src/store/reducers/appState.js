import { LOGIN } from '../actions';

const INITIAL_STATE = {
  loggedIn: false,
};

function appState(state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOGIN:
      return Object.assign({}, state, { loggedIn: true });

    default:
      return state;
  }
}

export default appState;
