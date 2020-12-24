import { SET_AUTH_LOADING } from "~/constants/actionType";
import { TLoadingActionType } from "../action/loadingActions";

const initState = {
    isLoadingAuth: false
}

const loadingReducer = (state = initState, action: TLoadingActionType) => {
    switch (action.type) {
        case SET_AUTH_LOADING:
            return {
                ...state,
                isLoadingAuth: action.payload
            }
        default:
            return state;
    }
};

export default loadingReducer;
