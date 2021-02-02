import { SET_THEME } from "~/constants/actionType";

export const setTheme = (theme: 'light' | 'dark') => (<const>{
    type: SET_THEME,
    payload: theme
});

export type TSettingsActionType =
    | ReturnType<typeof setTheme>;
