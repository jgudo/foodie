import { call, put } from "redux-saga/effects";
import { GET_USER_START } from "~/constants/actionType";
import { getUser } from "~/services/api";
import { IProfile } from "~/types/types";
import { setProfileErrorMessage } from "../action/errorActions";
import { isGettingUser } from "../action/loadingActions";
import { getUserSuccess } from "../action/profileActions";

interface IProfileSaga {
    type: string;
    payload: any;
}

function* profileSaga({ type, payload }: IProfileSaga) {
    switch (type) {
        case GET_USER_START:
            try {
                yield put(isGettingUser(true));
                const user: IProfile = yield call(getUser, payload);

                yield put(isGettingUser(false));
                yield put(setProfileErrorMessage(null));
                yield put(getUserSuccess(user));
            } catch (e) {
                yield put(setProfileErrorMessage(e));
                yield put(isGettingUser(false));
                console.log(e);
            }
            break;
        default:
            throw new Error(`Unexpected action type ${type}.`);
    }
}

export default profileSaga;
