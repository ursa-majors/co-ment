import update from 'immutability-helper';
import { LOGIN, LOGOUT, UPDATE_PROFILE } from '../actions';

const INITIAL_STATE = {
  loggedIn: false,
  authToken: {},
  userId: '',
};

function appState(state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOGIN: {
      window.localStorage.setItem('authToken', JSON.stringify(action.token));
      window.localStorage.setItem('userId', JSON.stringify(action.profile._id));
      return update(state,
        { userId: { $set: action.profile._id },
          authToken: { $set: action.token },
          loggedIn: { $set: true },
        },
      );
    }

    case LOGOUT:
      window.localStorage.removeItem('authToken');
      window.localStorage.removeItem('userId');
      return INITIAL_STATE;

    default:
      return state;
  }
}

export default appState;
