export const SET_POSTS = 'SET_POSTS';

export function setPosts(posts) {
  return ({
    type: SET_POSTS,
    payload: posts,
  });
}
