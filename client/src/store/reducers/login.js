import { SET_LOGIN_USER, SET_LOGIN_PWD, CLEAR_LOGIN_PWD, SET_LOGIN_ERROR } from '../actions';

const INITIAL_STATE = {
  loginUsername: '',
  loginPassword: '',
  errorMsg: '',
};

function login(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_LOGIN_USER:
      return Object.assign({}, state, { loginUsername: action.payload });

    case SET_LOGIN_PWD:
      return Object.assign({}, state, { loginPassword: action.payload });

    case CLEAR_LOGIN_PWD:
      return Object.assign({}, state, { loginPassword: '' });

    case SET_LOGIN_ERROR:
      return Object.assign({}, state, { errorMsg: action.payload });

    default:
      return state;
  }
}

export default login;
