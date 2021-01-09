import { GET_USER_START, GET_USER_SUCCESS, UPDATE_PROFILE_INFO } from "~/constants/actionType";
import { IProfile } from "~/types/types";

export const getUserStart = (username: string) => (<const>{
    type: GET_USER_START,
    payload: username
});

export const getUserSuccess = (user: IProfile) => (<const>{
    type: GET_USER_SUCCESS,
    payload: user
});

export const updateProfileInfo = (user: IProfile) => (<const>{
    type: UPDATE_PROFILE_INFO,
    payload: user
});

export type TProfileActionTypes =
    | ReturnType<typeof updateProfileInfo>
    | ReturnType<typeof getUserStart>
    | ReturnType<typeof getUserSuccess>;