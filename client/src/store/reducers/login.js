import { SET_LOGIN_USER, SET_LOGIN_PWD, CLEAR_LOGIN_PWD, SET_LOGIN_ERROR,
  DISMISS_PWRESET_MODAL, DISMISS_LOGIN_MODAL } from '../actions'
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, RESET_PW_REQUEST, RESET_PW_SUCCESS,
  RESET_PW_FAILURE, SEND_RESET_EMAIL_REQUEST, SEND_RESET_EMAIL_SUCCESS, SEND_RESET_EMAIL_FAILURE } from '../actions/apiLoginActions'

const INITIAL_STATE = {
  authToken: '',
  loginUsername: '',
  loginPassword: '',
  errorMsg: '',
  loginSpinnerClass: 'spinner__hide',
  loginModalClass: 'modal__hide',
  loginModalText: '',
  pwResetSpinnerClass: 'spinner__hide',
  pwResetModalClass: 'modal__hide',
  pwResetModalType: '',
  pwResetModalText: ''
}

function login (state = INITIAL_STATE, action) {
  let error
  switch (action.type) {
    /*
    *  Called From: <Login />
    *  Payload: Username value from form
    *  Purpose: Connected component handler
    */
    case SET_LOGIN_USER:
      return Object.assign({}, state, { loginUsername: action.payload })

    /*
    *  Called From: <Login />
    *  Payload: Password value from form
    *  Purpose: Connected component handler
    */
    case SET_LOGIN_PWD:
      return Object.assign({}, state, { loginPassword: action.payload })

    /*
    *  Called From: <Login />
    *  Payload: None
    *  Purpose: Clear password from redux after form submission
    */
    case CLEAR_LOGIN_PWD:
      return Object.assign({}, state, { loginPassword: '' })

    /*
    *  Called From: <Login />
    *  Payload: Text - error message
    *  Purpose: Show error message on form
    */
    case SET_LOGIN_ERROR:
      return Object.assign({}, state, { errorMsg: action.payload })

    /*
    *  Called From: <Login />
    *  Payload: None
    *  Purpose: Activate spinner so user knows API request is in progress
    */
    case LOGIN_REQUEST:
      return Object.assign({}, state, { loginSpinnerClass: 'spinner__show' })

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
          loginPassword: ''
        }
      )

    /*
    *  Called From: <Login />
    *  Payload: Error Message
    *  Purpose: Display API login error to user
    */
    case LOGIN_FAILURE:
      error = 'An unknown login error occurred'
      return Object.assign(
        {},
        state,
        {
          loginSpinnerClass: 'spinner__hide',
          errorMsg: error
        }
      )

    /*
    *  Called from: <ResetPassword />
    *  Payload: None
    *  Purpose: Display a spinner to indicate API call in progress
    */
    case RESET_PW_REQUEST:
      return Object.assign(
        {},
        state,
        {
          pwResetSpinnerClass: 'spinner__show',
          pwResetModalClass: 'modal__hide',
          pwResetModalText: ''
        }
      )

    /*
    *  Called from: <ResetPassword />
    *  Payload: None
    *  Purpose: Display a spinner to indicate API call in progress
    */
    case RESET_PW_SUCCESS:
      return Object.assign(
        {},
        state,
        {
          pwResetSpinnerClass: 'spinner__hide',
          pwResetModalClass: 'modal__show',
          pwResetModalType: 'modal__success',
          pwResetModalText: 'Your password has been reset. Click Sign In to continue'
        }
      )

    /*
    *  Called from: <ResetPassword />
    *  Payload: Error message
    *  Purpose: Display an error message to the user.
    */
    case RESET_PW_FAILURE:
      error = 'An unknown error occurred while resetting password'
      return Object.assign(
        {},
        state,
        {
          pwResetSpinnerClass: 'spinner__hide',
          pwResetModalClass: 'modal__show',
          pwResetModalType: 'modal__error',
          pwResetModalText: error
        }
      )

    /*
    *  Called from: <Login />
    *  Payload: None
    *  Purpose: Display a spinner to indicate API call in progress
    */
    case SEND_RESET_EMAIL_REQUEST:
      return Object.assign(
        {},
        state,
        {
          loginSpinnerClass: 'spinner__show',
          loginModalClass: 'modal__hide',
          errorMsg: ''
        }
      )

    /*
    *  Called from: <Login />
    *  Payload: String - a success message
    *  Purpose: Display success message to user
    */
    case SEND_RESET_EMAIL_SUCCESS:
      return Object.assign(
        {},
        state,
        {
          loginSpinnerClass: 'spinner__hide',
          loginModalClass: 'modal__show',
          loginModalText: `A password reset link has been sent to the email registered to ${action.meta.username}.
          Follow the instructions to complete the password reset`
        }
      )

    /*
    *  Called from: <Login />
    *  Payload: None
    *  Purpose: Display a spinner to indicate API call in progress
    */
    case SEND_RESET_EMAIL_FAILURE:
      error = 'An unknown error occurred while sending reset email'
      return Object.assign(
        {},
        state,
        {
          loginSpinnerClass: 'spinner__hide',
          errorMsg: error
        }
      )

    /*
    *  Called from: <ResetPassword />
    *  Payload: None
    *  Purpose: update state to dismiss the modal box
    */
    case DISMISS_PWRESET_MODAL:
      return Object.assign(
        {},
        state,
        {
          pwResetModalText: '',
          pwResetModalClass: 'modal__hide',
          pwResetModalType: ''
        }
      )

    /*
    *  Called from: <Login />
    *  Payload: None
    *  Purpose: update state to dismiss the modal box
    */
    case DISMISS_LOGIN_MODAL:
      return Object.assign(
        {},
        state,
        {
          loginModalText: '',
          loginModalClass: 'modal__hide'
        }
      )

    default:
      return state
  }
}

export default login
