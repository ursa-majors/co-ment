import { SET_LOGIN_USER, SET_LOGIN_PWD, CLEAR_LOGIN_PWD, SET_LOGIN_ERROR } from '../actions';
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE } from '../actions/apiLoginActions';

const INITIAL_STATE = {
  loginUsername: '',
  loginPassword: '',
  errorMsg: '',
  loginSpinnerClass: 'spinner__hide',
  loginModalClass: 'modal__hide',
  loginModalText: '',
};

function login(state = INITIAL_STATE, action) {
  let error;
  switch (action.type) {
    case SET_LOGIN_USER:
      return Object.assign({}, state, { loginUsername: action.payload });

    case SET_LOGIN_PWD:
      return Object.assign({}, state, { loginPassword: action.payload });

    case CLEAR_LOGIN_PWD:
      return Object.assign({}, state, { loginPassword: '' });

    case SET_LOGIN_ERROR:
      return Object.assign({}, state, { errorMsg: action.payload });

    case LOGIN_REQUEST:
      return Object.assign({}, state, { loginSpinnerClass: 'spinner__show' });

    case LOGIN_SUCCESS:
      return Object.assign(
        {},
        state,
        {
          loginSpinnerClass: 'spinner__hide',
          loginPassword: '',
        },
      );

    case LOGIN_FAILURE:
    console.log(action)
      error = action.payload.response.message || 'An unknown error occurred';
      return Object.assign(
        {},
        state,
        {
          loginSpinnerClass: 'spinner__hide',
          errorMsg: error,
        },
      );
    default:
      return state;
  }
}

export default login;
