export const SET_VIEW_CONNECTION = 'SET_VIEW_CONNECTION';
export const CLEAR_VIEW_CONNECTION = 'CLEAR_VIEW_CONNECTION';
export const SET_CONNECTIONS_MODAL_CLASS = 'SET_CONNECTIONS_MODAL_CLASS';
export const SET_CONNECTIONS_MODAL_TEXT = 'SET_CONNECTIONS_MODAL_TEXT';

export function setViewConnection(conn) {
  return ({
    type: SET_VIEW_CONNECTION,
    payload: conn,
  });
}

export function clearViewConnection() {
  return ({
    type: CLEAR_VIEW_CONNECTION,
  });
}

export function setConnectionsModalText(text) {
  return ({
    type: SET_CONNECTIONS_MODAL_TEXT,
    payload: text,
  });
}

export function setConnectionsModalClass(css) {
  return ({
    type: SET_CONNECTIONS_MODAL_CLASS,
    payload: css,
  });
}
