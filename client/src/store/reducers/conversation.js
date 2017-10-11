import update from 'immutability-helper';

import { SET_VIEW_CONVERSATION, CLEAR_VIEW_CONVERSATION, SET_CONVERSATIONS_MODAL, SET_CONV_DETAILS_MODAL, SET_CONVERSATION_MODAL,
  SET_CONV_MODAL, SET_MSG_VIEW, SET_CURRENT_CONV, CLEAR_CURRENT_CONV } from '../actions/conversationActions';

import { GET_ALL_CONVERSATIONS_REQUEST,
  GET_ALL_CONVERSATIONS_SUCCESS, GET_ALL_CONVERSATIONS_FAILURE,
  // GET_CONVERSATION_REQUEST, GET_CONVERSATION_SUCCESS, GET_CONVERSATION_FAILURE,
  VIEW_CONV_REQUEST, VIEW_CONV_SUCCESS, VIEW_CONV_FAILURE,
  } from '../actions/apiConversationActions';

const defaultConv = {
	_id: '',
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
    unread: '',
  }
};

const INITIAL_STATE = {
	totalMessages: 0,
  totalUnreads: 0,
  messageView: 'inbox',
  conversations_loading: false,
  conversations_error: null,
  // ConversationDetails state
  viewConversation: defaultConv,
  convDetailsSpinnerClass: 'spinner__hide',
  convDetailsModal: {
    title: '',
    text: '',
    type: '',
    class: 'modal__hide',
  },
  // Conversations state
  getConversationsSpinnerClass: 'spinner__hide',
  getConversationsModal: {
    class: 'modal__hide',
    text: '',
    type: '',
    title: '',
  },
  conversations: [],
  // Conversation state
  currentConv: defaultConv,
  viewConvSpinnerClass: 'spinner__hide',
  viewConvModal: {
    class: 'modal__hide',
    text: '',
    type: '',
    title: '',
  },
};

function conversation(state = INITIAL_STATE, action) {
  let error;
  let index;
  switch (action.type) {

    /*
    *  Called From: <ConversationDetails />
    *  Payload: A conversation object
    *  Purpose: Conversation Details are cleared when the component unmounts
    *  to prevent showing the previous details when a new conversation is
    *  selected. Also, if user is redirected to ConversationDetails from a
    *  deep link, the state will not have the conversation details. This
    *  function is used to set the detail view based on the url param once
    *  conversations have been loaded from server
    */
    case SET_VIEW_CONVERSATION:
      return Object.assign({}, state, { viewConversation: action.payload });

    /*
    *  Called From: <ConversationDetails />
    *  Purpose: Prevent flash of old content when user loads component
    */
    case CLEAR_VIEW_CONVERSATION:
      return Object.assign({}, state, { viewConversation: defaultConv });

    /*
    *  Called From: <ConversationDetails />
    *  Payload: Text to show in the modal
    *  Purpose: Set/Unset the text for the modal.
    */
    case SET_CONV_DETAILS_MODAL:
      return Object.assign({}, state, { convDetailsModal: action.payload });

		/*-----------------------------------------------------------------------*/

    /*
    *  Called From: <Conversations />
    *  Payload: None
    *  Purpose: When a getConversations() function is called, this sets the
    *  spinner CSS to indicate that an API call is in progress.
    */
    case GET_ALL_CONVERSATIONS_REQUEST:
      return Object.assign({}, state, {
      	getConversationsSpinnerClass: 'spinner__show'
        });

    /*
    *  Called From: <Conversations />
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
            getConversationsSpinnerClass: 'spinner__hide',
          },
        );
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
            title: 'MESSAGES',
          },
        },
      );

    /*
    *  Called From: <Conversations />
    *  Payload: An error message
    *  Purpose: Called when the API call fails. Set the state to display
    *  a message to user.
    */
    case GET_ALL_CONVERSATIONS_FAILURE:
      error = action.payload.response.message || 'An error occurred while fetching messages';
      return Object.assign(
        {},
        state,
        {
          getConversationsSpinnerClass: 'spinner__hide',
          getConversationsModal: {
            class: 'modal__show',
            text: error,
            type: 'modal__error',
            title: 'ERROR',
          },
        },
      );

  /*-----------------------------------------------------------------------*/

    /*
    *  Called From: <Conversations />
    *  Payload: CSS class to show/hide the modal
    *  Purpose: Called from the modal to dismiss the modal
    */
    case SET_CONVERSATION_MODAL:
      return Object.assign({}, state, { viewConvModal: action.payload });

    case SET_MSG_VIEW:
    	return Object.assign({}, state, { messageView: action.payload });

    case SET_CURRENT_CONV:
    const conv = { ...action.payload };
      return update(
        state,
        {
          currentConv: {
            _id: { $set: action.payload._id },
            subject: { $set: action.payload.subject },
            qtyMessages: { $set: action.payload.qtyMessages },
            qtyUnreads: { $set: action.payload.qtyUnreads },
            startDate: { $set: action.payload.startDate },
            participants: { $set: action.payload.participants },
            latestMessage: { $set: action.payload.latestMessage  },
          },
        },
      );

    case CLEAR_CURRENT_CONV:
      return Object.assign({}, state, { currentConv: defaultConv });


    /*
    *  Called From: <Conversation />
    *  Payload: None
    *  Purpose: When a viewConversation() function is called, this sets the
    *  spinner CSS to indicate that an API call is in progress.
    */
    case VIEW_CONV_REQUEST:
      return Object.assign({}, state, { viewConvSpinnerClass: 'spinner__show' });

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
          currentConv: action.payload,
        },
      );

    /*
    *  Called From: <Conversation />
    *  Payload: An error message
    *  Purpose: Called when the API call fails. Set the state to display
    *  a message to user.
    */
    case VIEW_CONV_FAILURE:
      error = action.payload.message || 'An error occurred';
      return Object.assign(
        {},
        state,
        {
          viewConvSpinnerClass: 'spinner__hide',
          viewConvModalClass: 'modal__show',
          viewConvModalType: 'modal__error',
          viewConvModalText: error,
          viewConvModalTitle: 'Error',
        },
      );

    default:
      return state;

	}
}

export default conversation;