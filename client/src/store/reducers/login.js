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

    /*
    *  Called From: <Login />
    *  Payload: Username value from form
    *  Purpose: Connected component handler
    */
    case SET_LOGIN_USER:
      return Object.assign({}, state, { loginUsername: action.payload });

    /*
    *  Called From: <Login />
    *  Payload: Password value from form
    *  Purpose: Connected component handler
    */
    case SET_LOGIN_PWD:
      return Object.assign({}, state, { loginPassword: action.payload });

    /*
    *  Called From: <Login />
    *  Payload: None
    *  Purpose: Clear password from redux after form submission
    */
    case CLEAR_LOGIN_PWD:
      return Object.assign({}, state, { loginPassword: '' });

    /*
    *  Called From: <Login />
    *  Payload: Text - error message
    *  Purpose: Show error message on form
    */
    case SET_LOGIN_ERROR:
      return Object.assign({}, state, { errorMsg: action.payload });

    /*
    *  Called From: <Login />
    *  Payload: None
    *  Purpose: Activate spinner so user knows API request is in progress
    */
    case LOGIN_REQUEST:
      return Object.assign({}, state, { loginSpinnerClass: 'spinner__show' });

    /*
    *  Called From: <Login />
    *  Payload: N/A
    *  Purpose: De-activate the progress spinner.  Note: this action is also handled
    *   in the appState reducer.
    */
    case LOGIN_SUCCESS:
      return Object.assign(
        {},
        state,
        {
          loginSpinnerClass: 'spinner__hide',
          loginPassword: '',
        },
      );

    /*
    *  Called From: <Login />
    *  Payload: Error Message
    *  Purpose: Display API login error to user
    */
    case LOGIN_FAILURE:
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
