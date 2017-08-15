export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const SET_LOGIN_USER = 'SET_LOGIN_USER';
export const SET_LOGIN_PWD = 'SET_LOGIN_PWD';
export const SET_LOGIN_ERROR = 'SET_LOGIN_ERROR';
export const CLEAR_LOGIN_PWD = 'CLEAR_LOGIN_PWD';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';
export const SET_PROFILE_VIEW = 'SET_PROFILE_VIEW';

export function login(token, profile) {
  return ({
    type: LOGIN,
    token,
    profile,
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
