import {
	CLEAR_AUTH_ERR_MSG,
	SET_AUTH_ERR_MSG,
	SET_NEWSFEED_ERR_MSG,
	SET_PROFILE_ERR_MSG
} from "~/constants/actionType";

export const setAuthErrorMessage = (message: string) => (<const>{
	type: SET_AUTH_ERR_MSG,
	payload: message
});

export const setProfileErrorMessage = (message: string) => (<const>{
	type: SET_PROFILE_ERR_MSG,
	payload: message
});

export const setNewsFeedErrorMessage = (message: string) => (<const>{
	type: SET_NEWSFEED_ERR_MSG,
	payload: message
});

export const clearAuthErrorMessage = () => (<const>{
	type: CLEAR_AUTH_ERR_MSG
});

export type ErrorActionType =
	| ReturnType<typeof setAuthErrorMessage>
	| ReturnType<typeof setProfileErrorMessage>
	| ReturnType<typeof setNewsFeedErrorMessage>
	| ReturnType<typeof clearAuthErrorMessage>;
