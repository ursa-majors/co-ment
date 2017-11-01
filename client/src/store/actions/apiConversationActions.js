import { CALL_API } from 'redux-api-middleware';
import { BASE_URL } from './apiConfig.js';

/*
* Function getConversations - retrieve all conversations where the user is
* either a sender or recipient. We just pass the token; backend extracts
* user `_id` from the JWT token after authentication.
* @param {string} token - the authToken that allows API actions
*/

export const GET_ALL_CONVERSATIONS_REQUEST = 'GET_ALL_CONVERSATIONS_REQUEST';
export const GET_ALL_CONVERSATIONS_SUCCESS = 'GET_ALL_CONVERSATIONS_SUCCESS';
export const GET_ALL_CONVERSATIONS_FAILURE = 'GET_ALL_CONVERSATIONS_FAILURE';

export function getConversations(token) {
  return {
    [CALL_API]: {
      endpoint: `${BASE_URL}/api/conversations`,
      method: 'GET',
      types: [
        GET_ALL_CONVERSATIONS_REQUEST,
        GET_ALL_CONVERSATIONS_SUCCESS,
        GET_ALL_CONVERSATIONS_FAILURE,
      ],
      headers: { Authorization: `Bearer ${token}` },
    },
  };
}

export const VIEW_CONV_REQUEST = 'VIEW_CONV_REQUEST';
export const VIEW_CONV_SUCCESS = 'VIEW_CONV_SUCCESS';
export const VIEW_CONV_FAILURE = 'VIEW_CONV_FAILURE';

export function viewConv(token, convId) {
  return {
    [CALL_API]: {
      endpoint: `${BASE_URL}/api/conversations/${convId}`,
      method: 'GET',
      types: [VIEW_CONV_REQUEST, VIEW_CONV_SUCCESS, VIEW_CONV_FAILURE],
      headers: { Authorization: `Bearer ${token}` },
    },
  };
}


export const POST_MSG_REQUEST = 'POST_MSG_REQUEST';
export const POST_MSG_SUCCESS = 'POST_MSG_SUCCESS';
export const POST_MSG_FAILURE = 'POST_MSG_FAILURE';

export function postMessage(token, body) {
  return {
    [CALL_API]: {
      endpoint: `${BASE_URL}/api/messages`,
      method: 'POST',
      types: [POST_MSG_REQUEST, POST_MSG_SUCCESS, POST_MSG_FAILURE],
      headers: { Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  };
}

export const POST_CONV_REQUEST = 'POST_CONV_REQUEST';
export const POST_CONV_SUCCESS = 'POST_CONV_SUCCESS';
export const POST_CONV_FAILURE = 'POST_CONV_FAILURE';

export function postConversation(token, body) {
  return {
    [CALL_API]: {
      endpoint: `${BASE_URL}/api/conversations`,
      method: 'POST',
      types: [POST_CONV_REQUEST, POST_CONV_SUCCESS, POST_CONV_FAILURE],
      headers: { Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  };
}

