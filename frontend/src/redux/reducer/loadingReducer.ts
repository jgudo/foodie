import {
    SET_AUTH_LOADING,
    SET_CREATE_POST_LOADING,
    SET_GET_FEED_LOADING,
    SET_GET_USER_LOADING
} from "~/constants/actionType";
import { TLoadingActionType } from "../action/loadingActions";

const initState = {
    isLoadingAuth: false,
    isLoadingCreatePost: false,
    isLoadingGetUser: false,
    isLoadingProfile: false,
    isLoadingFeed: false
}

const loadingReducer = (state = initState, action: TLoadingActionType) => {
    switch (action.type) {
        case SET_AUTH_LOADING:
            return {
                ...state,
                isLoadingAuth: action.payload
            }
        case SET_CREATE_POST_LOADING:
            return {
                ...state,
                isLoadingCreatePost: action.payload
            }
        case SET_GET_USER_LOADING:
            return {
                ...state,
                isLoadingGetUser: action.payload
            }
        case SET_GET_FEED_LOADING:
            return {
                ...state,
                isLoadingFeed: action.payload
            }
        default:
            return state;
    }
};

export default loadingReducer;
