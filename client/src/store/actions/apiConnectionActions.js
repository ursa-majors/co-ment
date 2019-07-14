import { CALL_API } from 'redux-api-middleware';
import BASE_URL from './apiConfig';

export const CONNECTION_REQUEST = 'CONNECTION_REQUEST';
export const CONNECTION_SUCCESS = 'CONNECTION_SUCCESS';
export const CONNECTION_FAILURE = 'CONNECTION_FAILURE';

/*
* Function connect - Save a connection object to the mongo DB.  This action is dispatched
*  after a connection email is sent between a mentor and mentee.  The initial status is pending
*  until the recipient responds to the connection request.
* @param {string} token - the authToken that allows API actions
* @param {string} details - an object containing the connection details...specifically
* { mentor: { id: '', name: '', avatar: ''},
*   mentee: { id: '', name: '', avatar: ''},
*   initiator: { id: '', name: '', },
*   originalPost: { id: '', title: '' },
*   status: '',
* }
*/
export function connect(token, details) {
  return {
    [CALL_API]: {
      endpoint: `${BASE_URL}/api/connections`,
      method: 'POST',
      types: [CONNECTION_REQUEST, CONNECTION_SUCCESS, CONNECTION_FAILURE],
      headers: { Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json' },
      body: JSON.stringify(details),
    },
  };
}

/*
* Function getConnections - retrieve all connections where the user either a mentor or mentee.
* We just pass the token; backend extracts user `_id` from the JWT token after authentication.
* @param {string} token - the authToken that allows API actions
*/
export const GET_ALL_CONNECTIONS_REQUEST = 'GET_ALL_CONNECTIONS_REQUEST';
export const GET_ALL_CONNECTIONS_SUCCESS = 'GET_ALL_CONNECTIONS_SUCCESS';
export const GET_ALL_CONNECTIONS_FAILURE = 'GET_ALL_CONNECTIONS_FAILURE';

export function getConnections(token) {
  return {
    [CALL_API]: {
      endpoint: `${BASE_URL}/api/connections`,
      method: 'GET',
      types:
        [GET_ALL_CONNECTIONS_REQUEST, GET_ALL_CONNECTIONS_SUCCESS, GET_ALL_CONNECTIONS_FAILURE],
      headers: { Authorization: `Bearer ${token}` },
    },
  };
}

/*
* Function updateConnectionStatus
* @param {string} token - the authToken that allows API actions
* @param {string} update - a string representing the new status
*/
export const UPDATE_CONNECTION_STATUS_REQUEST = 'UPDATE_CONNECTION_STATUS_REQUEST';
export const UPDATE_CONNECTION_STATUS_SUCCESS = 'UPDATE_CONNECTION_STATUS_SUCCESS';
export const UPDATE_CONNECTION_STATUS_FAILURE = 'UPDATE_CONNECTION_STATUS_FAILURE';

export function updateConnectionStatus(token, update) {
  return {
    [CALL_API]: {
      endpoint: `${BASE_URL}/api/connections/`,
      method: 'PUT',
      types: [
        UPDATE_CONNECTION_STATUS_REQUEST,
        UPDATE_CONNECTION_STATUS_SUCCESS,
        UPDATE_CONNECTION_STATUS_FAILURE,
      ],
      headers: { Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    },
  };
}
