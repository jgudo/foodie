import { CLEAR_FEED, CREATE_POST_SUCCESS, DELETE_FEED_POST, GET_FEED_SUCCESS, UPDATE_FEED_POST } from "~/constants/actionType";
import { INewsFeed, IPost } from "~/types/types";
import { TNewsFeedActionType } from "../action/feedActions";

const initState: INewsFeed = {
    items: [],
    offset: 0
};

const newsFeedReducer = (state = initState, action: TNewsFeedActionType) => {
    switch (action.type) {
        case GET_FEED_SUCCESS:
            return {
                items: [...state.items, ...action.payload],
                offset: state.offset + 1
            };
        case CREATE_POST_SUCCESS:
            return {
                ...state,
                items: [action.payload, ...state.items]
            };
        case CLEAR_FEED:
            return initState;
        case UPDATE_FEED_POST:
            return {
                ...state,
                items: state.items.map((post: IPost) => {
                    if (post.id === action.payload.id) {
                        return action.payload;
                    }
                    return post;
                })
            }
        case DELETE_FEED_POST:
            return {
                ...state,
                // eslint-disable-next-line array-callback-return
                items: state.items.filter((post: IPost) => {
                    if (post.id !== action.payload) {
                        return post;
                    }
                })
            }
        default:
            return state;
    }
};

export default newsFeedReducer;
