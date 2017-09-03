import { SET_INDEX } from '../actions/tourActions';

const INITIAL_STATE = {
  imageIndex: 0,
  images: ['test1', 'test2', 'test3'],
};

function tour(state = INITIAL_STATE, action) {
  switch (action.type) {

    case SET_INDEX:
    console.log(action)
      return Object.assign({}, state, { imageIndex: action.payload });

    default:
      return state;
  }
}

export default tour;
