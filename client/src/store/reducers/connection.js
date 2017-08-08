import { CONTACT_REQUEST, CONTACT_SUCCESS, CONTACT_FAILURE } from '../actions/apiActions';

const INITIAL_STATE = {
  loading: false,
  error: null,
};

function connection(state = INITIAL_STATE, action) {
  let error;
  switch (action.type) {
    case CONTACT_SUCCESS:
      return Object.assign({}, state, { loading: false, error: null });

    case CONTACT_REQUEST:
      return Object.assign({}, state, { loading: true, error: null });

    case CONTACT_FAILURE:
      error = action.payload.data || { message: action.payload.message };
      return Object.assign({}, state, { loading: false, error });

    default:
      return state;
  }
}

export default connection;
