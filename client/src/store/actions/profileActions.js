export const SAVE_PROFILE = 'SAVE_PROFILE';
export const SET_CURRENT_PROFILE = 'SET_CURRENT_PROFILE';
export const SET_USER_PROFILE = 'SET_USER_PROFILE';
export const SET_EDIT_PROFILE = 'SET_EDIT_PROFILE';
export const SET_FORM_FIELD = 'SET_FORM_FIELD';
export const ADD_SKILL = 'ADD_SKILL';
export const ADD_LANGUAGE = 'ADD_LANGUAGE';
export const REMOVE_SKILL = 'REMOVE_SKILL';
export const REMOVE_LANGUAGE = 'REMOVE_LANGUAGE';
export const DISMISS_VIEWPROFILE_MODAL = 'DISMISS_VIEWPROFILE_MODAL';
export const SET_PROFILE_MODAL_CLASS = 'SET_PROFILE_MODAL_CLASS';
export const SET_PROFILE_MODAL_TEXT = 'SET_PROFILE_MODAL_TEXT';

export function saveProfile(profile) {
  return ({
    type: SAVE_PROFILE,
    payload: profile,
  });
}

export function setCurrentProfile(profile) {
  return ({
    type: SET_CURRENT_PROFILE,
    payload: profile,
  });
}

export function setUserProfile(profile) {
  return ({
    type: SET_USER_PROFILE,
    payload: profile,
  });
}

export function setEditProfile(profile) {
  return ({
    type: SET_EDIT_PROFILE,
    payload: profile,
  });
}

export function setFormField(field, value) {
  return ({
    type: SET_FORM_FIELD,
    field,
    value,
  });
}

export function addLanguage(word) {
  return ({
    type: ADD_LANGUAGE,
    payload: word,
  });
}

export function addSkill(word) {
  return ({
    type: ADD_SKILL,
    payload: word,
  });
}

export function removeLanguage(word) {
  return ({
    type: REMOVE_LANGUAGE,
    payload: word,
  });
}

export function removeSkill(word) {
  return ({
    type: REMOVE_SKILL,
    payload: word,
  });
}

export function dismissViewProfileModal() {
  return ({
    type: DISMISS_VIEWPROFILE_MODAL,
  });
}

export function setProfileModalClass(modalClass) {
  return ({
    type: SET_PROFILE_MODAL_CLASS,
    payload: modalClass,
  });
}

export function setProfileModalText(text) {
  return ({
    type: SET_PROFILE_MODAL_TEXT,
    payload: text,
  });
}
