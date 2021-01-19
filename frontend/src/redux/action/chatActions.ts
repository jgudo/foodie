import {
    CLEAR_CHAT,
    CLOSE_CHAT,
    GET_MESSAGES_SUCCESS,
    INITIATE_CHAT,
    MINIMIZE_CHAT,
    NEW_MESSAGE_ARRIVED
} from "~/constants/actionType";
import { IMessage, IUser, PartialBy } from "~/types/types";

export const initiateChat = (user: PartialBy<IUser, 'fullname'>) => (<const>{
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

export const getMessagesSuccess = (target: string, messages: IMessage[]) => (<const>{
    type: GET_MESSAGES_SUCCESS,
    payload: {
        username: target,
        messages
    }
});

export const newMessageArrived = (target: string, message: IMessage) => (<const>{
    type: NEW_MESSAGE_ARRIVED,
    payload: {
        username: target,
        message
    }
});

export const clearChat = () => (<const>{
    type: CLEAR_CHAT
});

export type TChatActionType =
    | ReturnType<typeof minimizeChat>
    | ReturnType<typeof closeChat>
    | ReturnType<typeof getMessagesSuccess>
    | ReturnType<typeof newMessageArrived>
    | ReturnType<typeof initiateChat>
    | ReturnType<typeof clearChat>;