export const SET_VIEW_CONVERSATION = 'SET_VIEW_CONVERSATION';
export const CLEAR_VIEW_CONVERSATION = 'CLEAR_VIEW_CONVERSATION';
export const SET_CONVERSATIONS_MODAL = 'SET_CONVERSATIONS_MODAL';
export const SET_CONVERSATION_MODAL = 'SET_CONVERSATION_MODAL';
export const SET_CONV_DETAILS_MODAL = 'SET_CONV_DETAILS_MODAL';
export const SET_CONV_MODAL = 'SET_CONV_MODAL';
export const SET_MSG_VIEW = 'SET_MSG_VIEW';
export const CLEAR_CURRENT_CONV = 'CLEAR_CURRENT_CONV';
export const SET_CURRENT_CONV = 'SET_CURRENT_CONV';

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

export function setConversationModal(options) {
  return ({
    type: SET_CONVERSATION_MODAL,
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

export function setMessageView(view) {
  return ({
    type: SET_MSG_VIEW,
    payload: view,
  });
}

export function clearCurrentConv() {
  return ({
    type: CLEAR_CURRENT_CONV,
  });
}

export function setCurrentConv(conv) {
  return ({
    type: SET_CURRENT_CONV,
    payload: conv,
  });
}
