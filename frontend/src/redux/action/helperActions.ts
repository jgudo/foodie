import { SET_TARGET_COMMENT, SET_TARGET_POST } from "~/constants/actionType";
import { IComment, IPost } from "~/types/types";

export const setTargetComment = (comment: IComment | null) => (<const>{
    type: SET_TARGET_COMMENT,
    payload: comment
});

export const setTargetPost = (post: IPost | null) => (<const>{
    type: SET_TARGET_POST,
    payload: post
});

export type helperActionType =
    | ReturnType<typeof setTargetComment>
    | ReturnType<typeof setTargetPost>