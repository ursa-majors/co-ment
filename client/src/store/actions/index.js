export const LOGIN = 'LOGIN';
export const SET_REG_USER = 'SET_REG_USER';
export const SET_REG_PWD = 'SET_REG_PWD';
export const SET_REG_CONF_PWD = 'SET_REG_CONF_PWD';
export const CLEAR_PWD = 'CLEAR_PWD';
export const SET_REG_ERROR = 'SET_REG_ERROR';
export const LOGOUT = 'LOGOUT';
export const SET_LOGIN_USER = 'SET_LOGIN_USER';
export const SET_LOGIN_PWD = 'SET_LOGIN_PWD';
export const SET_LOGIN_ERROR = 'SET_LOGIN_ERROR';
export const CLEAR_LOGIN_PWD = 'CLEAR_LOGIN_PWD';

export function login(token, profile) {
  return ({
    type: LOGIN,
    token,
    profile,
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

export function setRegError(msg) {
  return ({
    type: SET_REG_ERROR,
    payload: msg,
  });
}

export function logout() {
  return ({
    type: LOGOUT,
  });
}

export function setLoginUser(user) {
  return ({
    type: SET_LOGIN_USER,
    payload: user,
  });
}

export function setLoginPwd(pw) {
  return ({
    type: SET_LOGIN_PWD,
    payload: pw,
  });
}

export function setLoginError(msg) {
  return ({
    type: SET_LOGIN_ERROR,
    payload: msg,
  });
}

export function clearLoginPwd() {
  return ({
    type: CLEAR_LOGIN_PWD,
  });
}
