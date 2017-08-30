export const SET_POSTS = 'SET_POSTS';
export const SAVE_POST = 'SAVE_POST';
export const SET_POST_ERROR = 'SET_POST_ERROR';
export const CLEAR_CURRENT_POST = 'CLEAR_CURRENT_POST';
export const SET_EDIT_POST = 'SET_EDIT_POST';
export const SET_FORM_FIELD = 'SET_FORM_FIELD';
export const RESET_FORM = 'RESET_FORM';
export const ADD_KEYWORD = 'ADD_KEYWORD';
export const REMOVE_KEYWORD = 'REMOVE_KEYWORD';
export const SET_SEARCH_CRITERIA = 'SET_SEARCH_CRITERIA';
export const CLEAR_SEARCH_CRITERIA = 'CLEAR_SEARCH_CRITERIA';
export const SET_VIEWPOST_MODAL = 'SET_VIEWPOST_MODAL';
export const SET_LOADPOSTS_MODAL = 'SET_LOADPOSTS_MODAL';

export function setPosts(posts) {
  return ({
    type: SET_POSTS,
    payload: posts,
  });
}

export function savePost(post) {
  return ({
    type: SAVE_POST,
    payload: post,
  });
}


export function clearCurrentPost() {
  return ({
    type: CLEAR_CURRENT_POST,
  });
}

export function setEditPost(post) {
  return ({
    type: SET_EDIT_POST,
    payload: post,
  });
}

export function resetForm() {
  return ({
    type: RESET_FORM,
  });
}

export function setFormField(field, value) {
  return ({
    type: SET_FORM_FIELD,
    field,
    value,
  });
}

export function addKeyword(word) {
  return ({
    type: ADD_KEYWORD,
    payload: word,
  });
}

export function removeKeyword(word) {
  return ({
    type: REMOVE_KEYWORD,
    payload: word,
  });
}

export function setSearchCriteria(searchObj) {
  return ({
    type: SET_SEARCH_CRITERIA,
    payload: searchObj,
  });
}

export function clearSearchCriteria() {
  return ({
    type: CLEAR_SEARCH_CRITERIA,
  });
}

export function setViewPostModal(options) {
  return ({
    type: SET_VIEWPOST_MODAL,
    payload: options,
  });
}

export function setLoadPostsModal(options) {
  return ({
    type: SET_LOADPOSTS_MODAL,
    payload: options,
  });
}
