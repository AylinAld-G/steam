import axios from 'axios';
import { getEnvVariables } from '../helpers/getEnvVariables';
import Cookie from 'js.cookie';

const { VITE_API_URL } = getEnvVariables();

const steamApi = axios.create({
    baseURL: VITE_API_URL
});

steamApi.interceptors.request.use(config => { 

    config.headers = {
        ...config.headers,
        'access-token': Cookie.get('access_token')   //cualquier petición que haga con el steamApi adicionalmente le coloque este header 
    }

    return config;
})

export default steamApi;
