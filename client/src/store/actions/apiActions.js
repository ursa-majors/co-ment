import { CALL_API } from 'redux-api-middleware';

// ENVIRONMENT is a global variable defined by weback.config.js
// defaults to DEVELOPMENT
const BASE_URL = (ENVIRONMENT === 'PRODUCTION' ? 'https://co-ment.glitch.me' : 'https://co-ment-dev.glitch.me');

export const SEND_EMAIL_REQUEST = 'SEND_EMAIL_REQUEST';
export const SEND_EMAIL_SUCCESS = 'SEND_EMAIL_SUCCESS';
export const SEND_EMAIL_FAILURE = 'SEND_EMAIL_FAILURE';

export function sendEmail(token, mailOptions) {
  return {
    [CALL_API]: {
      endpoint: `${BASE_URL}/api/sendemail/`,
      method: 'POST',
      types: [SEND_EMAIL_REQUEST, SEND_EMAIL_SUCCESS, SEND_EMAIL_FAILURE],
      headers: { Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json' },
      body: JSON.stringify(mailOptions),
    },
  };
}


export const GET_PROFILE_REQUEST = 'GET_PROFILE_REQUEST';
export const GET_PROFILE_SUCCESS = 'GET_PROFILE_SUCCESS';
export const GET_PROFILE_FAILURE = 'GET_PROFILE_FAILURE';

export function getProfile(token, profileId) {
  return {
    [CALL_API]: {
      endpoint: `${BASE_URL}/api/profile/${profileId}`,
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
  return {
    [CALL_API]: {
      endpoint: `${BASE_URL}/api/profile/${profileId}`,
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

export const RESEND_ACCT_VALIDATION_REQUEST = 'RESEND_ACCT_VALIDATION_REQUEST';
export const RESEND_ACCT_VALIDATION_SUCCESS = 'RESEND_ACCT_VALIDATION_SUCCESS';
export const RESEND_ACCT_VALIDATION_FAILURE = 'RESEND_ACCT_VALIDATION_FAILURE';

export function resendAcctValidation(token) {
  return {
    [CALL_API]: {
      endpoint: `${BASE_URL}/api/resendvalidation`,
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      types: [
        RESEND_ACCT_VALIDATION_REQUEST,
        RESEND_ACCT_VALIDATION_SUCCESS,
        RESEND_ACCT_VALIDATION_FAILURE,
      ],
    },
  };
}
