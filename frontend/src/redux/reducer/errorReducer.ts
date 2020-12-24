import { CLEAR_AUTH_ERR_MSG, SET_AUTH_ERR_MSG } from "~/constants/actionType";
import { IError } from "~/types/types";
import { ErrorActionType } from "../action/errorActions";

const initState: IError = {
    authError: ''
}

const errorReducer = (state = initState, action: ErrorActionType) => {
    switch (action.type) {
        case SET_AUTH_ERR_MSG:
            return {
                ...state,
                authError: action.payload
            }
        case CLEAR_AUTH_ERR_MSG:
            return {
                ...state,
                authError: null
            }
        default:
            return state;
    }
};

export default errorReducer;
