export const SET_EMAIL_OPTIONS = 'SET_EMAIL_OPTIONS';
export const SET_EMAIL_FORM_FIELD = 'SET_EMAIL_FORM_FIELD';
export const CLEAR_FORM_ERROR = 'CLEAR_FORM_ERROR';
export const SET_FORM_ERROR = 'SET_FORM_ERROR';
export const SET_EMAIL_MODAL = 'SET_EMAIL_MODAL';

export function setEmailOptions(options) {
  return ({
    type: SET_EMAIL_OPTIONS,
    payload: options,
  });
}

export function setFormField(id, value) {
  return ({
    type: SET_EMAIL_FORM_FIELD,
    payload: {
      id,
      value,
    },
  });
}

export function clearFormError() {
  return ({
    type: CLEAR_FORM_ERROR,
  });
}

export function setFormError(err) {
  return ({
    type: SET_FORM_ERROR,
    payload: err,
  });
}

export function setEmailModal(options) {
  return ({
    type: SET_EMAIL_MODAL,
    payload: options,
  });
}
