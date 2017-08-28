import update from 'immutability-helper';

import { SET_VIEW_CONNECTION, CLEAR_VIEW_CONNECTION, SET_CONNECTIONS_MODAL_CLASS,
  SET_CONNECTIONS_MODAL_TEXT, SET_CONN_DETAILS_MODAL_TEXT, SET_CONN_DETAILS_MODAL_CLASS,
  SET_CONN_MODAL_CLASS, SET_CONN_MODAL_TEXT } from '../actions/connectionActions';
import { CONTACT_REQUEST, CONTACT_SUCCESS, CONTACT_FAILURE } from '../actions/apiActions';
import { CONNECTION_REQUEST, CONNECTION_SUCCESS, CONNECTION_FAILURE, GET_ALL_CONNECTIONS_REQUEST,
  GET_ALL_CONNECTIONS_SUCCESS, GET_ALL_CONNECTIONS_FAILURE, UPDATE_CONNECTION_STATUS_REQUEST,
  UPDATE_CONNECTION_STATUS_SUCCESS, UPDATE_CONNECTION_STATUS_FAILURE } from '../actions/apiConnectionActions';

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
  connectionId: null,
  contact_loading: false,
  contact_error: null,
  connect_loading: false,
  connect_error: null,
  // ConnectionDetails state
  viewConnection: defaultConn,
  connDetailsSpinnerClass: 'spinner__hide',
  connDetailsModalClass: 'modal__hide',
  connDetailsModalText: '',
  // Connections state
  getConnectionsSpinnerClass: 'spinner__hide',
  getConnectionsModalClass: 'modal__hide',
  getConnectionsModalText: '',
  connections: [],
  // Connection Request state
  connectionSpinnerClass: 'spinner__hide',
  connectionModalClass: 'modal__hide',
  connectionModalText: '',
};

