import { takeLatest } from 'redux-saga/effects';
import { LOGIN_START } from '~/constants/actionType';
import authSaga from './authSaga';

function* rootSaga() {
    yield takeLatest([
        LOGIN_START
    ], authSaga);
}

export default rootSaga;