import { call, put } from "redux-saga/effects";
import { CHECK_SESSION, LOGIN_START, LOGOUT_START, REGISTER_START } from "~/constants/actionType";
import { checkAuthSession, login, logout, register } from "~/services/api";
import { loginSuccess, logoutSuccess, registerSuccess } from "../action/authActions";
import { setAuthErrorMessage } from "../action/errorActions";
import { clearNewsFeed } from "../action/feedActions";
import { isAuthenticating } from "../action/loadingActions";

interface IAuthSaga {
    type: string;
    payload: any;
}

function* handleError(e: string) {
    yield put(isAuthenticating(false));

    // if (typeof e !== 'string') {
    //     return;
    // }

    yield put(setAuthErrorMessage(e));
}

function* authSaga({ type, payload }: IAuthSaga) {
    switch (type) {
        case LOGIN_START:
            try {
                yield put(isAuthenticating(true));
                const { auth } = yield call(login, payload.email, payload.password);

                yield put(loginSuccess(auth));
                yield put(isAuthenticating(false));
            } catch (e) {
                console.log(e);

                yield handleError(e.error && e.error.message);
            }
            break;
        case CHECK_SESSION:
            try {
                yield put(isAuthenticating(true));
                const { auth } = yield call(checkAuthSession);

                console.log('SUCCESS ', auth);
                yield put(loginSuccess(auth));
                yield put(isAuthenticating(false));
            } catch (e) {
                yield handleError('Session check failed.');
            }
            break;
        case LOGOUT_START:
            try {
                yield put(isAuthenticating(true));
                yield call(logout);

                yield put(logoutSuccess());
                yield put(isAuthenticating(false));
                yield put(clearNewsFeed());
            } catch (e) {
                yield handleError(e.error && e.error.message);
            }
            break;
        case REGISTER_START:
            try {
                yield put(isAuthenticating(true));

                const user = yield call(register, payload);
                yield put(registerSuccess(user));
                yield put(isAuthenticating(false));
            }
            catch (e) {
                console.log('ERR', e);
                yield handleError(e.error.message || 'Unable to process request.');
            }
            break;
        default:
            return;
    }
}

export default authSaga;
