import axios from 'axios';

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

        return req.data;
    } catch (e) {
        return e.response.data;
    }
};
