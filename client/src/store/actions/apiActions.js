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


export const GET_PROFILE_REQUEST = 'GET_PROFILE_REQUEST';
export const GET_PROFILE_SUCCESS = 'GET_PROFILE_SUCCESS';
export const GET_PROFILE_FAILURE = 'GET_PROFILE_FAILURE';

export function getProfile(token, profileId) {
  return {
    [CALL_API]: {
      endpoint: `https://co-ment.glitch.me/api/profile/${profileId}`,
      method: 'GET',
      types: [GET_PROFILE_REQUEST, GET_PROFILE_SUCCESS, GET_PROFILE_FAILURE],
      headers: { Authorization: `Bearer ${token}` },
    },
  };
}

export const MODIFY_PROFILE_REQUEST = 'MODIFY_PROFILE_REQUEST';
export const MODIFY_PROFILE_SUCCESS = 'MODIFY_PROFILE_SUCCESS';
export const MODIFY_PROFILE_FAILURE = 'MODIFY_PROFILE_FAILURE';

export function modifyProfile(token, profileId, body) {
  console.log('136',body);
  return {
    [CALL_API]: {
      endpoint: `https://co-ment.glitch.me/api/profile/${profileId}`,
      method: 'PUT',
      types: [MODIFY_PROFILE_REQUEST, MODIFY_PROFILE_SUCCESS, MODIFY_PROFILE_FAILURE],
      headers: { Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  };
}

export const GITHUB_PROFILE_REQUEST = 'GITHUB_PROFILE_REQUEST';
export const GITHUB_PROFILE_SUCCESS = 'GITHUB_PROFILE_SUCCESS';
export const GITHUB_PROFILE_FAILURE = 'GITHUB_PROFILE_FAILURE';

export function githubProfile(username) {
  return {
    [CALL_API]: {
      endpoint: `https://api.github.com/users/${username}`,
      method: 'GET',
      types: [GITHUB_PROFILE_REQUEST, GITHUB_PROFILE_SUCCESS, GITHUB_PROFILE_FAILURE],
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'request',
      },
    },
  };
}
