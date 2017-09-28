import update from 'immutability-helper';
import { SET_EDIT_PROFILE, SET_PROFILE_FORM_FIELD, ADD_LANGUAGE, ADD_SKILL, REMOVE_LANGUAGE,
  REMOVE_SKILL, DISMISS_VIEWPROFILE_MODAL, SET_PROFILE_MODAL_CLASS, SET_PROFILE_MODAL_TEXT,
  SET_UPD_PROFILE_MODAL } from '../actions/profileActions';
import { GET_PROFILE_REQUEST, GET_PROFILE_SUCCESS, GET_PROFILE_FAILURE,
  MODIFY_PROFILE_REQUEST, MODIFY_PROFILE_SUCCESS, MODIFY_PROFILE_FAILURE,
  GITHUB_PROFILE_REQUEST, GITHUB_PROFILE_SUCCESS, GITHUB_PROFILE_FAILURE,
  RESEND_ACCT_VALIDATION_REQUEST, RESEND_ACCT_VALIDATION_SUCCESS, RESEND_ACCT_VALIDATION_FAILURE,
} from '../actions/apiActions';
import { VALIDATE_TOKEN_SUCCESS, LOGIN_SUCCESS, REGISTRATION_SUCCESS } from '../actions/apiLoginActions';
import { LIKE_POST_SUCCESS, UNLIKE_POST_SUCCESS } from '../actions/apiPostActions';

const defaultForm = {
  skill: '',
  language: '',
  skills: [],
  gender: '',
  languages: [],
  time_zone: 'Choose your time zone',
  name: '',
  email: '',
  location: '',
  about: '',
  avatarUrl: '',
  github: '',
  twitter: '',
  facebook: '',
  link: '',
  linkedin: '',
  codepen: '',
  contactMeta: {
    unSubbed: false,
    addPostReminderSent: null,
  },
  hideErr: 'form__hidden',
  errMsg: '',
  update: false,
};

const INITIAL_STATE = {
  currentProfile: {
    email: '',
    skill: '',
    language: '',
    skills: [],
    gender: '',
    languages: [],
    time_zone: 'Choose your time zone',
    name: '',
    github: '',
    avatarUrl: '',
    location: '',
    about: '',
    twitter: '',
    facebook: '',
    link: '',
    linkedin: '',
    codepen: '',
    contactMeta: {
      unSubbed: false,
      addPostReminderSent: null,
    },
  },
  userProfile: {},
  profileSpinnerClass: 'spinner__hide',
  viewProfileModalClass: 'modal__hide',
  viewProfileModalType: 'modal__info',
  viewProfileModalText: '',
  gettingGHProfile: false,
  getSuccess: null,
  getGHError: null,
  getGHSuccess: null,
  editForm: defaultForm,
  addingProfile: false,
  addError: null,
  savingProfile: false,
  saveError: null,
  updProfileSpinnerClass: 'spinner__hide',
  updProfileModal: {
    class: 'modal__hide',
    text: '',
    title: '',
    type: '',
  },
};

