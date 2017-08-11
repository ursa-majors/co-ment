import update from 'immutability-helper';
import { SAVE_PROFILE, UPDATE_PROFILE, SET_CURRENT_PROFILE, SET_EDIT_PROFILE, SET_FORM_FIELD, ADD_LANGUAGE, ADD_SKILL, REMOVE_LANGUAGE, REMOVE_SKILL } from '../actions/profileActions';
import { GET_PROFILE_REQUEST, GET_PROFILE_SUCCESS, GET_PROFILE_FAILURE,
  ADD_PROFILE_REQUEST, ADD_PROFILE_SUCCESS, ADD_PROFILE_FAILURE,
  MODIFY_PROFILE_REQUEST, MODIFY_PROFILE_SUCCESS, MODIFY_PROFILE_FAILURE,
} from '../actions/apiActions';

const defaultForm = {
  skill: '',
  language: '',
  skills: [],
  gender: '',
  languages: [],
  time_zone: 'Choose your time zone',
  name: '',
  ghUserName: '',
  avatarUrl: '',
  hideErr: 'form__hidden',
  errMsg: '',
  update: false,
};

const INITIAL_STATE = {
  profileErrorMsg: '',
  currentProfile: {
    skill: '',
    language: '',
    skills: [],
    gender: '',
    languages: [],
    time_zone: 'Choose your time zone',
    name: '',
    ghUserName: '',
    avatarUrl: ''
  },
  gettingProfile: false,
  getError: null,
  editForm: defaultForm,
  addingProfile: false,
  addError: null,
  savingProfile: false,
  saveError: null,
  gettingAllProfiles: false,
  gettingAllProfilesErr: null,
};

function profiles(state = INITIAL_STATE, action) {
  let error;
  let name;
  let avatar_url;
  let time_zone;
  switch (action.type) {

    case SAVE_PROFILE:
      return update(state, { profile: { $set: action.payload } });

    case UPDATE_PROFILE:
      return update(state, { profile: { $set: action.payload } });

    case SET_CURRENT_PROFILE:
      return update(state, { currentProfile: { $set: action.payload } });

    case SET_EDIT_PROFILE:
    name = action.payload.name || action.payload.ghProfile.name;
    avatar_url = action.payload.avatarUrl || action.payload.ghProfile.avatar_url;
    time_zone = action.payload.time_zone || 'Choose your time zone';
      return update(
        state,
        {
          editForm: {
            skill: { $set: '' },
            language: { $set: '' },
            skills: { $set: action.payload.skills },
            gender: { $set: action.payload.gender },
            languages: { $set: action.payload.languages },
            time_zone: { $set: time_zone },
            name: { $set: name },
            ghUserName: { $set: action.payload.ghUserName },
            avatarUrl: { $set: avatar_url },
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
        { gettingProfile: true, profileError: null },
      );

    case GET_PROFILE_SUCCESS:
      return update(
        state,
        {
          gettingProfile: false,
          getError: null,
          editForm: { $set: defaultForm },
        },
      );

    case GET_PROFILE_FAILURE:
      error = action.payload.data || { message: action.payload.message };
      return Object.assign({}, state, { gettingProfile: false, getError: error });

    case ADD_PROFILE_REQUEST:
      return Object.assign({}, state, { addingProfile: true, addError: null });

    case ADD_PROFILE_SUCCESS:
      return update(
        state,
        {
          addingProfile: { $set: false },
          addError: { $set: null },
          editForm: { $set: defaultForm },
          currentProfile: { $set: {} },
        },
      );

    case ADD_PROFILE_FAILURE:
      error = action.payload.data || { message: action.payload.message };
      return Object.assign({}, state, { addingProfile: false, addError: error });

    case MODIFY_PROFILE_REQUEST:
      return Object.assign({}, state, { savingProfile: true, saveError: null });

    case MODIFY_PROFILE_SUCCESS:
          return update(
            state,
            {
              savingProfile: { $set: false },
              saveError: { $set: null },
              editForm: { $set: defaultForm },
              currentProfile: { $set: {} },
            },
          );

    case MODIFY_PROFILE_FAILURE:
      error = action.payload.data || { message: action.payload.message };
      return Object.assign({}, state, { savingProfile: false, saveError: error });

    default:
      return state;
  }
}

export default profiles;
