import { SET_TARGET_COMMENT_ID, SET_TARGET_POST } from "~/constants/actionType";
import { IHelperState } from "~/types/types";
import { helperActionType } from "../action/helperActions";

const initState: IHelperState = {
    targetCommentID: '',
    targetPost: null
}

const helperReducer = (state = initState, action: helperActionType) => {
    switch (action.type) {
        case SET_TARGET_COMMENT_ID:
            return {
                ...state,
                targetCommentID: action.payload
            }
        case SET_TARGET_POST:
            return {
                ...state,
                targetPost: action.payload
            }
        default:
            return state;
    }
}

export default helperReducer;