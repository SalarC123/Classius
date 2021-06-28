const initialState = {commentModal: false};

function modalReducer(state = initialState, action) {
    switch (action.type) {
        case "OPEN-COMMENT-MODAL":
            return {...state, commentModal: true}
        case "CLOSE-COMMENT-MODAL":
            return {...state, commentModal: false}
        default:
            return state;
    }
}

export default modalReducer;