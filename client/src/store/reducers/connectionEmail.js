import update from 'immutability-helper';
import { SET_EMAIL_OPTIONS, SET_FORM_FIELD, CLEAR_FORM_ERROR, SET_FORM_ERROR } from '../actions/emailActions';

const INITIAL_STATE = {
  recipient: '',
  sender: '',
  subject: '',
  body: '',
  role: '',
  type: '',
  formError: '',
  formErrorClass: 'form__hidden',
};

function connectionEmail(state = INITIAL_STATE, action) {

  switch (action.type) {
    case SET_EMAIL_OPTIONS:
      return update(
        state,
        {
          recipient: { $set: action.payload.recipients },
          sender: { $set: action.payload.sender },
          subject: { $set: action.payload.subject },
          body: { $set: action.payload.body },
          role: { $set: action.payload.role },
          type: { $set: action.payload.type },
        },
      );

    case SET_FORM_FIELD:
      console.log(action)
      return update(state, { [action['id']]: { $set: action.value } });

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
      return Object.assign({}, state, { formError: action.payload, formErrorClass: '' });

    default:
      return state;
  }
}

export default connectionEmail;
