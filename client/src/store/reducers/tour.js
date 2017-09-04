import { SET_INDEX } from '../actions/tourActions';
import slides from '../../utils/slides';

const INITIAL_STATE = {
  imageIndex: 0,
  slides,
};

function tour(state = INITIAL_STATE, action) {
  switch (action.type) {

    case SET_INDEX:
      return Object.assign({}, state, { imageIndex: action.payload });

    default:
      return state;
  }
}

export default tour;
