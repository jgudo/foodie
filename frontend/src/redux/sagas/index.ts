import { takeLatest } from 'redux-saga/effects';
import { CHECK_SESSION, LOGIN_START, LOGOUT_START, REGISTER_START } from '~/constants/actionType';
import authSaga from './authSaga';

function* rootSaga() {
    yield takeLatest([
        LOGIN_START,
        LOGOUT_START,
        REGISTER_START,
        CHECK_SESSION
    ], authSaga);
}

export default rootSaga;