import { CALL_API } from 'redux-api-middleware';

export const CONNECTION_REQUEST = 'CONNECTION_REQUEST';
export const CONNECTION_SUCCESS = 'CONNECTION_SUCCESS';
export const CONNECTION_FAILURE = 'CONNECTION_FAILURE';

/*
* Function connect - Save a connection object to the mongo DB.  This action is dispatched
*  after a connection email is sent between a mentor and mentee.  The initial status is pending
*  until the recipient responds to the connection request.
* @param {string} token - the authToken that allows API actions
* @param {string} details - an object containing the connection details...specifically
* { mentor: '',
*   mentee: '',
*   mentorName: '',
*   menteeName: '',
*   initiator: '',
*   status: '',
* }
*/
export function connect(token, details) {
  return {
    [CALL_API]: {
      endpoint: 'https://co-ment.glitch.me/api/connect',
      method: 'POST',
      types: [CONNECTION_REQUEST, CONNECTION_SUCCESS, CONNECTION_FAILURE],
      headers: { Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json' },
      body: JSON.stringify(details),
    },
  };
}

/*
* Function getConnections - retrieve all connections where the given ID is either mentor or mentee
* @param {string} token - the authToken that allows API actions
* @param {string} id - a string representing the user ID
*/
export const GET_ALL_CONNECTIONS_REQUEST = 'GET_ALL_CONNECTIONS_REQUEST';
export const GET_ALL_CONNECTIONS_SUCCESS = 'GET_ALL_CONNECTIONS_SUCCESS';
export const GET_ALL_CONNECTIONS_FAILURE = 'GET_ALL_CONNECTIONS_FAILURE';

export function getConnections(token, id) {
  return {
    [CALL_API]: {
      endpoint: `https://co-ment.glitch.me/api/connections/${id}`,
      method: 'GET',
      types:
        [GET_ALL_CONNECTIONS_REQUEST, GET_ALL_CONNECTIONS_SUCCESS, GET_ALL_CONNECTIONS_FAILURE],
      headers: { Authorization: `Bearer ${token}` },
    },
  };
}