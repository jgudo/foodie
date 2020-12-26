import axios from 'axios';
import { IRegister } from '~/types/types';

const foodieUrl = process.env.FOODIE_URL || 'http://localhost:9000';
const foodieApiVersion = process.env.FOODIE_API_VERSION || 'v1';
axios.defaults.baseURL = `${foodieUrl}/api/${foodieApiVersion}`;

export const login = async (email: string, password: string) => {
    try {
        const req = await axios({
            method: 'POST',
            url: '/authenticate',
            data: { email, password }
        });

        return Promise.resolve(req.data.data);
    } catch (e) {
        return Promise.reject(e.response.data);
    }
};

export const checkAuthSession = async () => {
    try {
        const req = await axios({
            method: 'GET',
            url: '/check-session',
            withCredentials: true,
        });

        return Promise.resolve(req.data.data);
    } catch (e) {
        return Promise.reject(e);
    }
}

export const register = async ({ email, password, username }: IRegister) => {
    try {
        const req = await axios({
            method: 'POST',
            url: '/register',
            data: {
                email,
                password,
                username
            }
        });

        return Promise.resolve(req.data.data);
    } catch (e) {
        return Promise.reject(e);
    }
}

export const logout = async () => {
    try {
        await axios({
            method: 'DELETE',
            url: '/logout',
            withCredentials: true,
        });

        return Promise.resolve();
    } catch (e) {
        return Promise.reject(e.response.data);
    }
}
