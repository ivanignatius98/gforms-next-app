export const questionActionTypes = {
  SET_INDEX: 'SET_INDEX',
  ADD: 'ADD',
  SET_VALUE: "SET_VALUE",
  SWAP: "SWAP",
  SET: "SET"
}
export const setQuestionIndex = (index) => (dispatch) => {
  return dispatch({ type: questionActionTypes.SET_INDEX, index })
}
export const addQuestion = (index) => (dispatch) => {
  return dispatch({ type: questionActionTypes.ADD, index })
}
export const setQuestionValue = ({ index, payload }) => (dispatch) => {
  return dispatch({ type: questionActionTypes.SET_VALUE, index, payload })
}
export const swapQuestions = (index, nextIndex) => (dispatch) => {
  return dispatch({ type: questionActionTypes.SWAP, index, nextIndex })
}
export const setQuestions = (payload) => (dispatch) => {
  return dispatch({ type: questionActionTypes.SET, payload })
}