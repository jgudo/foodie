import {
	CLEAR_AUTH_ERR_MSG,
	SET_AUTH_ERR_MSG,
	SET_NEWSFEED_ERR_MSG,
	SET_PROFILE_ERR_MSG
} from "~/constants/actionType";
import { IError } from "~/types/types";

export const setAuthErrorMessage = (error: IError | null) => (<const>{
	type: SET_AUTH_ERR_MSG,
	payload: error
});

export const setProfileErrorMessage = (error: IError | null) => (<const>{
	type: SET_PROFILE_ERR_MSG,
	payload: error
});

export const setNewsFeedErrorMessage = (error: IError | null) => (<const>{
	type: SET_NEWSFEED_ERR_MSG,
	payload: error
});

export const clearAuthErrorMessage = () => (<const>{
	type: CLEAR_AUTH_ERR_MSG
});

export type ErrorActionType =
	| ReturnType<typeof setAuthErrorMessage>
	| ReturnType<typeof setProfileErrorMessage>
	| ReturnType<typeof setNewsFeedErrorMessage>
	| ReturnType<typeof clearAuthErrorMessage>;
