import axios, { AxiosRequestConfig } from "axios";
import { logoutStart } from '~/redux/action/authActions';
import store from '~/redux/store/store';

const foodieUrl = process.env.REACT_APP_FOODIE_URL || 'http://localhost:9000';
const foodieApiVersion = process.env.REACT_APP_FOODIE_API_VERSION || 'v1';
axios.defaults.baseURL = `${foodieUrl}/api/${foodieApiVersion}`;
axios.defaults.withCredentials = true;

let isLogoutTriggered = false;

function resetIsLogoutTriggered() {
    isLogoutTriggered = false;
}

axios.interceptors.response.use(
    response => response,
    error => {
        const { data, status } = error.response;
        if (status === 401
            && (data?.error?.type || '') !== 'INCORRECT_CREDENTIALS'
            && error.config
            && !error.config.__isRetryRequest
        ) {
            if (!isLogoutTriggered) {
                isLogoutTriggered = true;
                store.dispatch(logoutStart(resetIsLogoutTriggered));
            }
        }
        return Promise.reject(error);
    }
);

const httpRequest = <T>(req: AxiosRequestConfig): Promise<T> => {
    return new Promise(async (resolve, reject) => {
        try {
            const request = await axios(req);

            resolve(request.data.data)
        } catch (e) {
            reject(e?.response?.data || {});
        }
    });
}

export default httpRequest;