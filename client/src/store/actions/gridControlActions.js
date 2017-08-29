export const SET_SEARCH_TEXT = 'SET_SEARCH_TEXT';
export const SET_FILTER = 'SET_FILTER';
export const SET_SORT = 'SET_SORT';

export function setSearchText(txt) {
  return ({
    type: SET_SEARCH_TEXT,
    payload: txt,
  });
}

export function setFilter(filter) {
  return ({
    type: SET_FILTER,
    payload: filter,
  });
}

export function setSort(sort) {
  return ({
    type: SET_SORT,
    payload: sort,
  });
}
