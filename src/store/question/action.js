export const questionActionTypes = {
  SET_INDEX: 'SET_INDEX',
  ADD: 'ADD',
}
export const setQuestionIndex = (index) => (dispatch) => {
  return dispatch({ type: questionActionTypes.SET_INDEX, index })
}
export const addQuestion = () => (dispatch) => {
  return dispatch({ type: questionActionTypes.ADD })
}