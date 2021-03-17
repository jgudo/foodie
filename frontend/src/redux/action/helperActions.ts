import { SET_TARGET_COMMENT_ID, SET_TARGET_POST } from "~/constants/actionType";
import { IPost } from "~/types/types";

export const setTargetCommentID = (id: string) => (<const>{
    type: SET_TARGET_COMMENT_ID,
    payload: id
});

export const setTargetPost = (post: IPost | null) => (<const>{
    type: SET_TARGET_POST,
    payload: post
});

export type helperActionType =
    | ReturnType<typeof setTargetCommentID>
    | ReturnType<typeof setTargetPost>