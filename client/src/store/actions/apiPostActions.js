import { CALL_API } from 'redux-api-middleware';
import { BASE_URL } from './apiConfig.js';

export const GET_POST_REQUEST = 'GET_POST_REQUEST';
export const GET_POST_SUCCESS = 'GET_POST_SUCCESS';
export const GET_POST_FAILURE = 'GET_POST_FAILURE';

export function getPost(token, userId, role) {
  return {
    [CALL_API]: {
      endpoint: `${BASE_URL}/api/posts?author=${userId}&role=${role}`,
      method: 'GET',
      types: [GET_POST_REQUEST, GET_POST_SUCCESS, GET_POST_FAILURE],
      headers: { Authorization: `Bearer ${token}` },
    },
  };
}

export const GET_USERPOSTS_REQUEST = 'GET_USERPOSTS_REQUEST';
export const GET_USERPOSTS_SUCCESS = 'GET_USERPOSTS_SUCCESS';
export const GET_USERPOSTS_FAILURE = 'GET_USERPOSTS_FAILURE';

export function getUserPosts(token, userId) {
  return {
    [CALL_API]: {
      endpoint: `${BASE_URL}/api/posts?author.id=${userId}&active=all`,
      method: 'GET',
      types: [GET_USERPOSTS_REQUEST, GET_USERPOSTS_SUCCESS, GET_USERPOSTS_FAILURE],
      headers: { Authorization: `Bearer ${token}` },
    },
  };
}

export const GET_ALL_POSTS_REQUEST = 'GET_ALL_POSTS_REQUEST';
export const GET_ALL_POSTS_SUCCESS = 'GET_ALL_POSTS_SUCCESS';
export const GET_ALL_POSTS_FAILURE = 'GET_ALL_POSTS_FAILURE';

