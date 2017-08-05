import update from 'immutability-helper';
import { SET_POSTS, ADD_POST, SET_CURRENT_POST } from '../actions/postActions';

const INITIAL_STATE = {
  entries: [],
  postErrorMsg: '',
  currentPost: {
    active: '',
    author: '',
    author_id: '',
    availability: '',
    keywords: [],
    body: '',
    role: 'mentor',
    updated: Date.now(),
  },
};

function posts(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_POSTS:
      return Object.assign({}, state, { entries: action.payload });

    case ADD_POST:
      return update(state, { entries: { $push: action.payload } });

    case SET_CURRENT_POST:
      return update(state, { currentPost: { $set: action.payload } });

    default:
      return state;
  }
}

export default posts;
