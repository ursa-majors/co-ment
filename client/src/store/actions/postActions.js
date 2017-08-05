export const SET_POSTS = 'SET_POSTS';
export const ADD_POST = 'ADD_POST';
export const SET_POST_ERROR = 'SET_POST_ERROR';
export const SET_CURRENT_POST = 'SET_CURRENT_POST';

export function setPosts(posts) {
  return ({
    type: SET_POSTS,
    payload: posts,
  });
}

export function addPost(post) {
  return ({
    type: ADD_POST,
    payload: post,
  });
}

export function setCurrentPost(post) {
  return ({
    type: SET_CURRENT_POST,
    payload: post,
  });
}
