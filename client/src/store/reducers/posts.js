import update from 'immutability-helper';
import { SET_POSTS, SAVE_POST, CLEAR_CURRENT_POST, SET_EDIT_POST, SET_FORM_FIELD, ADD_KEYWORD,
  REMOVE_KEYWORD, SET_SEARCH_CRITERIA, CLEAR_SEARCH_CRITERIA, SET_VIEWPOST_MODAL, RESET_FORM,
  SET_LOADPOSTS_MODAL, SET_CURRENT_POST } from '../actions/postActions';
import { GET_POST_REQUEST, GET_POST_SUCCESS, GET_POST_FAILURE, ADD_POST_REQUEST, ADD_POST_SUCCESS,
  ADD_POST_FAILURE, MODIFY_POST_REQUEST, MODIFY_POST_SUCCESS, MODIFY_POST_FAILURE,
  GET_ALL_POSTS_REQUEST, GET_ALL_POSTS_SUCCESS, GET_ALL_POSTS_FAILURE, GET_USERPOSTS_REQUEST,
  GET_USERPOSTS_SUCCESS, GET_USERPOSTS_FAILURE, VIEW_POST_REQUEST, VIEW_POST_SUCCESS,
  VIEW_POST_FAILURE, DELETE_POST_REQUEST, DELETE_POST_SUCCESS, DELETE_POST_FAILURE,
  INCREMENT_POSTVIEW_REQUEST, INCREMENT_POSTVIEW_SUCCESS, INCREMENT_POSTVIEW_FAILURE,
  LIKE_POST_REQUEST, LIKE_POST_SUCCESS, LIKE_POST_FAILURE, UNLIKE_POST_REQUEST, UNLIKE_POST_SUCCESS,
  UNLIKE_POST_FAILURE,
} from '../actions/apiPostActions';

const defaultForm = {
  active: 'true',
  title: '',
  role: 'mentor',
  keywords: [],
  keyword: '',
  content: '',
  hideErr: 'hidden',
  errMsg: '',
  update: false,
};
const defaultPost = {
  active: '',
  author: {
    _id: '',
    username: '',
    name: '',
    avatarUrl: '',
    time_zone: '',
    languages: [],
    gender: '',
  },
  availability: '',
  keywords: [],
  body: '',
  excerpt: '',
  role: 'mentor',
  updated: Date.now(),
};
const INITIAL_STATE = {
  entries: [],
  postErrorMsg: '',
  currentPost: defaultPost,
  searchCriteria: {
    role: '',
    title: '',
    author: '',
    keywords: '',
  },
  gettingPost: false,
  getError: null,
  searchPost: null,
  editForm: defaultForm,
  addingPost: false,
  addError: null,
  savingPost: false,
  saveError: null,
  loadPostsSpinnerClass: 'spinner_hide',
  loadPostsModal: {
    class: 'modal__hide',
    text: '',
    title: '',
    type: '',
  },
  loadPostsError: '',
  viewPostSpinnerClass: 'spinner__hide',
  viewPostModal: {
    class: 'modal__hide',
    text: '',
    type: '',
    title: '',
  },
  deletePostSpinnerClass: 'spinner__hide',
  deletePostModalClass: 'modal__hide',
  deletePostModalText: '',
};

