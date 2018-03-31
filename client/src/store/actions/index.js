export const LOGOUT = 'LOGOUT';
export const SET_LOGIN_USER = 'SET_LOGIN_USER';
export const SET_LOGIN_PWD = 'SET_LOGIN_PWD';
export const SET_LOGIN_ERROR = 'SET_LOGIN_ERROR';
export const CLEAR_LOGIN_PWD = 'CLEAR_LOGIN_PWD';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';
export const SET_PROFILE_VIEW = 'SET_PROFILE_VIEW';
export const SET_REDIRECT_URL = 'SET_REDIRECT_URL';
export const DISMISS_PWRESET_MODAL = 'DISMISS_PWRESET_MODAL';
export const DISMISS_LOGIN_MODAL = 'DISMISS_LOGIN_MODAL';
export const SET_WINDOW_SIZE = 'SET_WINDOW_SIZE';
export const SET_MENU_STATE = 'SET_MENU_STATE';
export const SET_ADMIN_MENU_STATE = 'SET_ADMIN_MENU_STATE';
export const SET_MENU_BACKGROUND = 'SET_MENU_BACKGROUND';
export const SET_CONTROLS_BACKGROUND = 'SET_CONTROLS_BACKGROUND';
export const SET_SCROLLED = 'SET_SCROLLED';

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

export function setRedirectUrl(url) {
  return ({
    type: SET_REDIRECT_URL,
    payload: url,
  });
}

export function dismissPWResetModal() {
  return ({
    type: DISMISS_PWRESET_MODAL,
  });
}

export function dismissLoginModal() {
  return ({
    type: DISMISS_LOGIN_MODAL,
  });
}

export function setWindowSize(size) {
  return ({
    type: SET_WINDOW_SIZE,
    payload: size,
  });
}

export function setMenuBackground(bg) {
  return ({
    type: SET_MENU_BACKGROUND,
    payload: bg,
  });
}

export function setControlsBackground(bg) {
  return ({
    type: SET_CONTROLS_BACKGROUND,
    payload: bg,
  });
}

export function setMenuState(menu) {
  return ({
    type: SET_MENU_STATE,
    payload: menu,
  });
}

export function setAdminMenuState(menu) {
  return ({
    type: SET_ADMIN_MENU_STATE,
    payload: menu,
  });
}

export function setScrolled(bool, scrollPosition) {
  return ({
    type: SET_SCROLLED,
    payload: {
      windowScrolled: bool,
      scrollPosition,
    },
  });
}
