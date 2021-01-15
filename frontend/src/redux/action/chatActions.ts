import { CLOSE_CHAT, INITIATE_CHAT, MINIMIZE_CHAT } from "~/constants/actionType";
import { IUser } from "~/types/types";

export const initiateChat = (user: IUser) => (<const>{
    type: INITIATE_CHAT,
    payload: user
});

export const minimizeChat = (target: string) => (<const>{
    type: MINIMIZE_CHAT,
    payload: target
});

export const closeChat = (target: string) => (<const>{
    type: CLOSE_CHAT,
    payload: target
});

export type TChatActionType =
    | ReturnType<typeof minimizeChat>
    | ReturnType<typeof closeChat>
    | ReturnType<typeof initiateChat>;