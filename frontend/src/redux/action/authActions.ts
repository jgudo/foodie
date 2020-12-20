import { LOGIN_SUCCESS } from "~/constants/actionType";

export const loginSuccess = (userID: string, username: string) => (<const>{
    type: LOGIN_SUCCESS,
    payload: {
        userID,
        username
    }
});

export type TAuthActionType =
    ReturnType<typeof loginSuccess>