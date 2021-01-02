import { GET_FEED_START, GET_FEED_SUCCESS } from "~/constants/actionType";
import { IGetNewsFeed, IPost } from "~/types/types";

export const getNewsFeedStart = (options?: IGetNewsFeed) => (<const>{
    type: GET_FEED_START,
    payload: options
});

export const getNewsFeedSuccess = (posts: IPost[]) => (<const>{
    type: GET_FEED_SUCCESS,
    payload: posts
});

export type TNewsFeedActionType =
    | ReturnType<typeof getNewsFeedStart>
    | ReturnType<typeof getNewsFeedSuccess>;