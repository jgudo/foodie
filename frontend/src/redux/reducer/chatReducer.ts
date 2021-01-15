import { CLOSE_CHAT, INITIATE_CHAT, MINIMIZE_CHAT } from "~/constants/actionType";
import { IChatState } from "~/types/types";
import { TChatActionType } from "../action/chatActions";

const initState: IChatState = {
    active: '',
    items: []
};

const chatReducer = (state = initState, action: TChatActionType) => {
    switch (action.type) {
        case INITIATE_CHAT:
            const exists = state.items.some(chat => (chat.id as unknown) === action.payload.id);
            const initChat = {
                target: action.payload.username,
                id: action.payload.id,
                profilePicture: action.payload.profilePicture,
                minimized: false,
                chats: []
            };

            return !exists ? {
                active: action.payload.id,
                items: [...state.items, initChat]
            } : {
                    active: action.payload.id,
                    items: state.items.map((chat) => {
                        if ((chat.id as unknown) === action.payload.id) {
                            return {
                                ...chat,
                                minimized: false
                            }
                        }

                        return chat;
                    })
                };
        case MINIMIZE_CHAT:
            return {
                active: '',
                items: state.items.map((chat) => {
                    if (chat.target === action.payload) {
                        return {
                            ...chat,
                            minimized: true
                        }
                    }
                    return chat;
                })
            }
        case CLOSE_CHAT:
            return {
                active: '',
                items: state.items.filter(chat => chat.target !== action.payload)
            }
        default:
            return state;
    }
};

export default chatReducer;
