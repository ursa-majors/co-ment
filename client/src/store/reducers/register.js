import { SET_REG_ERROR, DISMISS_REG_MODAL } from '../actions/regActions';
import { REGISTRATION_REQUEST, REGISTRATION_SUCCESS, REGISTRATION_FAILURE } from '../actions/apiLoginActions';

const regSuccessTxt =
`Thank you for registering with Co/Ment! Check your inbox for an account validation email.\n
Next Steps:
Complete your profile.
Create a post to advertise as a Mentor or Mentee
Connect with other users`;

const INITIAL_STATE = {
  registrationSpinnerClass: 'spinner__hide',
  registrationModalClass: 'modal__hide',
  registrationModalText: '',
  regErrorMsg: '',
};
function register(state = INITIAL_STATE, action) {
  let error;
  switch (action.type) {

    /*
    *  Called From: <Registration />
    *  Payload: Error message
    *  Purpose: Display error message from registration form validation
    */
    case SET_REG_ERROR:
      return Object.assign({}, state, { regErrorMsg: action.payload });

    /*
    *  Called From: <Registration />
    *  Payload: None
    *  Purpose: Display spinner so user knows API action is in progress.
    */
    case REGISTRATION_REQUEST:
      return Object.assign(
        {},
        state,
        {
          registrationSpinnerClass: 'spinner__show',
          registrationModalClass: 'modal__hide',
          registrationModalText: '',
        },
      );


    /*
    *  Called From: <Registration />
    *  Payload: N/A
    *  Purpose: Hide spinner so user knows API action is complete.
    *   Note: this action is also handled in appState reducer.
    */
    case REGISTRATION_SUCCESS:
      return Object.assign(
        {},
        state,
        {
          registrationSpinnerClass: 'spinner__hide',
          registrationModalClass: 'modal__show',
          registrationModalText: regSuccessTxt,
        },
      );

    /*
    *  Called From: <Registration />
    *  Payload: Error Message
    *  Purpose: Hide spinner and display error message to user in the form.
    */
    case REGISTRATION_FAILURE:
      error = action.payload.response.message || 'An unknown error occurred during registration';
      return Object.assign(
        {},
        state,
        {
          registrationSpinnerClass: 'spinner__hide',
          registrationModalClass: 'modal__hide',
          regErrorMsg: error,
        },
      );

    /*
    *  Called From: <Registration />
    *  Payload: None
    *  Purpose: Hide modal after successful registration.
    */
    case DISMISS_REG_MODAL:
      return Object.assign(
        {},
        state,
        {
          registrationModalClass: 'modal__hide',
          registrationModalText: '',
        },
      );

    default:
      return state;
  }
}

export default register;
