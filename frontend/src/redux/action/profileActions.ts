import { GET_USER_START, GET_USER_SUCCESS, UPDATE_COVER_PHOTO, UPDATE_PROFILE_INFO, UPDATE_PROFILE_PICTURE } from "~/constants/actionType";
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

export const updateProfilePicture = (url: string) => (<const>{
    type: UPDATE_PROFILE_PICTURE,
    payload: url
});

export const updateCoverPhoto = (url: string) => (<const>{
    type: UPDATE_COVER_PHOTO,
    payload: url
});

export type TProfileActionTypes =
    | ReturnType<typeof updateProfileInfo>
    | ReturnType<typeof updateCoverPhoto>
    | ReturnType<typeof updateProfilePicture>
    | ReturnType<typeof getUserStart>
    | ReturnType<typeof getUserSuccess>;