const initialState = {};

function groupReducer(state = initialState, action) {
    switch(action.type) {
        case "SET-GROUP":
            return action.payload;
        default:
            return state;
    }
}

export default groupReducer