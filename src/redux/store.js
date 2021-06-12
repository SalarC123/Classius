import { createStore, combineReducers } from 'redux'
import groupsReducer from './reducers/groupsReducer'
import filteredGroupsReducer from './reducers/filteredGroupsReducer'

const root = combineReducers({
    groupsReducer: groupsReducer,
    filteredGroupsReducer: filteredGroupsReducer,
})

const store = createStore(root)

export default store;