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
