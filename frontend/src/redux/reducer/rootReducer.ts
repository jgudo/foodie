import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import loadingReducer from './loadingReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    error: errorReducer,
    loading: loadingReducer
});

export default rootReducer;
