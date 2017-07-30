import {LOGIN, SET_REG_USER, SET_REG_PWD, SET_REG_CONF_PWD, CLEAR_PWD} from '../actions'

const INITIAL_STATE = {
  loggedIn: false,
  authToken: {},
  regUsername: '',
  regPassword: '',
  regConfirmPwd: ''
}

function appState(state=INITIAL_STATE, action){

  switch(action.type){
    case LOGIN:
      return Object.assign({}, state, {loggedIn: true, authToken: action.payload})
      break;

    case SET_REG_USER:
      return Object.assign({}, state, {regUsername: action.payload})
      break;

    case SET_REG_PWD:
      return Object.assign({}, state, {regPassword: action.payload})
      break;

    case SET_REG_CONF_PWD:
      return Object.assign({}, state, {regConfirmPwd: action.payload})
      break;

    case CLEAR_PWD:
      return Object.assign({}, state, {regPassword: '', regConfirmPwd: ''})
      break;

    default:
      return state
  }
}

export default appState
