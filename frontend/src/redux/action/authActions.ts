import { LOGIN_SUCCESS, LOGIN_START } from "~/constants/actionType";

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

export type TAuthActionType =
    | ReturnType<typeof loginStart>
    | ReturnType<typeof loginSuccess>;