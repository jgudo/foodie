import {
    CHECK_SESSION,
    LOGIN_START,
    LOGIN_SUCCESS,
    LOGOUT_START,
    LOGOUT_SUCCESS,
    REGISTER_START,
    REGISTER_SUCCESS,
    UPDATE_AUTH_PICTURE
} from "~/constants/actionType";
import { IRegister, IUser } from "~/types/types";

export const loginStart = (email: string, password: string) => (<const>{
    type: LOGIN_START,
    payload: {
        email,
        password
    }
});

export const loginSuccess = (auth: IUser) => (<const>{
    type: LOGIN_SUCCESS,
    payload: auth
});

export const logoutStart = (callback?: () => void) => (<const>{
    type: LOGOUT_START,
    payload: { callback }
});

export const logoutSuccess = () => (<const>{
    type: LOGOUT_SUCCESS
});

export const registerStart = ({ email, password, username }: IRegister) => (<const>{
    type: REGISTER_START,
    payload: {
        email,
        password,
        username
    }
});

export const registerSuccess = (userAuth: IUser) => (<const>{
    type: REGISTER_SUCCESS,
    payload: userAuth
});


export const checkSession = () => (<const>{
    type: CHECK_SESSION
});

export const updateAuthPicture = (image: Object) => (<const>{
    type: UPDATE_AUTH_PICTURE,
    payload: image
});

export type TAuthActionType =
    | ReturnType<typeof updateAuthPicture>
    | ReturnType<typeof checkSession>
    | ReturnType<typeof loginStart>
    | ReturnType<typeof loginSuccess>
    | ReturnType<typeof logoutStart>
    | ReturnType<typeof logoutSuccess>
    | ReturnType<typeof registerStart>
    | ReturnType<typeof registerSuccess>;