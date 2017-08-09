import { CALL_API } from 'redux-api-middleware';

export const CONTACT_REQUEST = 'CONTACT_REQUEST';
export const CONTACT_SUCCESS = 'CONTACT_SUCCESS';
export const CONTACT_FAILURE = 'CONTACT_FAILURE';

export function contact(token, msg, recipient) {
  return {
    [CALL_API]: {
      endpoint: `https://co-ment.glitch.me/api/contact/${recipient}`,
      method: 'POST',
      types: [CONTACT_REQUEST, CONTACT_SUCCESS, CONTACT_FAILURE],
      headers: { Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json' },
      body: JSON.stringify(msg),
    },
  };
}

export const CONNECTION_REQUEST = 'CONNECTION_REQUEST';
export const CONNECTION_SUCCESS = 'CONNECTION_SUCCESS';
export const CONNECTION_FAILURE = 'CONNECTION_FAILURE';

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

export const GET_CONNECTION_REQUEST = 'GET_CONNECTION_REQUEST';
export const GET_CONNECTION_SUCCESS = 'GET_CONNECTION_SUCCESS';
export const GET_CONNECTION_FAILURE = 'GET_CONNECTION_FAILURE';

export function getConnections(token, id) {
  return {
    [CALL_API]: {
      endpoint: `https://co-ment.glitch.me/api/connections/${id}`,
      method: 'GET',
      types: [GET_CONNECTION_REQUEST, GET_CONNECTION_SUCCESS, GET_CONNECTION_FAILURE],
      headers: { Authorization: `Bearer ${token}` },
    },
  };
}

export const GET_POST_REQUEST = 'GET_POST_REQUEST';
export const GET_POST_SUCCESS = 'GET_POST_SUCCESS';
export const GET_POST_FAILURE = 'GET_POST_FAILURE';

export function getPost(token, postId) {
  return {
    [CALL_API]: {
      endpoint: `https://co-ment.glitch.me/api/post/${postId}`,
      method: 'GET',
      types: [GET_POST_REQUEST, GET_POST_SUCCESS, GET_POST_FAILURE],
      headers: { Authorization: `Bearer ${token}` },
    },
  };
}

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export function addPost(token, body) {
  return {
    [CALL_API]: {
      endpoint: 'https://co-ment.glitch.me/api/post',
      method: 'POST',
      types: [ADD_POST_REQUEST, ADD_POST_SUCCESS, ADD_POST_FAILURE],
      headers: { Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  };
}

export const MODIFY_POST_REQUEST = 'MODIFY_POST_REQUEST';
export const MODIFY_POST_SUCCESS = 'MODIFY_POST_SUCCESS';
export const MODIFY_POST_FAILURE = 'MODIFY_POST_FAILURE';

export function modifyPost(token, postId, body) {
  return {
    [CALL_API]: {
      endpoint: `https://co-ment.glitch.me/api/posts/${postId}`,
      method: 'PUT',
      types: [MODIFY_POST_REQUEST, MODIFY_POST_SUCCESS, MODIFY_POST_FAILURE],
      headers: { Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  };
}
