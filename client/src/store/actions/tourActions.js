export const SET_INDEX = 'SET_INDEX';

export function setIndex(index) {
  return ({
    type: SET_INDEX,
    payload: index,
  });
}
