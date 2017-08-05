export const SET_POSTS = 'SET_POSTS';
export const SAVE_POST = 'SAVE_POST';
export const SET_POST_ERROR = 'SET_POST_ERROR';
export const SET_CURRENT_POST = 'SET_CURRENT_POST';

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
