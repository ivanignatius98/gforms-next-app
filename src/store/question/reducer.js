import { questionActionTypes } from './action'
import { defaultQuestion } from '@components/dashboard/defaults'
import { swap } from '@helpers'

const questionInitialState = {
  questionIndex: -1,
  questions: [defaultQuestion]
}
const cardInitialState = defaultQuestion

export default function reducer(state = questionInitialState, action) {
  switch (action.type) {
    case questionActionTypes.SET_INDEX:
      return Object.assign({}, state, {
        questionIndex: action.index,
      })

    case questionActionTypes.SET:
      return Object.assign({}, state, {
        questions: action.payload,
      })

    case questionActionTypes.SWAP:
      const temp = swap([...state.questions], action.index, action.nextIndex)
      return Object.assign({}, state, {
        questions: temp,
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
      return Object.assign({}, state, { questions: [...state.questions] })
    }
    default:
      return state
  }
}