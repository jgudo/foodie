import { GET_FEED_SUCCESS } from "~/constants/actionType";
import { IPost } from "~/types/types";
import { TNewsFeedActionType } from "../action/feedActions";

const initState: IPost[] = [];

const newsFeedReducer = (state = initState, action: TNewsFeedActionType) => {
    switch (action.type) {
        case GET_FEED_SUCCESS:
            return [...state, ...action.payload];
        default:
            return state;
    }
};

export default newsFeedReducer;
