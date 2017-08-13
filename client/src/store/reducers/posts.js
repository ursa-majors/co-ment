import update from 'immutability-helper';
import { SET_POSTS, SAVE_POST, SET_CURRENT_POST, SET_EDIT_POST, SET_FORM_FIELD,
  ADD_KEYWORD, REMOVE_KEYWORD, SET_SEARCH_CRITERIA, CLEAR_SEARCH_CRITERIA,
  SHOW_VIEW_POST_SPINNER, HIDE_VIEW_POST_SPINNER, SET_MODAL_CLASS, SET_MODAL_TEXT } from '../actions/postActions';
import { GET_POST_REQUEST, GET_POST_SUCCESS, GET_POST_FAILURE,
  ADD_POST_REQUEST, ADD_POST_SUCCESS, ADD_POST_FAILURE,
  MODIFY_POST_REQUEST, MODIFY_POST_SUCCESS, MODIFY_POST_FAILURE,
  GET_ALL_POSTS_REQUEST, GET_ALL_POSTS_SUCCESS, GET_ALL_POSTS_FAILURE,
} from '../actions/apiActions';

const defaultForm = {
  title: '',
  role: 'mentor',
  keywords: [],
  keyword: '',
  content: '',
  hideErr: 'form__hidden',
  errMsg: '',
  update: false,
};

const INITIAL_STATE = {
  entries: [],
  postErrorMsg: '',
  currentPost: {
    active: '',
    author: '',
    author_id: '',
    availability: '',
    keywords: [],
    body: '',
    role: 'mentor',
    updated: Date.now(),
  },
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
  gettingAllPosts: false,
  gettingAllPostsErr: null,
  viewPostSpinnerClass: 'spinner__hide',
  viewPostModalClass: 'modal__hide',
  viewPostModalText: '',
};

function posts(state = INITIAL_STATE, action) {
  let error;
  switch (action.type) {
    case SHOW_VIEW_POST_SPINNER:
      return Object.assign({}, state, { viewPostSpinnerClass: 'spinner__show' });

    case HIDE_VIEW_POST_SPINNER:
      return Object.assign({}, state, { viewPostSpinnerClass: 'spinner__hide' });

    case SET_MODAL_CLASS:
      return Object.assign({}, state, { viewPostModalClass: action.payload });

    case SET_MODAL_TEXT:
      return Object.assign({}, state, { viewPostModalText: action.payload });

    case SET_POSTS:
      return Object.assign({}, state, { entries: action.payload });

    case SAVE_POST:
      return update(state, { entries: { $push: action.payload } });

    case SET_CURRENT_POST:
      return update(state, { currentPost: { $set: action.payload } });

    case SET_EDIT_POST:
      return update(
        state,
        {
          editForm: {
            title: { $set: action.payload.title },
            role: { $set: action.payload.role },
            keywords: { $set: action.payload.keywords },
            keyword: { $set: '' },
            content: { $set: action.payload.body },
            hideErr: { $set: 'form__hidden' },
            errMsg: { $set: '' },
            update: { $set: true },
          },
        },
      );

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
          searchPost: { $set: action.payload },
        },
      );

    case GET_POST_FAILURE:
      error = action.payload.data || { message: action.payload.message };
      return Object.assign({}, state, { gettingPost: false, getError: error, searchPost: null });

    case GET_ALL_POSTS_REQUEST:
      return Object.assign({}, state, { gettingAllPosts: true, gettingAllPostsErr: null });

    case GET_ALL_POSTS_SUCCESS:
      return update(
        state,
        {
          gettingAllPosts: { $set: false },
          gettingAllPostsErr: { $set: null },
          entries: { $set: action.payload },
        },
      );

    case GET_ALL_POSTS_FAILURE:
      error = action.payload.data || { message: action.payload.message };
      return Object.assign({}, state, { gettingAllPosts: false, gettingAllPostsErr: error });

    case ADD_POST_REQUEST:
      return Object.assign({}, state, { addingPost: true, addError: null });

    case ADD_POST_SUCCESS:
      return update(
        state,
        {
          addingPost: { $set: false },
          addError: { $set: null },
          editForm: { $set: defaultForm },
          currentPost: { $set: {} },
          entries: { $push: [action.payload] },
        },
      );

    case ADD_POST_FAILURE:
      error = action.payload.data || { message: action.payload.message };
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
              currentPost: { $set: {} },
              entries: { $splice: [[i, 1, action.payload.post]] },
            },
          );
        }
      }
      return state;

    case MODIFY_POST_FAILURE:
      error = action.payload.data || { message: action.payload.message };
      return Object.assign({}, state, { savingPost: false, saveError: error });

    case SET_SEARCH_CRITERIA:
    console.log(action)
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

    default:
      return state;
  }
}

export default posts;
