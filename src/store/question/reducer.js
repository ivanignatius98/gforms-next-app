import { questionActionTypes } from './action'

const questionInitialState = {
  questionIndex: -1,
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
    case questionActionTypes.ADD: {
      const temp = [...state.questions]
      if (action.index != undefined) {
        temp.splice(action.index + 1, 0, cardInitialState)
      } else {
        temp.push(cardInitialState)
      }
      return Object.assign({}, state, {
        questions: temp,
      })
    }
    case questionActionTypes.SET_VALUE: {
      state.questions[action.index] = { ...state.questions[action.index], ...action.payload }
      return Object.assign({}, state, {
        questions: [...state.questions],
      })
    }
    default:
      return state
  }
}