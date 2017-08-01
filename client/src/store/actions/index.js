// placeholder file for actions
export const LOGIN = 'LOGIN';
export const SET_REG_USER = 'SET_REG_USER';
export const SET_REG_PWD = 'SET_REG_PWD';
export const SET_REG_CONF_PWD = 'SET_REG_CONF_PWD';
export const CLEAR_PWD = 'CLEAR_PWD';

export function login(token) {
  return ({
    type: LOGIN,
    payload: token,
  });
}

export function setRegUser(user) {
  return ({
    type: SET_REG_USER,
    payload: user,
  });
}

export function setRegPwd(password) {
  return ({
    type: SET_REG_PWD,
    payload: password,
  });
}

export function setRegConfPwd(password) {
  return ({
    type: SET_REG_CONF_PWD,
    payload: password,
  });
}

export function clearPwd() {
  return ({
    type: CLEAR_PWD,
  });
}
