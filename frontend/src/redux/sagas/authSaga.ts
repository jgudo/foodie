import { call, put, select } from "redux-saga/effects";
import { history } from '~/App';
import { CHECK_SESSION, LOGIN_START, LOGOUT_START, REGISTER_START } from "~/constants/actionType";
import { LOGIN } from "~/constants/routes";
import { checkAuthSession, login, logout, register } from "~/services/api";
import socket from "~/socket/socket";
import { IError, IUser } from "~/types/types";
import { loginSuccess, logoutSuccess, registerSuccess } from "../action/authActions";
import { clearChat } from "../action/chatActions";
import { setAuthErrorMessage } from "../action/errorActions";
import { clearNewsFeed } from "../action/feedActions";
import { isAuthenticating } from "../action/loadingActions";

interface IAuthSaga {
    type: string;
    payload: any;
}

function* handleError(e: IError) {
    yield put(isAuthenticating(false));

    yield put(setAuthErrorMessage(e));
}

function* authSaga({ type, payload }: IAuthSaga) {
    switch (type) {
        case LOGIN_START:
            try {
                yield put(isAuthenticating(true));
                const { auth } = yield call(login, payload.email, payload.password);
                socket.emit('userConnect', auth.id);
                yield put(clearNewsFeed());
                yield put(loginSuccess(auth));
                yield put(isAuthenticating(false));
            } catch (e) {
                console.log(e);

                yield handleError(e);
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
                yield handleError(e);
            }
            break;
        case LOGOUT_START:
            try {
                const { auth } = yield select();
                yield put(isAuthenticating(true));
                yield call(logout);

                payload.callback && payload.callback();

                yield put(logoutSuccess());
                yield put(isAuthenticating(false));
                yield put(clearNewsFeed());
                yield put(clearChat());
                history.push(LOGIN);
                socket.emit('userDisconnect', auth.id);
            } catch (e) {
                yield handleError(e);
            }
            break;
        case REGISTER_START:
            try {
                yield put(isAuthenticating(true));

                const user: IUser = yield call(register, payload);

                socket.emit('userConnect', user.id);
                yield put(registerSuccess(user));
                yield put(isAuthenticating(false));
            }
            catch (e) {
                console.log('ERR', e);
                yield handleError(e);
            }
            break;
        default:
            return;
    }
}

export default authSaga;
