export const SET_SEARCH_TEXT = 'SET_SEARCH_TEXT';
export const SET_FILTER = 'SET_FILTER';
export const RUN_FILTER = 'RUN_FILTER';
export const CLEAR_FILTER = 'CLEAR_FILTER';
export const SET_SORT = 'SET_SORT';

export function setSearchText(txt) {
  return ({
    type: SET_SEARCH_TEXT,
    payload: txt,
  });
}

export function setFilter(id, value) {
  return ({
    type: SET_FILTER,
    payload: { id, value },
  });
}

export function runFilter() {
  return ({
    type: RUN_FILTER,
  });
}

export function clearFilter() {
  return ({
    type: CLEAR_FILTER,
  });
}


export function setSort(sort) {
  return ({
    type: SET_SORT,
    payload: sort,
  });
}