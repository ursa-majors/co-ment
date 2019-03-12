export const SET_VIEW_CONNECTION = 'SET_VIEW_CONNECTION'
export const CLEAR_VIEW_CONNECTION = 'CLEAR_VIEW_CONNECTION'
export const SET_CONNECTIONS_MODAL = 'SET_CONNECTIONS_MODAL'
export const SET_CONN_DETAILS_MODAL = 'SET_CONN_DETAILS_MODAL'
export const SET_CONN_MODAL = 'SET_CONN_MODAL'

export function setViewConnection (conn) {
  return ({
    type: SET_VIEW_CONNECTION,
    payload: conn
  })
}

export function clearViewConnection () {
  return ({
    type: CLEAR_VIEW_CONNECTION
  })
}

export function setConnectionsModal (options) {
  return ({
    type: SET_CONNECTIONS_MODAL,
    payload: options
  })
}

export function setConnDetailsModal (options) {
  return ({
    type: SET_CONN_DETAILS_MODAL,
    payload: options
  })
}

export function setConnModal (options) {
  return ({
    type: SET_CONN_MODAL,
    payload: options
  })
}
