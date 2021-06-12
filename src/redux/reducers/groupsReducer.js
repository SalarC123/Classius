const initialState = [];

function groupsReducer(state = initialState, action) {
    switch(action.type) {
        case "SET-GROUPS":
            return action.payload;
        default:
            return state;
    }
}

export default groupsReducer