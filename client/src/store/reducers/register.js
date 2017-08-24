import { SET_REG_ERROR } from '../actions/regActions';
import { REGISTRATION_REQUEST, REGISTRATION_SUCCESS, REGISTRATION_FAILURE } from '../actions/apiLoginActions';

const INITIAL_STATE = {
  registrationSpinnerClass: 'spinner__hide',
  regErrorMsg: '',
};

function register(state = INITIAL_STATE, action) {
  let error;
  switch (action.type) {

    case SET_REG_ERROR:
      return Object.assign({}, state, { regErrorMsg: action.payload });

    case REGISTRATION_REQUEST:
      return Object.assign({}, state, { registrationSpinnerClass: 'spinner__show' });

    case REGISTRATION_SUCCESS:
      return Object.assign({}, state, { registrationSpinnerClass: 'spinner__hide' });

    case REGISTRATION_FAILURE:
      error = action.response.message || 'An unknown error occurred';
      return Object.assign(
        {},
        state,
        {
          registrationSpinnerClass: 'spinner__hide',
          regErrorMsg: error,
        },
      );

    default:
      return state;
  }
}

export default register;
