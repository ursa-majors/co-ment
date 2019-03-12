import update from 'immutability-helper'

import { SET_VIEW_CONVERSATION, CLEAR_VIEW_CONVERSATION, SET_CONVERSATIONS_MODAL, SET_CONVERSATION_MODAL, SET_CURRENT_CONV, CLEAR_CURRENT_CONV, SET_MSG_BODY, CLEAR_MSG_BODY, SET_MSG_MODAL, SET_NEW_CONV_MODAL } from '../actions/conversationActions'

import { GET_ALL_CONVERSATIONS_REQUEST,
  GET_ALL_CONVERSATIONS_SUCCESS, GET_ALL_CONVERSATIONS_FAILURE,
  VIEW_CONV_REQUEST, VIEW_CONV_SUCCESS, VIEW_CONV_FAILURE, POST_MSG_REQUEST,
  POST_MSG_SUCCESS, POST_MSG_FAILURE, POST_CONV_REQUEST, POST_CONV_SUCCESS, POST_CONV_FAILURE
} from '../actions/apiConversationActions'

const defaultConv = {
  _id: undefined,
  subject: '',
  qtyMessages: 0,
  qtyUnreads: 0,
  startDate: '',
  participants: [],
  latestMessage: {
    _id: '',
    updatedAt: '',
    createdAt: '',
    body: '',
    author: '',
    recipient: '',
    unread: ''
  }
}

const INITIAL_STATE = {
  totalMessages: 0,
  totalUnreads: 0,
  // Conversations state
  getConversationsSpinnerClass: 'spinner__hide',
  getConversationsModal: {
    class: 'modal__hide',
    text: '',
    type: '',
    title: ''
  },
  conversations_loading: false,
  conversations_error: null,
  conversations: [],
  // Current Conversation state
  viewConvSpinnerClass: 'spinner__hide',
  viewConvModal: {
    class: 'modal__hide',
    text: '',
    type: '',
    title: ''
  },
  currentConv_loading: false,
  currentConv_error: null,
  currentConv: defaultConv,
  // New Message state
  newMsgBody: '',
  newMsgSpinnerClass: 'spinner__hide',
  newMsgModal: {
    class: 'modal__hide',
    text: '',
    type: '',
    title: ''
  },
  newMsg_loading: false,
  newMsg_error: null,
  // New Conversation state
  newConvBody: '',
  newConvSpinnerClass: 'spinner__hide',
  newConvModal: {
    class: 'modal__hide',
    text: '',
    type: '',
    title: ''
  },
  newConv_loading: false,
  newConv_error: null
}

