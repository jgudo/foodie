import {
    CLEAR_FEED,
    CREATE_POST_START,
    CREATE_POST_SUCCESS,
    DELETE_FEED_POST,
    GET_FEED_START,
    GET_FEED_SUCCESS,
    HAS_NEW_FEED,
    UPDATE_FEED_POST,
    UPDATE_POST_LIKES
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

export const updatePostLikes = (postID: string, state: boolean, likesCount: number) => (<const>{
    type: UPDATE_POST_LIKES,
    payload: { postID, state, likesCount }
});

export const deleteFeedPost = (postID: string) => (<const>{
    type: DELETE_FEED_POST,
    payload: postID
});

export const clearNewsFeed = () => (<const>{
    type: CLEAR_FEED
});

export const hasNewFeed = (bool = true) => (<const>{
    type: HAS_NEW_FEED,
    payload: bool
});

export type TNewsFeedActionType =
    | ReturnType<typeof getNewsFeedStart>
    | ReturnType<typeof getNewsFeedSuccess>
    | ReturnType<typeof createPostStart>
    | ReturnType<typeof createPostSuccess>
    | ReturnType<typeof updateFeedPost>
    | ReturnType<typeof deleteFeedPost>
    | ReturnType<typeof hasNewFeed>
    | ReturnType<typeof updatePostLikes>
    | ReturnType<typeof clearNewsFeed>;