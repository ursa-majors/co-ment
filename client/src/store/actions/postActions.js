export const SET_POSTS = 'SET_POSTS';
export const SAVE_POST = 'SAVE_POST';
export const SET_POST_ERROR = 'SET_POST_ERROR';
export const SET_CURRENT_POST = 'SET_CURRENT_POST';
export const SET_EDIT_POST = 'SET_EDIT_POST';
export const SET_FORM_FIELD = 'SET_FORM_FIELD';
export const ADD_KEYWORD = 'ADD_KEYWORD';
export const REMOVE_KEYWORD = 'REMOVE_KEYWORD';
export const SET_SEARCH_CRITERIA = 'SET_SEARCH_CRITERIA';
export const CLEAR_SEARCH_CRITERIA = 'CLEAR_SEARCH_CRITERIA';

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

export function setCurrentPost(post) {
  return ({
    type: SET_CURRENT_POST,
    payload: post,
  });
}

export function setEditPost(post) {
  return ({
    type: SET_EDIT_POST,
    payload: post,
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
