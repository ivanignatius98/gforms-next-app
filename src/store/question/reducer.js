import { questionActionTypes } from './action'

const questionInitialState = {
  questionIndex: 0,
  questions: []
}
const cardInitialState = {
  title: "",
  image: null,
  type: null
}
export default function reducer(state = questionInitialState, action) {
  switch (action.type) {
    case questionActionTypes.SET_INDEX:
      return Object.assign({}, state, {
        questionIndex: action.index,
      })
    case questionActionTypes.ADD:
      return Object.assign({}, state, {
        questions: [...state.questions, cardInitialState],
      })
    default:
      return state
  }
}