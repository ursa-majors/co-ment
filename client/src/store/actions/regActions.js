export const SET_REG_ERROR = 'SET_REG_ERROR';

export function setRegError(msg) {
  return ({
    type: SET_REG_ERROR,
    payload: msg,
  });
}
