import update from 'immutability-helper';

import { SET_SEARCH_TEXT, SET_FILTER, SET_SORT } from '../actions/gridControlActions';

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
  switch (action.type) {

    case SET_SEARCH_TEXT:
      return Object.assign(
        {},
        state,
        {
          searchText: action.payload.toLowerCase(),
          operation: 'SEARCH',
        },
      );

    case SET_SORT:
      // set the sort options
      if (action.payload.value === 'date-updated') {
        options = {
          by: sortByDate,
          reverse: state.sortBtn['date-updated'] !== 'active',
        };
      } else if (action.payload.value === 'title') {
        options = {
          by: sortByTitle,
          reverse: state.sortBtn.title === 'active',
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

/*
handleSearchKeyup = (e) => {
  console.log('hsku')
  const searchText = e.target.value.toLowerCase();
  this.shuffle.filter((element, shuffle) => {
    // If there is a current filter applied, ignore elements that don't match it.
    if (shuffle.group !== Shuffle.ALL_ITEMS) {
      // Get the item's groups.
      var groups = JSON.parse(element.getAttribute('data-groups'));
      console.log(element.getAtribute('data-groups'));
      console.log(groups);
      var isElementInCurrentGroup = groups.indexOf(shuffle.group) !== -1;
      // Only search elements in the current group
      if (!isElementInCurrentGroup) {
        return false;
      }
    }
    const titleElement = element.querySelector('.post-thumb__title');
    const titleText = titleElement.textContent.toLowerCase().trim();
    const bodyElement = element.querySelector('.post-thumb__body');
    const bodyText = bodyElement.textContent.toLowerCase().trim();
    // add username ?
    // in order to make keywords, timezone, gender searchable they have to be output to grid even if not visible in thumb view
    const searchBlob = titleText.concat(bodyText);
    return searchBlob.indexOf(searchText) !== -1;
    PostsGrid.adjustBkgSize();
  });
};
*/
