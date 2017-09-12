import update from 'immutability-helper';
import { SET_EMAIL_OPTIONS, SET_FORM_FIELD, CLEAR_FORM_ERROR, SET_FORM_ERROR,
  SET_EMAIL_MODAL } from '../actions/emailActions';
import { SEND_EMAIL_REQUEST, SEND_EMAIL_SUCCESS, SEND_EMAIL_FAILURE } from '../actions/apiActions';

const INITIAL_STATE = {
  recipient: '',
  sender: '',
  subject: '',
  body: '',
  role: '',
  type: '',
  connectionId: '',
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
        },
      );

    case SET_FORM_FIELD:
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

    default:
      return state;
  }
}

export default connectionEmail;
