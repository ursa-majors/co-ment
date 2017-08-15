import { SET_VIEW_CONNECTION, CLEAR_VIEW_CONNECTION } from '../actions/connectionActions';
import { CONTACT_REQUEST, CONTACT_SUCCESS, CONTACT_FAILURE } from '../actions/apiActions';
import { CONNECTION_REQUEST, CONNECTION_SUCCESS, CONNECTION_FAILURE,
  GET_ALL_CONNECTIONS_REQUEST, GET_ALL_CONNECTIONS_SUCCESS, GET_ALL_CONNECTIONS_FAILURE,
} from '../actions/apiConnectionActions';

const defaultConn = {
  _id: '',
  mentor: {
    id: '',
    name: '',
    avatar: '',
  },
  mentee: {
    id: '',
    name: '',
    avatar: '',
  },
  initiator: {
    id: '',
    name: '',
  },
  originalPost: {
    id: '',
    title: '',
  },
  dateStarted: '',
  dateEnded: '',
  dateAccepted: '',
  dateDeclined: '',
  status: '',
};

const INITIAL_STATE = {
  contact_loading: false,
  contact_error: null,
  connect_loading: false,
  connect_error: null,
  getConnectionsLoading: false,
  getConnectionsError: null,
  connections: [],
  viewConnection: defaultConn,
};

function connection(state = INITIAL_STATE, action) {
  let error;
  switch (action.type) {

    case SET_VIEW_CONNECTION:
      return Object.assign({}, state, { viewConnection: action.payload });

    case CLEAR_VIEW_CONNECTION:
      return Object.assign({}, state, { viewConnection: defaultConn });

    case CONTACT_REQUEST:
      return Object.assign({}, state, { contact_loading: true, contact_error: null });

    case CONTACT_SUCCESS:
      return Object.assign({}, state, { contact_loading: false, contact_error: null });

    case CONTACT_FAILURE:
      error = action.payload.data || { message: action.payload.message };
      return Object.assign({}, state, { contact_loading: false, contact_error: error });

    case CONNECTION_REQUEST:
      return Object.assign({}, state, { connect_loading: true, connect_error: null });

    case CONNECTION_SUCCESS:
      return Object.assign({}, state, { connect_loading: false, connect_error: null });

    case CONNECTION_FAILURE:
      error = action.payload.data || { message: action.payload.message };
      return Object.assign({}, state, { connect_loading: false, connect_error: error });

    case GET_ALL_CONNECTIONS_REQUEST:
      return Object.assign({}, state, { getConnectionsLoading: true, getConnectionsError: null });

    case GET_ALL_CONNECTIONS_SUCCESS:
      return Object.assign({}, state, { connections: action.payload.connections, getConnectionsLoading: false, getConnectionsError: null });

    case GET_ALL_CONNECTIONS_FAILURE:
      error = action.payload.data || { message: action.payload.message };
      return Object.assign({}, state, { getConnectionsLoading: false, getConnectionsError: error });

    default:
      return state;
  }
}

export default connection;
