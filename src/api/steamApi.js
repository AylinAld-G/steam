import axios from 'axios';
import { getEnvVariables } from '../helpers/getEnvVariables';
import Cookie from 'js.cookie';

const { VITE_API_URL } = getEnvVariables();

const steamApi = axios.create({
    baseURL: VITE_API_URL
});

steamApi.interceptors.request.use((config) => {
    const token = Cookies.get('access_token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export default steamApi;
