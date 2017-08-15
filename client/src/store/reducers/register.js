import { SET_REG_ERROR } from '../actions/regActions';

const INITIAL_STATE = {

  regErrorMsg: '',
};

function register(state = INITIAL_STATE, action) {
  switch (action.type) {

    case SET_REG_ERROR:
      return Object.assign({}, state, { regErrorMsg: action.payload });

    default:
      return state;
  }
}

export default register;
