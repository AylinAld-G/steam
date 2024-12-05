import axios from 'axios';
import { getEnvVariables } from '../helpers/getEnvVariables';
import Cookies from 'js-cookie';

const { VITE_API_URL } = getEnvVariables();

console.log('VITE_API_URL:', VITE_API_URL);

const steamApi = axios.create({
    baseURL: VITE_API_URL,
    withCredentials: true
});


export default steamApi;
