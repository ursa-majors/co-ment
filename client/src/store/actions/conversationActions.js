export const SET_VIEW_CONVERSATION = 'SET_VIEW_CONVERSATION';
export const CLEAR_VIEW_CONVERSATION = 'CLEAR_VIEW_CONVERSATION';
export const SET_CONVERSATIONS_MODAL = 'SET_CONVERSATIONS_MODAL';
export const SET_CONV_DETAILS_MODAL = 'SET_CONV_DETAILS_MODAL';
export const SET_CONV_MODAL = 'SET_CONV_MODAL';

export function setViewConversation(conv) {
  return ({
    type: SET_VIEW_CONVERSATION,
    payload: conv,
  });
}

export function clearViewConversation() {
  return ({
    type: CLEAR_VIEW_CONVERSATION,
  });
}

export function setConversationsModal(options) {
  return ({
    type: SET_CONVERSATIONS_MODAL,
    payload: options,
  });
}

export function setConvDetailsModal(options) {
  return ({
    type: SET_CONV_DETAILS_MODAL,
    payload: options,
  });
}

export function setConvModal(options) {
  return ({
    type: SET_CONV_MODAL,
    payload: options,
  });
}
