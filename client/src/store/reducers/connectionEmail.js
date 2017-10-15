import update from 'immutability-helper';
import { SET_EMAIL_OPTIONS, SET_EMAIL_FORM_FIELD, CLEAR_FORM_ERROR, SET_FORM_ERROR,
  SET_EMAIL_MODAL } from '../actions/emailActions';
import { SEND_EMAIL_REQUEST, SEND_EMAIL_SUCCESS, SEND_EMAIL_FAILURE } from '../actions/apiActions';
import { UPDATE_CONNECTION_STATUS_REQUEST, UPDATE_CONNECTION_STATUS_SUCCESS,
  UPDATE_CONNECTION_STATUS_FAILURE } from '../actions/apiConnectionActions';

const INITIAL_STATE = {
  recipient: '',
  sender: '',
  subject: '',
  body: '',
  role: '',
  type: '',
  connectionId: '',
  conversationId: '',
  formError: '',
  formErrorClass: 'form__hidden',
  emailSpinnerClass: 'spinner__hide',
  emailModal: {
    class: 'modal__hide',
    text: '',
    title: '',
    type: '',
    action: null,
  },
};

function connectionEmail(state = INITIAL_STATE, action) {
  let error;
  switch (action.type) {
    case SET_EMAIL_OPTIONS:
      return update(
        state,
        {
          recipient: { $set: action.payload.recipient },
          sender: { $set: action.payload.sender },
          subject: { $set: action.payload.subject },
          body: { $set: action.payload.body },
          role: { $set: action.payload.role },
          type: { $set: action.payload.type },
          connectionId: { $set: action.payload.connectionId },
          conversationId: { $set: action.payload.conversationId },
        },
      );

    case SET_EMAIL_FORM_FIELD:
      return update(state, { [action.payload.id]: { $set: action.payload.value } });

    case CLEAR_FORM_ERROR:
      return Object.assign(
        {},
        state,
        {
          formError: '',
          formErrorClass: 'form__hidden',
        },
      );

    case SET_FORM_ERROR:
      return Object.assign({}, state, { formError: action.payload, formErrorClass: 'form__error' });

    case SEND_EMAIL_REQUEST:
      return Object.assign({}, state, { emailSpinnerClass: 'spinner__show' });

    case SEND_EMAIL_SUCCESS:
      return Object.assign({}, state, { emailSpinnerClass: 'spinner__hide' });

    case SEND_EMAIL_FAILURE:
      error = action.payload.response.message || 'An unknown error occurred while sending connection email';
      return Object.assign(
        {},
        state,
        {
          emailSpinnerClass: 'spinner__hide',
          emailModal: {
            class: 'modal__show',
            text: error,
            title: 'ERROR',
            type: 'modal__error',
          },
        },
      );

    case SET_EMAIL_MODAL:
      return Object.assign({}, state, { emailModal: action.payload });

    /*
    *  Called From: <ConnectionDetails />
    *  Purpose: Called when user initiates a status update. Displays the
    *  spinner class to indicate API call is in progress.
    */
    case UPDATE_CONNECTION_STATUS_REQUEST:
      return Object.assign(
        {},
        state,
        {
          emailSpinnerClass: 'spinner__show',
        },
      );

    /*
    *  Called From: <ConnectionDetails />
    *  Payload: The updated connection object
    *  Purpose: Called when status update completes.
    *   Updates the current viewConnections, as well as the original object
    *   in the connections array.
    */
    case UPDATE_CONNECTION_STATUS_SUCCESS:
      return Object.assign({}, state, { emailSpinnerClass: 'spinner__hide' });

    /*
    *  Called From: <ConnectionDetails />
    *  Payload: Error message describing the failure
    *  Purpose: Provide user a description of why the API call fialed.
    */
    case UPDATE_CONNECTION_STATUS_FAILURE:
      error = action.payload.message || 'An error occurred while updating connection status';
      return Object.assign(
        {},
        state,
        {
          emailSpinnerClass: 'spinner__hide',
          emailModal: {
            class: { $set: 'modal__show' },
            type: { $set: 'modal__error' },
            text: { $set: error },
            title: { $set: 'ERROR' },
          },
        },
      );

    default:
      return state;
  }
}

export default connectionEmail;
