import { CHECK_SESSION, LOGIN_START, LOGIN_SUCCESS, LOGOUT_START, LOGOUT_SUCCESS, REGISTER_START, REGISTER_SUCCESS } from "~/constants/actionType";
import { IRegister, IUser } from "~/types/types";

export const loginStart = (email: string, password: string) => (<const>{
    type: LOGIN_START,
    payload: {
        email,
        password
    }
});

export const loginSuccess = (id: string, username: string) => (<const>{
    type: LOGIN_SUCCESS,
    payload: {
        id,
        username
    }
});

export const logoutStart = () => (<const>{
    type: LOGOUT_START
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

export type TAuthActionType =
    | ReturnType<typeof checkSession>
    | ReturnType<typeof loginStart>
    | ReturnType<typeof loginSuccess>
    | ReturnType<typeof logoutStart>
    | ReturnType<typeof logoutSuccess>
    | ReturnType<typeof registerStart>
    | ReturnType<typeof registerSuccess>;