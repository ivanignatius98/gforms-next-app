import { questionActionTypes } from './action'

const questionInitialState = {
  questionIndex: -1,
}

export default function reducer(state = questionInitialState, action) {
  switch (action.type) {
    case questionActionTypes.SET_INDEX:

      return Object.assign({}, state, {
        questionIndex: action.index,
      })
    default:
      return state
  }
}