import { createStore, applyMiddleware, combineReducers } from 'redux'
import { HYDRATE, createWrapper } from 'next-redux-wrapper'
import thunkMiddleware from 'redux-thunk'
import tab from './tab/reducer'
import question from './question/reducer'

import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'

const bindMiddleware = (middleware) => {
  if (process.env.NODE_ENV !== 'production') {
    const { composeWithDevTools } = require('redux-devtools-extension')
    return composeWithDevTools(applyMiddleware(...middleware))
  }
  return applyMiddleware(...middleware)
}

const combinedReducer = combineReducers({
  tab, question
})

const reducer = (state, action) => {
  return combinedReducer(state, action)
}

const initStore = () => {
  return createStore(reducer, bindMiddleware([thunkMiddleware]))
}

export const wrapper = createWrapper(initStore)