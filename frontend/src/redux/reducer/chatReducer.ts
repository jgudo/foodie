import { CLEAR_CHAT, CLOSE_CHAT, GET_MESSAGES_SUCCESS, INITIATE_CHAT, MINIMIZE_CHAT, NEW_MESSAGE_ARRIVED } from "~/constants/actionType";
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
                username: action.payload.username,
                id: action.payload.id,
                profilePicture: action.payload.profilePicture,
                minimized: false,
                chats: []
            };

            const maxItems = 4;
            const hasReachedLimit = state.items.length === maxItems;


            if (!exists) {
                // Delete first and set minimized to true
                const mapped = state.items.map(chat => ({
                    ...chat,
                    minimized: true
                }));
                const deletedFirstItem = mapped.splice(1);

                return {
                    active: action.payload.id,
                    items: hasReachedLimit
                        ? [...deletedFirstItem, initChat]
                        : [...(state.items.map(chat => ({
                            ...chat,
                            minimized: true
                        }))), initChat]
                }
            } else {
                return {
                    active: action.payload.id,
                    items: state.items.map((chat) => {
                        if ((chat.id as unknown) === action.payload.id) {
                            return {
                                ...chat,
                                minimized: false
                            }
                        }

                        return {
                            ...chat,
                            minimized: true
                        };
                    })
                };
            }
        case MINIMIZE_CHAT:
            return {
                active: '',
                items: state.items.map((chat) => {
                    if (chat.username === action.payload) {
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
                items: state.items.filter(chat => chat.username !== action.payload)
            }
        case GET_MESSAGES_SUCCESS:
            return {
                ...state,
                items: state.items.map(chat => chat.username !== action.payload.username ? chat : {
                    ...chat,
                    offset: (chat.offset || 0) + 1,
                    chats: [...action.payload.messages, ...chat.chats]
                })
            }
        case NEW_MESSAGE_ARRIVED:
            return {
                ...state,
                items: state.items.map(chat => chat.username !== action.payload.username ? chat : {
                    ...chat,
                    chats: [...chat.chats, action.payload.message]
                })
            }
        case CLEAR_CHAT:
            return initState;
        default:
            return state;
    }
};

export default chatReducer;
