import { CALL_API } from 'redux-api-middleware';

export const VALIDATE_TOKEN_REQUEST = 'VALIDATE_TOKEN_REQUEST';
export const VALIDATE_TOKEN_SUCCESS = 'VALIDATE_TOKEN_SUCCESS';
export const VALIDATE_TOKEN_FAILURE = 'VALIDATE_TOKEN_FAILURE';

/*
* Function: validateToken - validates a token pulled from user's localStorage
*  by attempting to get the profile for the user ID stored locally.
* @param {string} token - the token from localStorage
* @param {string} profileId = the profileId from localStorage
* This action dispatches additional actions as it executes:
*   VALIDATE_TOKEN_REQUEST: Initiates a spinner on the home page.  Needed for
*     when the back end server has gone to sleep
*   VALIDATE_TOKEN_SUCCESS: Dispatched if the token was valid and the profile is returned.
*     This logs the user in, stores the token and sets the current user profile.
*   VALIDATE_TOKEN_FAILURE: Dispatched if the token was invalid.  Logs the user out,
*     and deletes the values saved in localStorage.
*/
export function validateToken(token, profileId) {
  return {
    [CALL_API]: {
      endpoint: `https://co-ment.glitch.me/api/profile/${profileId}`,
      method: 'GET',
      types: [
        VALIDATE_TOKEN_REQUEST,
        {
          type: VALIDATE_TOKEN_SUCCESS,
          meta: { token },
        },
        VALIDATE_TOKEN_FAILURE],
      headers: { Authorization: `Bearer ${token}` },
    },
  };
}

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

/*
* Function: login - Attempts to loign in with supplied ID/password.
*   returns a JWT if successful.
* @param {string} body - the userID/password entered by user
* This action dispatches additional actions as it executes:
*   LOGIN_REQUEST: Initiates a spinner on the login page.  Needed for
*     when the back end server has gone to sleep
*   LOGIN_SUCCESS: Dispatched if the credentials valid and the profile is returned.
*     This logs the user in, stores the token and sets the current user profile.
*   LOGIN_FAILURE: Dispatched if the credentials are invalid.
*     Displays error to user, prompt to try again or register.
*/
export function login(body) {
  return {
    [CALL_API]: {
      endpoint: 'https://co-ment.glitch.me/api/login',
      method: 'POST',
      types: [LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE],
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  };
}

export const REGISTRATION_REQUEST = 'REGISTRATION_REQUEST';
export const REGISTRATION_SUCCESS = 'REGISTRATION_SUCCESS';
export const REGISTRATION_FAILURE = 'REGISTRATION_FAILURE';

/*
* Function: login - Attempts to loign in with supplied ID/password.
*   returns a JWT if successful.
* @param {string} body - the userID/password entered by user
* This action dispatches additional actions as it executes:
*   REGISTRATION_REQUEST: Initiates a spinner on the login page.  Needed for
*     when the back end server has gone to sleep
*   REGISTRATION_SUCCESS: Dispatched if the credentials valid and the profile is returned.
*     This logs the user in, stores the token and sets the current user profile.
*   REGISTRATION_FAILURE: Dispatched if the credentials are invalid.
*     Displays error to user, prompt to try again or register.
*/
export function register(body) {
  return {
    [CALL_API]: {
      endpoint: 'https://co-ment.glitch.me/api/register',
      method: 'POST',
      types: [REGISTRATION_REQUEST, REGISTRATION_SUCCESS, REGISTRATION_FAILURE],
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  };
}

export const RESET_PW_REQUEST = 'RESET_PW_REQUEST';
export const RESET_PW_SUCCESS = 'RESET_PW_SUCCESS';
export const RESET_PW_FAILURE = 'RESET_PW_FAILURE';

/*
* Function: resetPassword
*/
export function resetPassword(body) {
  return {
    [CALL_API]: {
      endpoint: 'https://co-ment.glitch.me/api/resetpassword',
      method: 'POST',
      types: [RESET_PW_REQUEST, RESET_PW_SUCCESS, RESET_PW_FAILURE],
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  };
}

export const SEND_RESET_EMAIL_REQUEST = 'SEND_RESET_EMAIL_REQUEST';
export const SEND_RESET_EMAIL_SUCCESS = 'SEND_RESET_EMAIL_SUCCESS';
export const SEND_RESET_EMAIL_FAILURE = 'SEND_RESET_EMAIL_FAILURE';

/*
* Function: sendResetEmail
* @param {String} - the username to send the reset email to
*/
export function sendResetEmail(username) {
  return {
    [CALL_API]: {
      endpoint: 'https://co-ment.glitch.me/api/sendresetemail',
      method: 'POST',
      types: [
        SEND_RESET_EMAIL_REQUEST,
        {
          type: SEND_RESET_EMAIL_SUCCESS,
          meta: username,
        },
        SEND_RESET_EMAIL_FAILURE,
      ],
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(username),
    },
  };
}
