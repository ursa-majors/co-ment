import { CALL_API } from 'redux-api-middleware';

export const GET_POST_REQUEST = 'GET_POST_REQUEST';
export const GET_POST_SUCCESS = 'GET_POST_SUCCESS';
export const GET_POST_FAILURE = 'GET_POST_FAILURE';

export function getPost(token, userId, role) {
  return {
    [CALL_API]: {
      endpoint: `https://co-ment.glitch.me/api/posts&author_id=${userId}&role=${role}`,
      method: 'GET',
      types: [GET_POST_REQUEST, GET_POST_SUCCESS, GET_POST_FAILURE],
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
      endpoint: 'https://co-ment.glitch.me/api/posts/',
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
      endpoint: 'https://co-ment.glitch.me/api/posts',
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

export const VIEW_POST_REQUEST = 'VIEW_POST_REQUEST';
export const VIEW_POST_SUCCESS = 'VIEW_POST_SUCCESS';
export const VIEW_POST_FAILURE = 'VIEW_POST_FAILURE';

export function viewPost(token, postId) {
  return {
    [CALL_API]: {
      endpoint: `https://co-ment.glitch.me/api/posts?id=${postId}`,
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
      endpoint: `https://co-ment.glitch.me/api/posts/${postId}`,
      method: 'DELETE',
      types: [DELETE_POST_REQUEST, DELETE_POST_SUCCESS, DELETE_POST_FAILURE],
      headers: { Authorization: `Bearer ${token}` },
    },
  };
}

export const INCREMENT_POSTVIEW_REQUEST = 'INCREMENT_POSTVIEW_REQUEST';
export const INCREMENT_POSTVIEW_SUCCESS = 'INCREMENT_POSTVIEW_SUCCESS';
export const INCREMENT_POSTVIEW_FAILURE = 'INCREMENT_POSTVIEW_FAILURE';

export function incrementPostView(token, postId) {
  return {
    [CALL_API]: {
      endpoint: `https://co-ment.glitch.me/api/posts/${postId}/viewsplusplus`,
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

export const LIKE_POST_REQUEST = 'LIKE_POST_REQUEST';
export const LIKE_POST_SUCCESS = 'LIKE_POST_SUCCESS';
export const LIKE_POST_FAILURE = 'LIKE_POST_FAILURE';

export function likePost(token, postId) {
  return {
    [CALL_API]: {
      endpoint: `https://co-ment.glitch.me/api/posts/${postId}/likesplusplus`,
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

export const UNLIKE_POST_REQUEST = 'UNLIKE_POST_REQUEST';
export const UNLIKE_POST_SUCCESS = 'UNLIKE_POST_SUCCESS';
export const UNLIKE_POST_FAILURE = 'UNLIKE_POST_FAILURE';

export function unlikePost(token, postId) {
  return {
    [CALL_API]: {
      endpoint: `https://co-ment.glitch.me/api/posts/${postId}/likesminusminus`,
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
