import axios from 'axios';

const foodieUrl = process.env.FOODIE_URL || 'http://localhost:9000';
const foodieApiVersion = process.env.FOODIE_API_VERSION || 'v1';
axios.defaults.baseURL = `${foodieUrl}/api/${foodieApiVersion}`;

export const login = async (email: string, password: string) => {
    const req = await axios({
        method: 'POST',
        data: { email, password }
    });

    return req.data;
};
