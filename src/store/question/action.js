export const questionActionTypes = {
  SET_INDEX: 'SET_INDEX',
  ADD: 'ADD',
  SET_VALUE: "SET_VALUE"
}
export const setQuestionIndex = (index) => (dispatch) => {
  return dispatch({ type: questionActionTypes.SET_INDEX, index })
}
export const addQuestion = (index) => (dispatch) => {
  return dispatch({ type: questionActionTypes.ADD, index })
}
export const setQuestionValue = ({ index, payload }) => (dispatch) => {
  console.log("CALLED")
  return dispatch({ type: questionActionTypes.SET_VALUE, index, payload })
}