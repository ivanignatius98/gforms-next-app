export const tabActionTypes = {
  SET: 'SET',
}
export const setTab = (index) => (dispatch) => {
  return dispatch({ type: tabActionTypes.SET, index })
}