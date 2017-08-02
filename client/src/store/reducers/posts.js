import { SET_POSTS } from '../actions/postActions';

const INITIAL_STATE = {
  posts: [],
};

function posts(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_POSTS:
      return Object.assign({}, state, posts: action.payload);

    default:
      return state;
  }
}

export default posts;
