export const SET_VIEW_CONNECTION = 'SET_VIEW_CONNECTION';
export const CLEAR_VIEW_CONNECTION = 'CLEAR_VIEW_CONNECTION';

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
