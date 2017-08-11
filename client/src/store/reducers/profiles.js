import update from 'immutability-helper';
import { SAVE_PROFILE, SET_CURRENT_PROFILE, SET_EDIT_PROFILE, SET_FORM_FIELD, ADD_LANGUAGE, ADD_SKILL, REMOVE_LANGUAGE, REMOVE_SKILL } from '../actions/profileActions';
import { GET_PROFILE_REQUEST, GET_PROFILE_SUCCESS, GET_PROFILE_FAILURE,
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

    case SET_EDIT_PROFILE:
      return update(
        state,
        {
          editForm: {
            skill: { $set: '' },
            language: { $set: '' },
            skills: { $set: action.payload.skills },
            gender: { $set: action.payload.gender },
            languages: { $set: action.payload.languages },
            time_zone: { $set: action.payload.time_zone || 'Choose your time zone' },
            name: { $set: action.payload.name },
            ghUserName: { $set: action.payload.ghUserName },
            avatarUrl: { $set: action.payload.avatar_url },
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
        { gettingProfile: true, profileError: null, getError: null, getSuccess: null },
      );

    case GET_PROFILE_SUCCESS:
    let profile = Object.assign({}, action.payload);
    console.log('121', profile);
      return update(
        state,
        {
          gettingProfile: { $set: false },
          getError: { $set: null },
          getSuccess: { $set: true },
          currentProfile: { $set: profile },
          editForm: { $set: profile },
          profile: { $set: profile },
        },
      );

    case GET_PROFILE_FAILURE:
      error = action.payload.data || { message: action.payload.message };
      return Object.assign({}, state, { gettingProfile: false, getError: error, getSuccess: false, });

    case MODIFY_PROFILE_REQUEST:
    console.log('request modify profile');
      return Object.assign({}, state, { savingProfile: true, saveError: null, saveSuccess: null, });

    case MODIFY_PROFILE_SUCCESS:
    console.log('success modify profile');
    profile = Object.assign({}, action.payload);
          return update(
            state,
            {
              savingProfile: { $set: false },
              saveError: { $set: null },
              editForm: { $set: defaultForm },
              currentProfile: { $set: profile },
              profile: { $set: profile },
              saveSuccess: { $set: true },
            },
          );

    case MODIFY_PROFILE_FAILURE:
    console.log('failure modify profile');
      error = action.payload.data || { message: action.payload.message };
      return Object.assign({}, state, { savingProfile: false, saveError: error, saveSuccess: false, });

    default:
      return state;
  }
}

export default profiles;
