export const SET_POSTS = 'SET_POSTS';
export const ADD_POST = 'ADD_POST';

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
