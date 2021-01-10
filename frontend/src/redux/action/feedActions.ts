import {
    CLEAR_FEED,
    CREATE_POST_START,
    CREATE_POST_SUCCESS,
    DELETE_FEED_POST,
    GET_FEED_START,
    GET_FEED_SUCCESS,
    UPDATE_FEED_POST
} from "~/constants/actionType";
import { IFetchParams, IPost } from "~/types/types";

export const getNewsFeedStart = (options?: IFetchParams) => (<const>{
    type: GET_FEED_START,
    payload: options
});

export const getNewsFeedSuccess = (posts: IPost[]) => (<const>{
    type: GET_FEED_SUCCESS,
    payload: posts
});

export const createPostStart = (post: FormData) => (<const>{
    type: CREATE_POST_START,
    payload: post
});

export const createPostSuccess = (post: IPost) => (<const>{
    type: CREATE_POST_SUCCESS,
    payload: post
});

export const updateFeedPost = (post: IPost) => (<const>{
    type: UPDATE_FEED_POST,
    payload: post
});

export const deleteFeedPost = (postID: string) => (<const>{
    type: DELETE_FEED_POST,
    payload: postID
});

export const clearNewsFeed = () => (<const>{
    type: CLEAR_FEED
});

export type TNewsFeedActionType =
    | ReturnType<typeof getNewsFeedStart>
    | ReturnType<typeof getNewsFeedSuccess>
    | ReturnType<typeof createPostStart>
    | ReturnType<typeof createPostSuccess>
    | ReturnType<typeof updateFeedPost>
    | ReturnType<typeof deleteFeedPost>
    | ReturnType<typeof clearNewsFeed>;