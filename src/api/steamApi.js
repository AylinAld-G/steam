import axios from 'axios';
import { getEnvVariables } from '../helpers/getEnvVariables';

const { VITE_API_URL } = getEnvVariables();

const steamApi = axios.create({
    baseURL: VITE_API_URL
});

export default steamApi;
