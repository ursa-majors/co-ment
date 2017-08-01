import { SET_REG_USER, SET_REG_PWD, SET_REG_CONF_PWD, CLEAR_PWD, SET_REG_ERROR } from '../actions';

const INITIAL_STATE = {
  regUsername: '',
  regPassword: '',
  regConfirmPwd: '',
  regErrorMsg: '',
};

function register(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_REG_USER:
      return Object.assign({}, state, { regUsername: action.payload });

    case SET_REG_PWD:
      return Object.assign({}, state, { regPassword: action.payload });

    case SET_REG_CONF_PWD:
      return Object.assign({}, state, { regConfirmPwd: action.payload });

    case CLEAR_PWD:
      return Object.assign({}, state, { regPassword: '', regConfirmPwd: '' });

    case SET_REG_ERROR:
      return Object.assign({}, state, { regErrorMsg: action.payload });

    default:
      return state;
  }
}

export default register;
