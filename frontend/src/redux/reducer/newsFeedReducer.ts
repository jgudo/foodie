import { CLEAR_FEED, CREATE_POST_SUCCESS, GET_FEED_SUCCESS, UPDATE_FEED_POST } from "~/constants/actionType";
import { IPost } from "~/types/types";
import { TNewsFeedActionType } from "../action/feedActions";

const initState: IPost[] = [];

const newsFeedReducer = (state = initState, action: TNewsFeedActionType) => {
    switch (action.type) {
        case GET_FEED_SUCCESS:
            return [...action.payload, ...state];
        case CREATE_POST_SUCCESS:
            return [action.payload, ...state];
        case CLEAR_FEED:
            return initState;
        case UPDATE_FEED_POST:
            return state.map((post: IPost) => {
                if (post.id === action.payload.id) {
                    return action.payload;
                }
                return post;
            })
        default:
            return state;
    }
};

export default newsFeedReducer;
