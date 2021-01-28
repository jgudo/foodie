import { takeLatest } from 'redux-saga/effects';
import {
    CHECK_SESSION,
    CREATE_POST_START,
    GET_FEED_START,
    GET_USER_START,
    LOGIN_START,
    LOGOUT_START,
    REGISTER_START
} from '~/constants/actionType';
import authSaga from './authSaga';
import newsFeedSaga from './newsFeedSaga';
import profileSaga from './profileSaga';

function* rootSaga() {
    yield takeLatest([
        LOGIN_START,
        LOGOUT_START,
        REGISTER_START,
        CHECK_SESSION,
    ], authSaga);

    yield takeLatest([
        GET_FEED_START,
        CREATE_POST_START
    ], newsFeedSaga);

    yield takeLatest([
        GET_USER_START
    ], profileSaga)
}

export default rootSaga;