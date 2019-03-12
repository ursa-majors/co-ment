import update from 'immutability-helper'

import { SET_SEARCH_TEXT, SET_FILTER, SET_SORT, RUN_FILTER, CLEAR_FILTER } from '../actions/gridControlActions'
import { ADD_POST_SUCCESS } from '../actions/apiPostActions'

const INITIAL_STATE = {
  searchText: '',
  filterBtn: {
    role: 'Role',
    gender: 'Gender',
    timezone: 'Time zone',
    language: '',
    keyword: ''
  },
  filterGroup: 'all',
  sortBtn: {
    'popular': '',
    'date-updated': ''
  },
  sortOptions: {
  },
  operation: ''
}

const clearFilters = {
  role: 'Role',
  gender: 'Gender',
  timezone: 'Time zone',
  language: '',
  keyword: ''
}

const sortByDate = (element) => {
  return element.getAttribute('data-updated')
}

const sortByPopularity = (element) => {
  return Number(element.getAttribute('data-popular'))
}

function gridControls (state = INITIAL_STATE, action) {
  let newFilter
  let newFilterGroup
  let filtKeys
  let filtValues
  let newSort
  let sortKeys
  let options = {}
  let reverseSort
  switch (action.type) {
    case ADD_POST_SUCCESS:
      return Object.assign({}, state, { operation: 'ADD' })

    case SET_SEARCH_TEXT:
      return Object.assign(
        {},
        state,
        {
          searchText: action.payload.toLowerCase(),
          operation: 'FILTER'
        }
      )

    case SET_SORT:
      // set the sort options
      if (action.payload.value === 'date-updated') {
        reverseSort = (state.sortOptions.by === sortByDate ? !state.sortOptions.reverse : false)
        options = {
          by: sortByDate,
          reverse: reverseSort
        }
      } else if (action.payload.value === 'popular') {
        reverseSort = (state.sortOptions.by === sortByPopularity ? !state.sortOptions.reverse : false)
        options = {
          by: sortByPopularity,
          reverse: reverseSort
        }
      }
      newSort = Object.assign({}, state.sortBtn)
      // set the active class value on each sort key
      sortKeys = Object.keys(newSort)
      for (let i = 0; i < sortKeys.length; i += 1) {
        if (sortKeys[i] === action.payload.value) {
          newSort[sortKeys[i]] = 'active'
        } else {
          newSort[sortKeys[i]] = ''
        }
      }

      return Object.assign(
        {}
        ,
        state,
        {
          sortBtn: newSort,
          sortOptions: options,
          operation: 'SORT'
        }
      )

    case SET_FILTER:
      // set value of filter key to user-selected value
      newFilter = Object.assign({}, state.filterBtn)
      filtKeys = Object.keys(newFilter)
      for (let i = 0; i < filtKeys.length; i += 1) {
        if (action.payload.id === filtKeys[i]) {
          newFilter[filtKeys[i]] = action.payload.value
        }
      }
      return update(
        state,
        {
          filterBtn: {
            $set: newFilter
          }
        }
      )

    case RUN_FILTER:
      // set state.filterGroup to array of object values of state.FilterBtn
      newFilter = Object.assign({}, state.filterBtn)
      filtKeys = Object.keys(newFilter)
      filtValues = Object.values(newFilter)
      newFilterGroup = []
      for (let i = 0; i < filtValues.length; i += 1) {
        // don't push placeholder or empty values
        if (filtValues[i] !== 'Time zone' && filtValues[i] !== 'Gender' && filtValues[i] !== 'Role' && filtValues[i] !== '') {
          if (filtKeys[i] === 'timezone') {
            // don't convert time zones to lowercase
            newFilterGroup.push(filtValues[i])
          } else {
            // for all other values, convert to lowercase
            newFilterGroup.push(filtValues[i].toLowerCase())
          }
        }
      }
      return update(
        state,
        {
          filterGroup: {
            $set: newFilterGroup
          },
          operation: {
            $set: 'FILTER'
          }
        }
      )

    case CLEAR_FILTER:
      // reset filterBtn values to empty string, filterGroup to empty array
      newFilterGroup = []
      return update(
        state,
        {
          filterBtn: {
            $set: clearFilters
          },
          filterGroup: {
            $set: newFilterGroup
          },
          operation: {
            $set: 'FILTER'
          }
        }
      )
    default:
      return state
  }
}

export default gridControls
