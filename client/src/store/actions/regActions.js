export const SET_REG_ERROR = 'SET_REG_ERROR'
export const DISMISS_REG_MODAL = 'DISMISS_REG_MODAL'

export function setRegError (msg) {
  return ({
    type: SET_REG_ERROR,
    payload: msg
  })
}

export function dismissRegModal () {
  return ({
    type: DISMISS_REG_MODAL
  })
}
