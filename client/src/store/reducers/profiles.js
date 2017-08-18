import update from 'immutability-helper';
import { SAVE_PROFILE, SET_CURRENT_PROFILE, SET_EDIT_PROFILE, SET_FORM_FIELD, ADD_LANGUAGE,
  ADD_SKILL, REMOVE_LANGUAGE, REMOVE_SKILL, DISMISS_VIEWPROFILE_MODAL, SET_USER_PROFILE,
 } from '../actions/profileActions';
import { GET_PROFILE_REQUEST, GET_PROFILE_SUCCESS, GET_PROFILE_FAILURE,
  MODIFY_PROFILE_REQUEST, MODIFY_PROFILE_SUCCESS, MODIFY_PROFILE_FAILURE,
  GITHUB_PROFILE_REQUEST, GITHUB_PROFILE_SUCCESS, GITHUB_PROFILE_FAILURE,
} from '../actions/apiActions';
import { VALIDATE_TOKEN_SUCCESS } from '../actions/apiLoginActions';

const defaultForm = {
  skill: '',
  language: '',
  skills: [],
  gender: '',
  languages: [],
  time_zone: 'Choose your time zone',
  name: '',
  location: '',
  about: '',
  ghUserName: '',
  avatarUrl: '',
  twitter: '',
  facebook: '',
  link: '',
  linkedin: '',
  codepen: '',
  hideErr: 'form__hidden',
  errMsg: '',
  update: false,
};

const INITIAL_STATE = {
  currentProfile: {
    skill: '',
    language: '',
    skills: [],
    gender: '',
    languages: [],
    time_zone: 'Choose your time zone',
    name: '',
    ghUserName: '',
    avatarUrl: '',
    location: '',
    about: '',
    twitter: '',
    facebook: '',
    link: '',
    linkedin: '',
    codepen: '',
  },
  userProfile: {},
  profileSpinnerClass: 'spinner__hide',
  viewProfileModalClass: 'modal__hide',
  viewProfileModalText: '',
  gettingProfile: false,
  gettingGHProfile: false,
  getError: null,
  getSuccess: null,
  getGHError: null,
  getGHSuccess: null,
  editForm: defaultForm,
  addingProfile: false,
  addError: null,
  savingProfile: false,
  saveError: null,
};

function profiles(state = INITIAL_STATE, action) {
  let error;
  let name;
  let avatar_url;
  let time_zone;
  switch (action.type) {

    case SAVE_PROFILE:
      return update(state, { profile: { $set: action.payload } });

    case SET_CURRENT_PROFILE:
      return update(state, { currentProfile: { $set: action.payload } });

    case SET_USER_PROFILE:
      return update(state, { userProfile: { $set: action.payload } });

    case VALIDATE_TOKEN_SUCCESS:
      return update(state, { userProfile: { $set: action.payload } });

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
            location: { $set: action.payload.location || '' },
            about: { $set: action.payload.about || '' },
            ghUserName: { $set: action.payload.ghUserName || '' },
            avatarUrl: { $set: action.payload.avatar_url || '' },
            twitter: { $set: action.payload.twitter || '' },
            facebook: { $set: action.payload.facebook || '' },
            link: { $set: action.payload.link || '' },
            linkedin: { $set: action.payload.linkedin || '' },
            codepen: { $set: action.payload.codepen || '' },
            hideErr: { $set: 'form__hidden' },
            errMsg: { $set: '' },
            update: { $set: true },
          },
        },
      );

    case SET_FORM_FIELD:
      return update(state, { editForm: { [action.field]: { $set: action.value } } });

    case ADD_LANGUAGE:
      return update(
      state,
        {
          editForm: {
            languages: { $push: [action.payload] },
            language: { $set: '' },
          },
        });

    case ADD_SKILL:
      return update(
        state,
        {
          editForm: {
            skills: { $push: [action.payload] },
            skill: { $set: '' },
          },
        });


    case REMOVE_LANGUAGE:
      return update(state, { editForm: { languages: { $splice: [[action.payload, 1]] } } });


    case REMOVE_SKILL:
      return update(state, { editForm: { skills: { $splice: [[action.payload, 1]] } } });

    case GET_PROFILE_REQUEST:
      return Object.assign(
        {},
        state,
        {
          currentProfile: {},
          gettingProfile: true,
          profileError: null,
          getError: null,
          getSuccess: null,
          profileSpinnerClass: 'spinner__show',
        },
      );

    case GET_PROFILE_SUCCESS:
      let profile = Object.assign({}, action.payload);
      console.log('got profile');
      console.log(profile);
      return update(
        state,
        {
          gettingProfile: { $set: false },
          getError: { $set: null },
          getSuccess: { $set: true },
          currentProfile: { $set: profile },
          editForm: { $set: profile },
          profile: { $set: profile },
          profileSpinnerClass: { $set: 'spinner__hide' },
        },
      );

    case GET_PROFILE_FAILURE:
      error = action.payload.data || { message: action.payload.response.message };
      return Object.assign(
        {},
        state,
        {
          gettingProfile: false,
          getError: error,
          getSuccess: false,
          profileSpinnerClass: 'spinner__hide',
          viewProfileModalClass: 'modal__show',
          viewProfileModalText: error.message,
        });

    case MODIFY_PROFILE_REQUEST:
      return Object.assign({}, state, { savingProfile: true, saveError: null, saveSuccess: null });

    case MODIFY_PROFILE_SUCCESS:
      return update(
        state,
        {
          savingProfile: { $set: false },
          saveError: { $set: null },
          editForm: { $set: action.payload.user },
          currentProfile: { $set: action.payload.user },
          userProfile: { $set: action.payload.user },
          saveSuccess: { $set: true },
        },
      );

    case MODIFY_PROFILE_FAILURE:
      error = action.payload.data || { message: action.payload.message };
      return Object.assign(
        {},
        state,
        {
          savingProfile: false,
          saveError: error,
          saveSuccess: false,
        });

    case DISMISS_VIEWPROFILE_MODAL:
      return Object.assign({}, state, { viewProfileModalText: '', viewProfileModalClass: 'modal__hide' });

    case GITHUB_PROFILE_REQUEST:
      return Object.assign(
        {},
        state,
        { gettingGHProfile: true, profileError: null, getGHError: null, getGHSuccess: null },
      );

    case GITHUB_PROFILE_SUCCESS:
    let ghProfile = Object.assign({}, action.payload);

      return update(
        state,
        {
          gettingGHProfile: { $set: false },
          getGHError: { $set: null },
          getGHSuccess: { $set: true },
          editForm: { ghProfile: { $set: ghProfile } },
        },
      );

    case GITHUB_PROFILE_FAILURE:
      error = action.payload.data || { message: action.payload.message };
      return Object.assign(
        {},
        state,
        {
          gettingGHProfile: false,
          getGHError: error,
          getGHSuccess: false,
        });

    default:
      return state;
  }
}

export default profiles;
