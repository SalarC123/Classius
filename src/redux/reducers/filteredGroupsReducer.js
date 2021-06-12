const initialState = [];

function filteredGroupsReducer(state = initialState, action) {
    switch(action.type) {
        case "FILTER-GROUPS":
            return action.payload;
        default:
            return state;
    }
}

export default filteredGroupsReducer