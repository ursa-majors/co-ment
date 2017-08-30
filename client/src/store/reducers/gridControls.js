import update from 'immutability-helper';

import { SET_SEARCH_TEXT, SET_FILTER, SET_SORT } from '../actions/gridControlActions';
import { ADD_POST_SUCCESS } from '../actions/apiPostActions';

const INITIAL_STATE = {
  searchText: '',
  filterBtn: {
    mentor: '',
    mentee: '',
  },
  filterGroup: 'all',
  sortBtn: {
    dom: 'active',
    title: '',
    'date-updated': '',
  },
  sortOptions: {
  },
  operation: '',
};

const sortByDate = (element) => {
  return element.getAttribute('data-updated');
};

const sortByTitle = (element) => {
  return element.getAttribute('data-title').toLowerCase();
};

function gridControls(state = INITIAL_STATE, action) {
  let newFilter;
  let filtKeys;
  let newSort;
  let sortKeys;
  let options = {};
  let reverseSort;
  switch (action.type) {

    case ADD_POST_SUCCESS:
      return Object.assign({}, state, { operation: 'ADD' });

    case SET_SEARCH_TEXT:
      return Object.assign(
        {},
        state,
        {
          searchText: action.payload.toLowerCase(),
          operation: 'FILTER',
        },
      );

    case SET_SORT:
      // set the sort options
      if (action.payload.value === 'date-updated') {
        reverseSort = (state.sortOptions.by === sortByDate ? !state.sortOptions.reverse : true)
        options = {
          by: sortByDate,
          reverse: reverseSort,
        };
      } else if (action.payload.value === 'title') {
        reverseSort = (state.sortOptions.by === sortByTitle ? !state.sortOptions.reverse : false)
        options = {
          by: sortByTitle,
          reverse: reverseSort,
        };
      }
      newSort = Object.assign({}, state.sortBtn);
      // set the active class value on each sort key
      sortKeys = Object.keys(newSort);
      for (let i = 0; i < sortKeys.length; i += 1) {
        if (sortKeys[i] === action.payload.value) {
          newSort[sortKeys[i]] = 'active';
        } else {
          newSort[sortKeys[i]] = '';
        }
      }

      return Object.assign(
        {}
        ,
        state,
        {
          sortBtn: newSort,
          sortOptions: options,
          operation: 'SORT',
        },
      );

    case SET_FILTER:
      // set active class on filterBtn
      newFilter = Object.assign({}, state.filterBtn);
      filtKeys = Object.keys(newFilter);
      for (let i = 0; i < filtKeys.length; i += 1) {
        if (action.payload.id === filtKeys[i]) {
          newFilter[filtKeys[i]] = (newFilter[filtKeys[i]] === 'active' ? '' : 'active');
        } else {
          newFilter[filtKeys[i]] = '';
        }
      }
      return update(
        state,
        {
          filterBtn: {
            $set: newFilter,
          },
          filterGroup: {
            $set: state.filterGroup === action.payload.id ? 'all' : action.payload.id,
          },
          operation: {
            $set: 'FILTER',
          },
        },
      );
    default:
      return state;
  }
}

export default gridControls;
