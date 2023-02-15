export const questionActionTypes = {
  SET_INDEX: 'SET_INDEX',
}
export const setQuestionIndex = (index) => (dispatch) => {
  return dispatch({ type: questionActionTypes.SET_INDEX, index })
}