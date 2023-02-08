import { tabActionTypes } from './action'

const tabInitialState = {
  tabIndex: 0,
}

export default function reducer(state = tabInitialState, action) {
  switch (action.type) {
    case tabActionTypes.SET:
      return Object.assign({}, state, {
        tabIndex: action.index,
      })
    default:
      return state
  }
}