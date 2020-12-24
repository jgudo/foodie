import { call, delay, put } from "redux-saga/effects";
import { LOGIN_START } from "~/constants/actionType";
import { login } from "~/services/api";
import { loginSuccess } from "../action/authActions";
import { setAuthErrorMessage } from "../action/errorActions";
import { isAuthenticating } from "../action/loadingActions";

interface IAuthSaga {
    type: string;
    payload: any;
}

function* authSaga({ type, payload }: IAuthSaga) {
    switch (type) {
        case LOGIN_START:
            try {
                yield put(isAuthenticating(true));
                const user = yield call(login, payload.email, payload.password);

                yield delay(3000);
                yield put(loginSuccess(user.id, user.username));
                yield put(isAuthenticating(false));
            } catch (e) {
                console.log(e);
                yield put(isAuthenticating(false));
                yield put(setAuthErrorMessage(e.error.message));
            }
            break;
        default:
            return;
    }
}

export default authSaga;
