import update from 'immutability-helper';
import { LOGIN, LOGOUT, UPDATE_PROFILE } from '../actions';

const INITIAL_STATE = {
  loggedIn: undefined,
  authToken: {},
  profile: {},
};

function appState(state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOGIN: {
      window.localStorage.setItem('authToken', JSON.stringify(action.token));
      window.localStorage.setItem('userId', JSON.stringify(action.profile._id));
      return update(state,
        { profile: { $set: action.profile },
          authToken: { $set: action.token },
          loggedIn: { $set: true },
        },
      );
    }

    case LOGOUT:
      window.localStorage.removeItem('authToken');
      window.localStorage.removeItem('userId');
      return Object.assign({}, state, { loggedIn: false, authToken: {}, profile: {} });

    case UPDATE_PROFILE:
      return update(state, { profile: { $set: action.payload } })

    default:
      return state;
  }
}

export default appState;
