import { call, put } from "redux-saga/effects";
import { GET_FEED_START } from "~/constants/actionType";
import { getNewsFeed } from "~/services/api";
import { getNewsFeedSuccess } from "../action/feedActions";

interface INewsFeedSaga {
    type: string;
    payload: any;
}

function* newsFeedSaga({ type, payload }: INewsFeedSaga) {
    switch (type) {
        case GET_FEED_START:
            try {
                const posts = yield call(getNewsFeed, payload);
                yield put(getNewsFeedSuccess(posts));
            } catch (e) {
                console.log(e);
            }
    }
}

export default newsFeedSaga;
