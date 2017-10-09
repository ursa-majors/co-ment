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
      types:
        [GET_ALL_CONVERSATIONS_REQUEST, GET_ALL_CONVERSATIONS_SUCCESS, GET_ALL_CONVERSATIONS_FAILURE],
      headers: { Authorization: `Bearer ${token}` },
    },
  };
}

export const GET_CONVERSATION_REQUEST = 'GET_CONVERSATION_REQUEST';
export const GET_CONVERSATION_SUCCESS = 'GET_CONVERSATION_SUCCESS';
export const GET_CONVERSATION_FAILURE = 'GET_CONVERSATION_FAILURE';

export function getConversation(token, conversationId) {
  return {
    [CALL_API]: {
      endpoint: `${BASE_URL}/api/conversations/${conversationId}`,
      method: 'GET',
      types: [GET_CONVERSATION_REQUEST, GET_CONVERSATION_SUCCESS, GET_CONVERSATION_FAILURE],
      headers: { Authorization: `Bearer ${token}` },
    },
  };
}