export function getAllPosts(token) {
  return {
    [CALL_API]: {
      endpoint: `${BASE_URL}/api/posts/`,
      method: 'GET',
      types: [GET_ALL_POSTS_REQUEST, GET_ALL_POSTS_SUCCESS, GET_ALL_POSTS_FAILURE],
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
      endpoint: `${BASE_URL}/api/posts`,
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
      endpoint: `${BASE_URL}/api/posts/${postId}`,
      method: 'PUT',
      types: [MODIFY_POST_REQUEST, MODIFY_POST_SUCCESS, MODIFY_POST_FAILURE],
      headers: { Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  };
}

export const VIEW_POST_REQUEST = 'VIEW_POST_REQUEST';
export const VIEW_POST_SUCCESS = 'VIEW_POST_SUCCESS';
export const VIEW_POST_FAILURE = 'VIEW_POST_FAILURE';

export function viewPost(token, postId) {
  return {
    [CALL_API]: {
      endpoint: `${BASE_URL}/api/posts?id=${postId}`,
      method: 'GET',
      types: [VIEW_POST_REQUEST, VIEW_POST_SUCCESS, VIEW_POST_FAILURE],
      headers: { Authorization: `Bearer ${token}` },
    },
  };
}

export const DELETE_POST_REQUEST = 'DELETE_POST_REQUEST';
export const DELETE_POST_SUCCESS = 'DELETE_POST_SUCCESS';
export const DELETE_POST_FAILURE = 'DELETE_POST_FAILURE';

export function deletePost(token, postId) {
  return {
    [CALL_API]: {
      endpoint: `${BASE_URL}/api/posts/${postId}`,
      method: 'DELETE',
      types: [DELETE_POST_REQUEST, DELETE_POST_SUCCESS, DELETE_POST_FAILURE],
      headers: { Authorization: `Bearer ${token}` },
    },
  };
}

/*
* Function: incrementPostView - Sends a request to the server to increment the
*  counter for views on a post.
* @param {string} token - the JWT authToken
* @param {string} postId - the post ID to be incremented
* This action dispatches additional actions as it executes:
*   INCREMENT_POSTVIEW_REQUEST: Does nothing - we don't initiate a spinner
*    because this is not a blocking operation.
*   INCREMENT_POSTVIEW_SUCCESS: The server does not return on object on success.  If client receives
*    the success action, it will increment its local viewcounter for the post.
*   INCREMENT_POSTVIEW_FAILURE: Initial implementation: ignore failures.
*/
export const INCREMENT_POSTVIEW_REQUEST = 'INCREMENT_POSTVIEW_REQUEST';
export const INCREMENT_POSTVIEW_SUCCESS = 'INCREMENT_POSTVIEW_SUCCESS';
export const INCREMENT_POSTVIEW_FAILURE = 'INCREMENT_POSTVIEW_FAILURE';

export function incrementPostView(token, postId) {
  return {
    [CALL_API]: {
      endpoint: `${BASE_URL}/api/posts/${postId}/viewsplusplus`,
      method: 'PUT',
      types: [
        INCREMENT_POSTVIEW_REQUEST,
        {
          type: INCREMENT_POSTVIEW_SUCCESS,
          meta: { postId },
        },
        INCREMENT_POSTVIEW_FAILURE,
      ],
      headers: { Authorization: `Bearer ${token}` },
    },
  };
}

/*
* Function: likePost - Sends a request to the server for a user to 'like' a post
* @param {string} token - the JWT authToken
* @param {string} postId - the post ID to be liked
* This action dispatches additional actions as it executes:
*   LIKE_POST_REQUEST: Does nothing - we don't initiate a spinner
*    because this is not a blocking operation.
*   LIKE_POST_SUCCESS: The server does not return on object on success.  This action is handled
*    in 2 reducers.  The posts reducer increments the like counter on the individual post.  The
*    profiles reducer adds this post to the user's array of liked posts.
*   LIKE_POST_FAILURE: Initial implementation: ignore failures.
*/
export const LIKE_POST_REQUEST = 'LIKE_POST_REQUEST';
export const LIKE_POST_SUCCESS = 'LIKE_POST_SUCCESS';
export const LIKE_POST_FAILURE = 'LIKE_POST_FAILURE';

export function likePost(token, postId) {
  return {
    [CALL_API]: {
      endpoint: `${BASE_URL}/api/posts/${postId}/likes?action=plusplus`,
      method: 'PUT',
      types: [
        LIKE_POST_REQUEST,
        {
          type: LIKE_POST_SUCCESS,
          meta: { postId },
        },
        LIKE_POST_FAILURE,
      ],
      headers: { Authorization: `Bearer ${token}` },
    },
  };
}

/*
* Function: likePost - Sends a request to the server for a user to 'un-like' a post
* @param {string} token - the JWT authToken
* @param {string} postId - the post ID to be un-liked
* This action dispatches additional actions as it executes:
*   UNLIKE_POST_REQUEST: Does nothing - we don't initiate a spinner
*    because this is not a blocking operation.
*   UNLIKE_POST_SUCCESS: The server does not return on object on success.  This action is handled
*    in 2 reducers.  The posts reducer decrements the like counter on the individual post.  The
*    profiles reducer removes this post from the user's array of liked posts.
*   UNLIKE_POST_FAILURE: Initial implementation: ignore failures.
*/
export const UNLIKE_POST_REQUEST = 'UNLIKE_POST_REQUEST';
export const UNLIKE_POST_SUCCESS = 'UNLIKE_POST_SUCCESS';
export const UNLIKE_POST_FAILURE = 'UNLIKE_POST_FAILURE';

export function unlikePost(token, postId) {
  return {
    [CALL_API]: {
      endpoint: `${BASE_URL}/api/posts/${postId}/likes?action=minusminus`,
      method: 'PUT',
      types: [
        UNLIKE_POST_REQUEST,
        {
          type: UNLIKE_POST_SUCCESS,
          meta: { postId },
        },
        UNLIKE_POST_FAILURE,
      ],
      headers: { Authorization: `Bearer ${token}` },
    },
  };
}
