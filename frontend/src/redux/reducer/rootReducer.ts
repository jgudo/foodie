import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import loadingReducer from './loadingReducer';
import newsFeedReducer from './newsFeedReducer';
import profileReducer from './profileReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    error: errorReducer,
    loading: loadingReducer,
    newsFeed: newsFeedReducer,
    profile: profileReducer
});

export default rootReducer;
