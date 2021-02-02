import { SET_THEME } from "~/constants/actionType";
import { ISettingsState } from "~/types/types";
import { TSettingsActionType } from "../action/settingsActions";

const initState: ISettingsState = {
    theme: 'light',
    // ... more settings
}

const settingsReducer = (state = initState, action: TSettingsActionType) => {
    switch (action.type) {
        case SET_THEME:
            return {
                ...state,
                theme: action.payload
            }
        default:
            return state;
    }
}

export default settingsReducer;
