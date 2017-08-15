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