function posts(state = INITIAL_STATE, action) {
  let error;
  let index;
  switch (action.type) {

    case SET_VIEWPOST_MODAL:
      return Object.assign(
        {},
        state,
        {
          viewPostModal: action.payload,
        },
      );

    case SET_POSTS:
      return Object.assign({}, state, { entries: action.payload });

    case SAVE_POST:
      return update(state, { entries: { $push: action.payload } });

    case SET_CURRENT_POST:
      return Object.assign({}, state, { currentPost: action.payload });

    case CLEAR_CURRENT_POST:
      return Object.assign({}, state, { currentPost: defaultPost, editForm: defaultForm });

    case SET_EDIT_POST:
      return update(
        state,
        {
          editForm: {
            title: { $set: action.payload.title },
            role: { $set: action.payload.role },
            active: { $set: action.payload.active },
            keywords: { $set: action.payload.keywords },
            keyword: { $set: '' },
            content: { $set: action.payload.body },
            hideErr: { $set: 'hidden' },
            errMsg: { $set: '' },
            update: { $set: true },
          },
        },
      );

    case RESET_FORM:
      return Object.assign({}, state, { editForm: defaultForm });

    case SET_FORM_FIELD:
      return update(state, { editForm: { [action.field]: { $set: action.value } } });

    case ADD_KEYWORD:
      return update(
        state,
        {
          editForm: {
            keywords: { $push: [action.payload] },
            keyword: { $set: '' },
          },
        });

    case REMOVE_KEYWORD:
      return update(state, { editForm: { keywords: { $splice: [[action.payload, 1]] } } });

    case GET_POST_REQUEST:
      return Object.assign(
        {},
        state,
        { gettingPost: true, postError: null, searchPost: null },
      );

    case GET_POST_SUCCESS:
      return update(
        state,
        {
          gettingPost: { $set: false },
          getError: { $set: null },
          searchPost: { $set: action.payload[0] },
        },
      );

    case GET_POST_FAILURE:
      error = action.payload.data || { message: action.payload.message };
      return Object.assign({}, state, { gettingPost: false, getError: error, searchPost: null });

    case GET_ALL_POSTS_REQUEST:
      return Object.assign(
        {},
        state,
        {
          loadPostsSpinnerClass: 'spinner__show',
          loadPostsModal: {
            text: '',
            class: 'modal__hide',
            type: '',
            title: '',
          },
        },
      );

    case GET_ALL_POSTS_SUCCESS:
      return update(
        state,
        {
          loadPostsSpinnerClass: { $set: 'spinner__hide' },
          loadPostsError: { $set: null },
          entries: { $set: action.payload },
        },
      );

    case GET_ALL_POSTS_FAILURE:
      error = action.payload.response.message || 'An unknown error occurred while loading posts';
      return Object.assign(
        {},
        state,
        {
          loadPostsSpinnerClass: 'spinner__hide',
          loadPostsModal: {
            text: error,
            class: 'modal__show',
            type: 'modal__error',
            title: 'ERROR',
          },
        },
      );

    case GET_USERPOSTS_REQUEST:
      return Object.assign(
        {},
        state,
        {
          loadPostsSpinnerClass: 'spinner__show',
          loadPostsModal: {
            text: '',
            class: 'modal__hide',
            type: '',
            title: '',
          },
        },
      );

    case GET_USERPOSTS_SUCCESS:
      return update(
        state,
        {
          loadPostsSpinnerClass: { $set: 'spinner__hide' },
          loadPostsError: { $set: null },
          entries: { $set: action.payload },
        },
      );

    case GET_USERPOSTS_FAILURE:
      error = action.payload.response.message || 'An unknown error occurred while loading posts';
      return Object.assign(
        {},
        state,
        {
          loadPostsSpinnerClass: 'spinner__hide',
          loadPostsModal: {
            text: error,
            class: 'modal__show',
            type: 'modal__error',
            title: 'ERROR',
          },
        },
      );

    case SET_LOADPOSTS_MODAL:
      return Object.assign(
        {},
        state,
        {
          loadPostsModal: action.payload,
        },
      );

    case ADD_POST_REQUEST:
      console.log('add post request');
      return Object.assign({}, state, { addingPost: true, addError: null });

    case ADD_POST_SUCCESS:
      console.log('add post success');
      return update(
        state,
        {
          addingPost: { $set: false },
          addError: { $set: null },
          editForm: { $set: defaultForm },
          currentPost: { $set: defaultPost },
          entries: { $push: [action.payload.post] },
        },
      );

    case ADD_POST_FAILURE:
      console.log('add post failure');
      error = action.payload.message || 'An unknown error occurred';
      console.log(error);
      return Object.assign({}, state, { addingPost: false, addError: error });

    case MODIFY_POST_REQUEST:
      return Object.assign({}, state, { savingPost: true, saveError: null });

    case MODIFY_POST_SUCCESS:
      for (let i = 0; i < state.entries.length; i += 1) {
        if (state.entries[i]._id === action.payload.post._id) {
          return update(
            state,
            {
              savingPost: { $set: false },
              saveError: { $set: null },
              editForm: { $set: defaultForm },
              currentPost: { $set: defaultPost },
              entries: { $splice: [[i, 1, action.payload.post]] },
            },
          );
        }
      }
      return state;

    case MODIFY_POST_FAILURE:
      error = action.payload.data || { message: action.payload.message };
      return Object.assign({}, state, { savingPost: false, saveError: error });

    case VIEW_POST_REQUEST:
      return Object.assign({}, state, { viewPostSpinnerClass: 'spinner__show' });

    case VIEW_POST_SUCCESS:
      return Object.assign(
        {},
        state,
        {
          viewPostSpinnerClass: 'spinner__hide',
          currentPost: action.payload[0],
        },
      );

    case VIEW_POST_FAILURE:
      error = action.payload.message || 'An error occurred';
      return Object.assign(
        {},
        state,
        {
          viewPostSpinnerClass: 'spinner__hide',
          viewPostModalClass: 'modal__show',
          viewPostModalType: 'modal__error',
          viewPostModalText: error,
        },
      );

    case DELETE_POST_REQUEST:
      return Object.assign({}, state, { deletePostSpinnerClass: 'spinner__show' });

    case DELETE_POST_SUCCESS:
      for (let i = 0; i < state.entries.length; i += 1) {
        if (state.entries[i]._id === action.payload.post._id) {
          return update(
            state,
            {
              deletePostSpinnerClass: { $set: 'spinner__hide' },
              deletePostModalClass: { $set: 'modal__show' },
              deletePostModalText: { $set: 'Post Deleted!' },
              entries: { $splice: [[i, 1]] },
            },
          );
        }
      }
      break;

    case DELETE_POST_FAILURE:
      error = action.payload.response.message || 'An unknown error occurred';
      return Object.assign(
        {},
        state,
        {
          deletePostSpinnerClass: 'spinner__hide',
          deletePostModalClass: 'modal__show',
          deletePostModalText: error,
        },
      );

    case SET_SEARCH_CRITERIA:
      return update(state, { searchCriteria: { $set: action.payload } });

    case CLEAR_SEARCH_CRITERIA:
      return update(
        state,
        {
          searchCriteria: {
            role: { $set: '' },
            title: { $set: '' },
            author: { $set: '' },
            keywords: { $set: [] },
          },
        },
      );

    /*
    *  Called From: <PostFull />
    *  Payload: None
    *  Purpose: Dispatched when user clicks on a post to view it.  This action does
    *  nothing because we do not block operations when this request is dispatched.
    */
    case INCREMENT_POSTVIEW_REQUEST:
      return state;

    /*
    *  Called From: <PostFull />
    *  Payload: {string} Meta: PostId - the id of the post that was viewed.
    *  Purpose: This will increment the viewcounter on the local copy of the post.
    *   If post ID is not found, return previous state.
    */
    case INCREMENT_POSTVIEW_SUCCESS:
      for (let i = 0; i < state.entries.length; i += 1) {
        if (state.entries[i]._id === action.meta.postId) {
          index = i;
          break;
        }
      }
      return update(
        state,
        {
          entries: {
            [index]: {
              meta: {
                views: {
                  $apply: x => x + 1,
                },
              },
            },
          },
        },
      );

    case INCREMENT_POSTVIEW_FAILURE:
      return state;

    /*
    *  Called From: <PostFull />
    *  Payload: None
    *  Purpose: Dispatched when user clicks on a post to 'like' it.  This action does
    *  nothing because we do not block operations when this request is dispatched.
    */
    case LIKE_POST_REQUEST:
      return state;

    /*
    *  Called From: <PostFull />
    *  Payload: {string} Meta: PostId - the id of the post that was liked.
    *  Purpose: This will increment the like counter on the local copy of the post.
    *   If post ID is not found, return previous state.
    */
    case LIKE_POST_SUCCESS:
      for (let i = 0; i < state.entries.length; i += 1) {
        if (action.meta.postId === state.entries[i]._id) {
          index = i;
          return update(
            state,
            {
              entries: {
                [index]: {
                  meta: {
                    likes: {
                      $apply: x => x + 1,
                    },
                  },
                },
              },
            },
          );
        }
      }
      return state;

    case LIKE_POST_FAILURE:
      error = action.payload.response.message || 'An unknown error occurred';
      return Object.assign({}, state);

    /*
    *  Called From: <PostFull />
    *  Payload: None
    *  Purpose: Dispatched when user clicks on a post to 'un-like' it.  This action does
    *  nothing because we do not block operations when this request is dispatched.
    */
    case UNLIKE_POST_REQUEST:
      return state;

    /*
    *  Called From: <PostFull />
    *  Payload: {string} Meta: PostId - the id of the post that was un-liked.
    *  Purpose: This will decrement the like counter on the local copy of the post.
    *   If post ID is not found, return previous state.
    */
    case UNLIKE_POST_SUCCESS:
      for (let i = 0; i < state.entries.length; i += 1) {
        if (action.meta.postId === state.entries[i]._id) {
          index = i;
          return update(
            state,
            {
              entries: {
                [index]: {
                  meta: {
                    likes: {
                      $apply: x => x - 1,
                    },
                  },
                },
              },
            },
          );
        }
      }
      return state;

    case UNLIKE_POST_FAILURE:
      return state;

    default:
      return state;
  }
  return null;
}

export default posts;
