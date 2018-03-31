import { SET_INDEX } from '../actions/tourActions';
import { slides, faq } from '../../utils/slides';
import { scrollIt } from '../../utils';

const INITIAL_STATE = {
  imageIndex: 0,
  slides,
  faq,
};

function tour(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_INDEX:
      // scroll to top when slide changes
      // (for shorter viewports with slide footer nav)
      scrollIt(document.querySelector('.tour'), 300, 'easeOutQuad');
      return Object.assign({}, state, { imageIndex: action.payload });

    default:
      return state;
  }
}

export default tour;
