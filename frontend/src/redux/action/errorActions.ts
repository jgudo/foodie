import { SET_AUTH_ERR_MSG, CLEAR_AUTH_ERR_MSG } from "~/constants/actionType";

export const setAuthErrorMessage = (message: string) => (<const>{
	type: SET_AUTH_ERR_MSG,
	payload: message
});

export const clearAuthErrorMessage = () => (<const>{
	type: CLEAR_AUTH_ERR_MSG
});

export type ErrorActionType =
	ReturnType<typeof setAuthErrorMessage>
	| ReturnType<typeof clearAuthErrorMessage>;
