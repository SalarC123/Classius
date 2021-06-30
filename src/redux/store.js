import { createStore, combineReducers } from 'redux'
import groupsReducer from './reducers/groupsReducer'
import modalReducer from './reducers/modalReducer'
import groupReducer from './reducers/groupReducer'

const root = combineReducers({
    groupsReducer: groupsReducer,
    modalReducer: modalReducer,
    groupReducer: groupReducer,
})

const store = createStore(root)

export default store;