function connection(state = INITIAL_STATE, action) {
  let error;
  let index;
  switch (action.type) {

    /*
    *  Called From: <ConnectionDetails />
    *  Payload: A connection object
    *  Purpose: Connection Details are cleared when the component unmounts to prevent showing
    *   the previous details when a new connection is selected.  Also,
    *   if user is redirected to ConnectionDetails from a deep link, the state will not
    *   have the connection details. This function is used to set the detail view based on the
    *   url param once connections have been loaded from server
    */
    case SET_VIEW_CONNECTION:
      return Object.assign({}, state, { viewConnection: action.payload });

    /*
    *  Called From: <ConnectionDetails />
    *  Purpose: Prevent flash of old content when user loads component
    */
    case CLEAR_VIEW_CONNECTION:
      return Object.assign({}, state, { viewConnection: defaultConn });

    /*
    *  Called From: <ConnectionDetails />
    *  Purpose: Called when user initiates a status update. Displays the
    *  spinner class to indicate API call is in progress.
    */
    case UPDATE_CONNECTION_STATUS_REQUEST:
      return Object.assign(
        {},
        state,
        {
          connDetailsSpinnerClass: 'spinner__show',
        },
      );

    /*
    *  Called From: <ConnectionDetails />
    *  Payload: The updated connection object
    *  Purpose: Called when status update completes.
    *   Updates the current viewConnections, as well as the original object
    *   in the connections array.
    */
    case UPDATE_CONNECTION_STATUS_SUCCESS:
      index = -1;
      for (index = 0; index < state.connections.length; index += 1) {
        if (state.connections[index]._id === action.payload._id) {
          break;
        }
      }
      return update(
        state,
        {
          connDetailsSpinnerClass: { $set: 'spinner__hide' },
          connDetailsModalClass: { $set: 'modal__show' },
          connDetailsModalText: { $set: 'Connection status updated!' },
          connections: { $splice: [[index, 1, action.payload.conn]] },
          viewConnection: { $set: action.payload.conn },
        },
      );

    /*
    *  Called From: <ConnectionDetails />
    *  Payload: Error message describing the failure
    *  Purpose: Provide user a description of why the API call fialed.
    */
    case UPDATE_CONNECTION_STATUS_FAILURE:
      error = action.payload.message || 'An error occurred while updating connection status';
      return Object.assign(
        {},
        state,
        {
          connDetailsSpinnerClass: 'spinner__hide',
          connDetailsModalClass: 'modal__show',
          connDetailsModalText: error,
        },
      );

    /*
    *  Called From: <ConnectionDetails />
    *  Payload: Text to show in the modal
    *  Purpose: Set/Unset the text for the modal.
    */
    case SET_CONN_DETAILS_MODAL_TEXT:
      return Object.assign({}, state, { connDetailsModalText: action.payload });

    /*
    *  Called From: <ConnectionDetails />
    *  Payload: CSS Class to show/hide the modal
    *  Purpose: Show/Hide the modal.
    */
    case SET_CONN_DETAILS_MODAL_CLASS:
      return Object.assign({}, state, { connDetailsModalClass: action.payload });

/*---------------------------------------------------------------------------------*/

    /*
    *  Called From: <Connections /> and <ConnectionDetails />
    *  Payload: None
    *  Purpose: When a getConnections() function is called, this sets the spinner CSS
    *   to indicate that an API call is in progress.
    */
    case GET_ALL_CONNECTIONS_REQUEST:
      return Object.assign(
        {},
        state,
        {
          getConnectionsSpinnerClass: 'spinner__show',
          getConnectionsModalClass: 'modal__hide',
        },
      );

    /*
    *  Called From: <Connections /> and <ConnectionDetails />
    *  Payload: An array of connection objects
    *  Purpose: Called when the API call succeeds.  Populate the connection list for a user.
    *  It's possible for the call to succeed, but not return any connections (if the user
    *  hasn't made any).  For this case, we set the state to display a message to user.
    */
    case GET_ALL_CONNECTIONS_SUCCESS:
      if (action.payload.connections.length > 0) {
        return Object.assign(
          {},
          state,
          {
            connections: action.payload.connections,
            getConnectionsSpinnerClass: 'spinner__hide',
            getConnectionsModalClass: 'modal__hide',
          },
        );
      }
      return Object.assign(
        {},
        state,
        {
          getConnectionsSpinnerClass: 'spinner__hide',
          getConnectionsModalClass: 'modal__show',
          getConnectionsModalText: 'You haven\'t made any connections yet. Search our posts to find a Mentor or Mentee connection.',
        },
      );

    /*
    *  Called From: <Connections /> and <ConnectionDetails />
    *  Payload: An error message
    *  Purpose: Called when the API call fails. Set the state to display a message to user.
    */
    case GET_ALL_CONNECTIONS_FAILURE:
      error = action.payload.message || 'An error occurred while fetching connections';
      return Object.assign(
        {},
        state,
        {
          getConnectionsSpinnerClass: 'spinner__hide',
          getConnectionsModalClass: 'modal__show',
          getConnectionsModalText: error,
        },
      );

    /*
    *  Called From: <Connections />
    *  Payload: CSS class to show/hide the modal
    *  Purpose: Called from the modal to dismiss the modal
    */
    case SET_CONNECTIONS_MODAL_CLASS:
      return Object.assign({}, state, { getConnectionsModalClass: action.payload });

    /*
    *  Called From: <Connections />
    *  Payload: Text to display in the modal.
    *  Purpose: Set the text to display in the modal
    */
    case SET_CONNECTIONS_MODAL_TEXT:
      return Object.assign({}, state, { getConnectionsModalText: action.payload });

/*---------------------------------------------------------------------------------*/

    /*
    *  Called From: <Connection />
    *  Payload: None.
    *  Purpose: Set the connection spinner to indicate an API call is in progress.
    */
    case CONTACT_REQUEST:
      return Object.assign(
        {},
        state,
        {
          connectionSpinnerClass: 'spinner__show',
        },
      );

    /*
    *  Called From: <Connection />
    *  Payload: None. (The email was sent to user)
    *  Purpose: Let the user know the email was sent.
    */
    case CONTACT_SUCCESS:
      return Object.assign(
        {},
        state,
        {
          connectionSpinnerClass: 'spinner__hide',
        },
      );

    /*
    *  Called From: <Connection />
    *  Payload: Error message
    *  Purpose: Display modal with email error message
    */
    case CONTACT_FAILURE:
      error = action.payload.response.message || 'An error occurred while attempting to email user';
      return Object.assign(
        {},
        state,
        {
          connectionSpinnerClass: 'spinner__hide',
          connectionModalClass: 'modal__show',
          connectionModalText: error,
        },
      );

    /*
    *  Called From: <Connection />
    *  Payload: None.
    *  Purpose: Set the connection spinner to indicate an API call is in progress.
    */
    case CONNECTION_REQUEST:
      return Object.assign({}, state, { connectionSpinnerClass: 'spinner__show' });

    /*
    *  Called From: <Connection />
    *  Payload: connection ID.
    *  Purpose: Hide the spinner - user is redirected to "ConnectionResult" page
    *   so no modal is shown, and return connectionId to use in connection request email template.
    */
    case CONNECTION_SUCCESS:
      const id = action.payload.connectionId;
      return Object.assign({}, state, { connectionSpinnerClass: 'spinner__hide',  connectionId: id, });

    /*
    *  Called From: <Connection />
    *  Payload: Error message
    *  Purpose: Display modal with email error message
    */
    case CONNECTION_FAILURE:
      error = action.payload.response.message || 'An error occurred while attempting to save connection';
      return Object.assign(
        {},
        state,
        {
          connectionSpinnerClass: 'spinner__hide',
          connectionModalClass: 'modal__show',
          connectionModalText: error,
        },
      );

    /*
    *  Called From: <Connection />
    *  Payload: Text message
    *  Purpose: Display modal with text message
    */
    case SET_CONN_MODAL_TEXT:
      return Object.assign({}, state, { connectionModalText: action.payload });

    /*
    *  Called From: <Connection />
    *  Payload: CSS Class
    *  Purpose: Show/Hide the connection modal
    */
    case SET_CONN_MODAL_CLASS:
      return Object.assign({}, state, { connectionModalClass: action.payload });

    default:
      return state;
  }
}

export default connection;