function conversation (state = INITIAL_STATE, action) {
  let error
  // let index;
  switch (action.type) {
    /*
    *  Called From: <Conversation />
    *  Payload: A conversation object
    *  Purpose: Conversation Details are cleared when the component unmounts
    *  to prevent showing the previous details when a new conversation is
    *  selected. Also, if user is redirected to ConversationDetails from a
    *  deep link, the state will not have the conversation details. This
    *  function is used to set the detail view based on the url param once
    *  conversations have been loaded from server
    */
    case SET_VIEW_CONVERSATION:
      return Object.assign({}, state, { viewConversation: action.payload })

    /*
    *  Called From: <Conversation />
    *  Purpose: Prevent flash of old content when user loads component
    */
    case CLEAR_VIEW_CONVERSATION:
      return Object.assign({}, state, { viewConversation: defaultConv })

      /* ----------------------------------------------------------------------- */

    /*
    *  Called From: <Conversations />
    *  Payload: None
    *  Purpose: When a getConversations() function is called, this sets the
    *  spinner CSS to indicate that an API call is in progress.
    */
    case GET_ALL_CONVERSATIONS_REQUEST:
      return Object.assign({}, state, {
        getConversationsSpinnerClass: 'spinner__show'
      })

    /*
    *  Called From: <Conversations /> and <HeaderNav />
    *  Payload: An array of conversation objects
    *  Purpose: Called when the API call succeeds. Populate the conversation
    *  list for a user.
    *  It's possible for the call to succeed, but not return any conversations
    *  (if the user doesn't have any).  For this case, we set the state to
    *  display a message to user.
    */
    case GET_ALL_CONVERSATIONS_SUCCESS:
      if (action.payload.conversations.length > 0) {
        return Object.assign(
          {},
          state,
          {
            conversations: action.payload.conversations,
            totalMessages: action.payload.totalMessages,
            totalUnreads: action.payload.totalUnreads,
            getConversationsSpinnerClass: 'spinner__hide'
          }
        )
      }
      return Object.assign(
        {},
        state,
        {
          getConversationsSpinnerClass: 'spinner__hide',
          getConversationsModal: {
            class: 'modal__show',
            text: 'No messages',
            type: 'modal__info',
            title: 'MESSAGES'
          }
        }
      )

    /*
    *  Called From: <Conversations /> and <HeaderNav />
    *  Payload: An error message
    *  Purpose: Called when the API call fails. Set the state to display
    *  a message to user.
    */
    case GET_ALL_CONVERSATIONS_FAILURE:
      error = `An error occurred while fetching messages`
      return Object.assign(
        {},
        state,
        {
          getConversationsSpinnerClass: 'spinner__hide',
          getConversationsModal: {
            class: 'modal__show',
            text: error,
            type: 'modal__error',
            title: 'ERROR'
          }
        }
      )

      /* ----------------------------------------------------------------------- */

    /*
    *  Called From: <Conversations /> and <HeaderNav />
    *  Payload: CSS class to show/hide the modal
    *  Purpose: Called from the modal to dismiss the modal
    */
    case SET_CONVERSATIONS_MODAL:
      return Object.assign({}, state, { getConversationsModal: action.payload })

    case SET_CURRENT_CONV:
      return update(
        state,
        {
          currentConv: { $set: action.payload }
        }
      )

    case CLEAR_CURRENT_CONV:
      return Object.assign({}, state, { currentConv: defaultConv })

    /*
    *  Called From: <Conversation />
    *  Payload: None
    *  Purpose: When a viewConversation() function is called, this sets the
    *  spinner CSS to indicate that an API call is in progress.
    */
    case VIEW_CONV_REQUEST:
      return Object.assign({}, state, { viewConvSpinnerClass: 'spinner__show' })

    /*
    *  Called From: <Conversation />
    *  Payload: A conversation object
    *  Purpose: Called when the API call succeeds. Populate the currentConv
    *  object.
    */
    case VIEW_CONV_SUCCESS:
      return Object.assign(
        {},
        state,
        {
          viewConvSpinnerClass: 'spinner__hide',
          currentConv: action.payload
        }
      )

    /*
    *  Called From: <Conversation />
    *  Payload: An error message
    *  Purpose: Called when the API call fails. Set the state to display
    *  a message to user.
    */
    case VIEW_CONV_FAILURE:
      error = 'An error occurred while fetching messages'
      return Object.assign(
        {},
        state,
        {
          viewConvSpinnerClass: 'spinner__hide',
          viewConvModal: {
            class: 'modal__show',
            type: 'modal__error',
            text: error,
            title: 'Error'
          }
        }
      )

    case SET_CONVERSATION_MODAL:
      return Object.assign({}, state, { viewConvModal: action.payload })

    /*
    *  Called From: <NewMessage />
    *  Payload: None
    *  Purpose: When a postMessage() function is called, this sets the
    *  spinner CSS to indicate that an API call is in progress.
    */
    case POST_MSG_REQUEST:
      return Object.assign({}, state, { newMsgSpinnerClass: 'spinner__show' })

    /*
    *  Called From: <NewMessage />
    *  Payload: A message object
    *  Purpose: Called when the API call succeeds. Push new message to end
    *  of current conversation
    */
    case POST_MSG_SUCCESS:
      return update(
        state,
        {
          newMsgSpinnerClass: { $set: 'spinner__hide' },
          currentConv: {
            messages: {
              $push: [action.payload.message] }
          }
        }
      )

    /*
    *  Called From: <NewMessage />
    *  Payload: An error message
    *  Purpose: Called when the API call fails. Set the state to display
    *  a message to user.
    */
    case POST_MSG_FAILURE:
      error = `An error occurred while posting your message`
      return Object.assign(
        {},
        state,
        {
          newMsgSpinnerClass: 'spinner__hide',
          newMsgModal: {
            class: 'modal__show',
            type: 'modal__error',
            text: error,
            title: 'Error'
          }
        }
      )

    /*
    *  Called From: <NewMessage />
    *  Payload: Message body
    *  Purpose: Update form field with user input
    */
    case SET_MSG_BODY:
      return Object.assign(
        {},
        state,
        {
          newMsgBody: action.payload
        }
      )

    /*
    *  Called From: <NewMessage />
    *  Payload: none
    *  Purpose: Clear form field when component unmounts
    */
    case CLEAR_MSG_BODY:
      return Object.assign(
        {},
        state,
        {
          newMsgBody: ''
        }
      )

    case SET_MSG_MODAL:
      return Object.assign({}, state, { newMsgModal: action.payload })

    /*
    *  Called From: <ConnectionEmail />
    *  Payload: None
    *  Purpose: When a postConversation() function is called, this sets the
    *  spinner CSS to indicate that an API call is in progress.
    */
    case POST_CONV_REQUEST:
      return Object.assign({}, state, { newConvSpinnerClass: 'spinner__show' })

    /*
    *  Called From: <ConnectionEmail />
    *  Payload: Success message and Conversation object
    *  Purpose: Hide spinner, populate 'CurrentConv' object
    *  with new conversation for redirect to inbox
    */
    case POST_CONV_SUCCESS:
      return update(
        state,
        {
          newConvSpinnerClass: { $set: 'spinner__hide' },
          currentConv: { $set: action.payload.conversation }
        }
      )

    /*
    *  Called From: <ConnectionEmail />
    *  Payload: An error message
    *  Purpose: Called when the API call fails. Set the state to display
    *  a message to user.
    */
    case POST_CONV_FAILURE:
      error = `An error occurred while saving your message`
      return Object.assign(
        {},
        state,
        {
          newConvSpinnerClass: 'spinner__hide',
          newConvModal: {
            class: 'modal__show',
            type: 'modal__error',
            text: error,
            title: 'Error'
          }
        }
      )

      /*
    *  Called From: <ConnectionEmail />
    *  Payload: Modal options
    *  Purpose: Display modal
    */

    case SET_NEW_CONV_MODAL:
      return Object.assign({}, state, { newConvModal: action.payload })

    default:
      return state
  }
}

export default conversation