function profiles(state = INITIAL_STATE, action) {
  let error;
  let name;
  let avatar_url;
  let time_zone;
  switch (action.type) {

    /*
    *  Called From: <Profile />
    *  Payload: Text - message
    *  Purpose: Set modal text to be displayed on the profile edit page
    */
    case SET_PROFILE_MODAL_TEXT:
      return Object.assign({}, state, { viewProfileModalText: action.payload });

    /*
    *  Called From: <Profile />
    *  Payload: Text - css class
    *  Purpose: set CSS to show/hide the modal on profile edit page.
    */
    case SET_PROFILE_MODAL_CLASS:
      return Object.assign(
        {},
        state,
        {
          viewProfileModalClass: action.payload,
          viewProfileModalType: '',
        },
      );

    /*
    * Called from: <Home />
    * Payload: User Profile
    * Purpose: Set current user data when token is successfully loaded from localStorage
    */
    case VALIDATE_TOKEN_SUCCESS:
      return update(state, { userProfile: { $set: action.payload } });

    /*
    * Called from: <Login />
    * Payload: User Profile (and more!)
    * Purpose: Set current user data when user successfully logs in
    */
    case LOGIN_SUCCESS:
      return update(state, { userProfile: { $set: action.payload.profile } });

    /*
    * Called from: <Registration />
    * Payload: User Profile (and more!)
    * Purpose: Set current user data when user successfully registers
    */
    case REGISTRATION_SUCCESS:
      return update(state, { userProfile: { $set: action.payload.profile } });

    /*
    * Called from: <Profile />
    * Payload: User Profile
    * Purpose: copy user data to profile form for editing
    */
    case SET_EDIT_PROFILE:
      return update(
        state,
        {
          editForm: {
            skill: { $set: '' },
            language: { $set: '' },
            skills: { $set: action.payload.skills || [] },
            gender: { $set: action.payload.gender || '' },
            languages: { $set: action.payload.languages || [] },
            time_zone: { $set: action.payload.time_zone || 'Choose your time zone' },
            name: { $set: action.payload.name || '' },
            email: { $set: action.payload.email || '' },
            location: { $set: action.payload.location || '' },
            about: { $set: action.payload.about || '' },
            github: { $set: action.payload.github || '' },
            avatarUrl: { $set: action.payload.avatarUrl || '' },
            twitter: { $set: action.payload.twitter || '' },
            facebook: { $set: action.payload.facebook || '' },
            link: { $set: action.payload.link || '' },
            linkedin: { $set: action.payload.linkedin || '' },
            codepen: { $set: action.payload.codepen || '' },
            contactMeta: { $set: action.payload.contactMeta },
            hideErr: { $set: 'form__hidden' },
            errMsg: { $set: '' },
            update: { $set: true },
          },
        },
      );

    /*
    * Called from: <Profile />
    * Payload: Form Field and Value
    * Purpose: Update the connected form field.
    * Note modification to use $merge to handle nested contactMeta field
    */
    case SET_PROFILE_FORM_FIELD:
      if (typeof action.value === 'object') {
        return update(state, { editForm: { [action.field]: { $merge: action.value } } });
      }

      return update(state, { editForm: { [action.field]: { $set: action.value } } });


    /*
    * Called from: <Profile />
    * Payload: String - language to be added to array
    * Purpose: Uses update function to avoid mutating state.
    */
    case ADD_LANGUAGE:
      return update(
      state,
        {
          editForm: {
            languages: { $push: [action.payload] },
            language: { $set: '' },
          },
        },
      );

    /*
    * Called from: <Profile />
    * Payload: String - skill to be added to array
    * Purpose: Uses update function to avoid mutating state.
    */
    case ADD_SKILL:
      return update(
        state,
        {
          editForm: {
            skills: { $push: [action.payload] },
            skill: { $set: '' },
          },
        },
      );

    /*
    * Called from: <Profile />
    * Payload: String - language to be removed to array
    * Purpose: Uses update function to avoid mutating state.
    */
    case REMOVE_LANGUAGE:
      return update(state, { editForm: { languages: { $splice: [[action.payload, 1]] } } });

    /*
    * Called from: <Profile />
    * Payload: String - Skill to be removed to array
    * Purpose: Uses update function to avoid mutating state.
    */
    case REMOVE_SKILL:
      return update(state, { editForm: { skills: { $splice: [[action.payload, 1]] } } });

    /*
    * Called from: <ViewProfile />
    * Payload: None
    * Purpose: Show a spinner to indicate API call in progress.
    */
    case GET_PROFILE_REQUEST:
      return Object.assign(
        {},
        state,
        {
          currentProfile: {},
          getSuccess: null,
          profileSpinnerClass: 'spinner__show',
        },
      );

    /*
    * Called from: <ViewProfile />
    * Payload: User object
    * Purpose: Populate the ViewProfile object
    */
    case GET_PROFILE_SUCCESS:
      return update(
        state,
        {
          getSuccess: { $set: true },
          currentProfile: { $set: action.payload },
          editForm: { $set: action.payload },
          profileSpinnerClass: { $set: 'spinner__hide' },
        },
      );

    /*
    * Called from: <ViewProfile />
    * Payload: String - error msg
    * Purpose: Populate the ViewProfile modal with an error message
    */
    case GET_PROFILE_FAILURE:
      error = action.payload.response.message || 'An error occurred while getting the profile';
      return Object.assign(
        {},
        state,
        {
          getSuccess: false,
          profileSpinnerClass: 'spinner__hide',
          viewProfileModalClass: 'modal__show',
          viewProfileModalText: error,
        },
      );

    /*
    * Called from: <ViewProfile />
    * Payload: N/A
    * Purpose: Change settings to hide the modal object
    */
    case DISMISS_VIEWPROFILE_MODAL:
      return Object.assign({}, state, { viewProfileModalText: '', viewProfileModalClass: 'modal__hide' });

    /*
    * Called from: <Profile />
    * Payload: None
    * Purpose: Show a spinner to indicate API call in progress.
    */
    case MODIFY_PROFILE_REQUEST:
      return Object.assign({}, state, { savingProfile: true, saveError: null });

    /*
    * Called from: <Profile />
    * Payload: A user object
    * Purpose: Populate the user object and editable form from API call.
    */
    case MODIFY_PROFILE_SUCCESS:
      return update(
        state,
        {
          savingProfile: { $set: false },
          saveError: { $set: null },
          editForm: { $set: action.payload.user },
          currentProfile: { $set: action.payload.user },
          userProfile: { $set: action.payload.user },
        },
      );

    /*
    * Called from: <Profile />
    * Payload: String - Error msg
    * Purpose: Display an error message to the user.
    */
    case MODIFY_PROFILE_FAILURE:
      error = action.payload.response.message || 'An unknown error occurred while modifying profile';
      return Object.assign(
        {},
        state,
        {
          savingProfile: false,
          saveError: error,
          editForm: {
            errMsg: error,
          },
        },
      );

    /*
    * Called from: <Profile />
    * Payload: None
    * Purpose: Display a spinner to the user to indicate API call in progress.
    */
    case GITHUB_PROFILE_REQUEST:
      return Object.assign(
        {},
        state,
        { gettingGHProfile: true,
          getGHError: null,
          getGHSuccess: null,
          profileSpinnerClass: 'spinner__show',
        },
      );

    /*
    * Called from: <Profile />
    * Payload: GitHub Profile Object
    * Purpose: Populate Github profile data on Profile form in resonse to
    *  user request.
    */
    case GITHUB_PROFILE_SUCCESS:
      return update(
        state,
        {
          gettingGHProfile: { $set: false },
          getGHError: { $set: null },
          getGHSuccess: { $set: true },
          editForm: {
            name: { $set: action.payload.name },
            location: { $set: action.payload.location },
            avatarUrl: { $set: action.payload.avatar_url },
          },
          profileSpinnerClass: { $set: 'spinner__hide' },
        },
      );

    /*
    * Called from: <Profile />
    * Payload: String - Error msg
    * Purpose: Display an error message to the user.
    */
    case GITHUB_PROFILE_FAILURE:
      error = action.payload.data || 'An unknown error occurred while getting Github Profile';
      return Object.assign(
        {},
        state,
        {
          gettingGHProfile: false,
          getGHError: error,
          getGHSuccess: false,
          profileSpinnerClass: 'spinner__hide',
          viewProfileModalClass: 'modal__show',
          viewProfileModalText: error,
        });

    case RESEND_ACCT_VALIDATION_REQUEST:
      return Object.assign({}, state, { updProfileSpinnerClass: 'spinner__show' });

    case RESEND_ACCT_VALIDATION_SUCCESS:
      return Object.assign(
        {},
        state,
        {
          updProfileSpinnerClass: 'spinner__hide',
          updProfileModal: {
            class: 'modal__show',
            text: 'A validation email has been sent to your account.  Use the link to complete the validation',
            type: 'modal__success',
            title: 'EMAIL SENT',
          },
        },
      );

    case RESEND_ACCT_VALIDATION_FAILURE:
      error = action.payload.response.message || 'An unknown error occurred while sending message';
      return Object.assign(
        {},
        state,
        {
          updProfileSpinnerClass: 'spinner__hide',
          updProfileModal: {
            class: 'modal__show',
            text: error,
            type: 'modal__success',
            title: 'EMAIL SENT',
          },
        },
      );

    case SET_UPD_PROFILE_MODAL:
      return Object.assign({}, state, { updProfileModal: action.payload });

    case LIKE_POST_SUCCESS:
      return update(
        state,
        {
          userProfile: {
            likedPosts: {
              $push: [action.meta.postId],
            },
          },
        },
      );

    case UNLIKE_POST_SUCCESS:
      for (let i = 0; i < state.userProfile.likedPosts.length; i += 1) {
        if (state.userProfile.likedPosts[i] === action.meta.postId) {
          return update(
            state,
            {
              userProfile: {
                likedPosts: {
                  $splice: [[i, 1]],
                },
              },
            },
          );
        }
      }
      return state;

    default:
      return state;
  }
}

export default profiles;
