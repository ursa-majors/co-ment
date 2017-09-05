import { SET_INDEX } from '../actions/tourActions';
import { slides, faq } from '../../utils/slides';

const INITIAL_STATE = {
  imageIndex: 0,
  slides,
  faq,
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
