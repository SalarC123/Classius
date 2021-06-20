import { createStore, combineReducers } from 'redux'
import groupsReducer from './reducers/groupsReducer'

const root = combineReducers({
    groupsReducer: groupsReducer,
})

const store = createStore(root)

export default store;