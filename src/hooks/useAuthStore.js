//Este hook tiene como objetivo realizar cualquier interacción con la parte del Auth en nuestro Store
import { useDispatch, useSelector } from 'react-redux';
import steamApi  from '../api/steamApi';
import { clearErrorMessage, onLogin, onLogout, onRegister } from '../store/auth/authSlice';

export const useAuthStore = () => {

    const { status,user, errorMessage } = useSelector( state => state.auth);
    const dispatch = useDispatch();

    const startLogin = async({ username, password }) => {

        try {
            
            const {data} = await steamApi.post('/auth/login', {username, password});
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime() );
            dispatch(onLogin({ username: data.username, uid: data.uid}));
            console.log(username)

        } catch (error) {
            dispatch( onLogout('Credenciales incorrectas'));
            setTimeout(() => {
                dispatch(clearErrorMessage());
            }, 10);
        }
    }

    const startRegister = async({username, password}) => {
        dispatch(onRegister());

        try {
            
            const {data} = await steamApi.post('/auth', { username, password});
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime() );
            dispatch(onLogin({ username: data.username, uid: data.uid}));
            console.log(username)

        } catch (error) {
            //dispatch( onLogout(error.response.data?.msg || '--'));
            dispatch( onLogout() );
            setTimeout(() => {
                dispatch(clearErrorMessage());
            }, 10);
        }
    }


    const startLogout = () => {
        localStorage.clear();
        dispatch( onLogout() );
    }


    return {
        //Properties
        status, 
        user,
        errorMessage,

        //Métodos
        startLogin,
        startRegister,
        startLogout
    }
}