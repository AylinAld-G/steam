import axios from 'axios';
import { getEnvVariables } from '../helpers/getEnvVariables';

const { VITE_API_URL } = getEnvVariables();

const steamApi = axios.create({
    baseURL: VITE_API_URL
});

//TODO: Configurar interceptores (para interceptar peticiones antes o después de que se hagan)
steamApi.interceptors.request.use(config => {

    config.headers = {
        ...config.headers,
        'x-token': localStorage.getItem('token')   //cualquier petición que haga con el steamApi adicionalmente le coloque este header
    }

    return config;
})


export default steamApi;