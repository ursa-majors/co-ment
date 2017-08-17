import update from 'immutability-helper';
import { LOGIN, LOGOUT } from '../actions';
import { VALIDATE_TOKEN_REQUEST, VALIDATE_TOKEN_SUCCESS, VALIDATE_TOKEN_FAILURE,
} from '../actions/apiLoginActions';

const INITIAL_STATE = {
  loggedIn: false,
  authToken: {},
  userId: '',
  loginSpinnerClass: 'spinner__hide',
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

    case VALIDATE_TOKEN_REQUEST:
      return Object.assign({}, state, { loginSpinnerClass: 'spinner__show' });

    case VALIDATE_TOKEN_SUCCESS:
      return Object.assign(
        {},
        state,
        {
          loginSpinnerClass: 'spinner__hide',
          loggedIn: true,
          userId: action.payload._id,
          authToken: action.meta.token,
        },
       );

    case VALIDATE_TOKEN_FAILURE:
      window.localStorage.removeItem('authToken');
      window.localStorage.removeItem('userId');
      return Object.assign(
        {},
        state,
        {
          loginSpinnerClass: 'spinner__hide',
          loggedIn: false,
        },
      );

    default:
      return state;
  }
}

export default appState;
