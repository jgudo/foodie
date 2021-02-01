import { combineReducers } from 'redux';
import authReducer from './authReducer';
import chatReducer from './chatReducer';
import errorReducer from './errorReducer';
import loadingReducer from './loadingReducer';
import newsFeedReducer from './newsFeedReducer';
import profileReducer from './profileReducer';
import settingsReducer from './settingsReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    error: errorReducer,
    loading: loadingReducer,
    newsFeed: newsFeedReducer,
    profile: profileReducer,
    chats: chatReducer,
    settings: settingsReducer,
});

export default rootReducer;
