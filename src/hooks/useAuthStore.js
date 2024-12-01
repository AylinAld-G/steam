//Este hook tiene como objetivo realizar cualquier interacción con la parte del Auth en nuestro Store
import { useDispatch, useSelector } from 'react-redux';
import steamApi  from '../api/steamApi';
import { clearErrorMessage, onDeleteUser, onGetUsers, onLogin, onLogout, onRegister, onSetRegistrationData, onUpdateUser } from '../store/auth/authSlice';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';


export const useAuthStore = () => {

    const { status,user, registrationData, errorMessage } = useSelector( state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            dispatch(onLogin(storedUser));
        }
    }, [dispatch]);


    const startLogin = async({ username, password }) => {
        try {
            const {data} = await steamApi.post('/users/auth/login', {username, password}, {withCredentials: true});
            console.log(data)

            const token = jwtDecode( data.access_token)
            console.log(token)

            if (data.access_token) {
                Cookies.set('access_token', data.access_token, {path:'/', secure: true, sameSite: 'none'});
            } 

            const rol_id = token.role
            const rolName = await getRoleName()

            localStorage.setItem('user', JSON.stringify({
                username: username || registrationData.username,
                uid: data.uuid || registrationData.uuid,
                verified: true,
                role: rol_id,
                role_name: rolName
            }));

            if(registrationData){
                dispatch(onLogin({
                    username: username || registrationData.username, 
                    uid: data.uuid || registrationData.uuid,
                    verified: true,
                    role: rol_id,
                    role_name: rolName
                 }))
            }else{
                dispatch(onLogin({username: username, uid: data.uuid, verified: true, role: rol_id, role_name: rolName}))
            }
           
            navigate('/', { replace: true })
            console.log(username)

        } catch (error) {
            dispatch( onLogout('Credenciales incorrectas'));
            setTimeout(() => {
                dispatch(clearErrorMessage());
            }, 10);
        }
    }

    const startRegister = async({username, email, password}) => {
        dispatch(onRegister());
        try {
            const {data} = await steamApi.post('/users/auth', { username, email, password});
            console.log(data)

            const roles = await getRoles()
            const role = roles.find(r => r.id === data.role_id);
            const role_name = role ? role.name : 'Unknown';


            dispatch(onSetRegistrationData({ username: data.username, uid: data.uuid, email: data.email, password: data.password, verified: true, role: data.role_id, role_name}));

            localStorage.setItem('user', JSON.stringify({
                username: data.username,
                uid: data.uuid,
                verified: true,
                role: data.role_id,
                role_name
            }));

            navigate(`/users/${data.uuid}/redeem-code`, { replace: true });

        } catch (error) {
            //dispatch( onLogout(error.response.data?.msg || '--'));
            console.log('Error during registration ', error);
            const errorMessage = error.response?.data?.msg || 'Registration failed';
            Swal.fire('Error', errorMessage, 'error');
            dispatch( onLogout() );
            setTimeout(() => {
                dispatch(clearErrorMessage());
            }, 10);
        }
    }

    const getUsers = async ({ searchStr, limit, offset }) => {
        try {  
            const accessToken = Cookies.get('access_token')
            const data = {
                search_str: searchStr,
                limit: limit,
                offset: offset,
            };
            const response = await steamApi.post('/users/get-users', data, { headers: {Authorization: `${accessToken}`}});
            const users = response.data;
            dispatch(onGetUsers(users));
            return users

        } catch (error) {
            console.log(error);
            Swal.fire('Error al obtener usuarios', error.msg, 'error');
        }
    }


    const startLogout = () => {
        localStorage.removeItem('user');
        Cookies.remove('access_token');
        dispatch( onLogout() );
    }


    const deleteUser = async(uuid) => {
        try {
            const accessToken = Cookies.get('access_token')
            const {data} = await steamApi.delete(`/users/delete/${uuid}`, {headers: {Authorization: `${accessToken}`}});
            dispatch( onDeleteUser() );
            Swal.fire('Usuario eliminado', 'El usuario ha sido eliminado exitosamente', 'success');

        } catch (error) {
            console.log(error);
            Swal.fire('Error al eliminar', error.response.data.msg, 'error');
        }

    }

    const updateUser = async(uuid, userData) => {
        try {
            const accessToken = Cookies.get('access_token')
            const {data} = await steamApi.post(`/users/update/${uuid}`, userData, {headers: {Authorization: `${accessToken}`}});
            dispatch( onUpdateUser());
            Swal.fire('Usuario actualizado', 'El usuario ha sido actualizado exitosamente', 'success');

        } catch (error) {
            console.log(error);
            Swal.fire('Error al actualizar', error.response.data.msg, 'error');
        }
    }

    
    const checkVerificationCode = async ({uuid, code}) => {

        if(!uuid){
            console.error('UID is undefined')
            return false;
        }
        try {
            const response = await steamApi.post(`/users/${uuid}/redeem-code`, { code });
            //const userData = response.data;

            if (response.status === 200 ) {
                dispatch(onLogin({ username: registrationData.username, uid: uuid, email: registrationData.email, password: registrationData.password, verified: true }));
                navigate('/', { replace: true }) 
                
            }

        } catch (error) {
            const errorMessage = error.response?.data?.msg || 'Error en la verificación'
            console.error(errorMessage);
            Swal.fire('Código no válido', errorMessage, 'error');
        }
      };


    const getRoles = async () => {
        try {
            const {data} = await steamApi.get("/users/roles");
            const rawRoles = data.items
            const roles = rawRoles.map(role => {
                const roleName = Object.keys(role)[0]; // El nombre del rol es la clave
                const roleId = role[roleName];         // El role_id es el valor
                return { name: roleName, id: roleId }; 
            });
            return roles;
            
        } catch (error) {

            console.error("Error al obtener roles:", error);
            throw error;
        }
    }

    const getRoleName = async () => {
        
        try{
            const accessToken = Cookies.get('access_token');
            const response = await steamApi.get('/users/roles/get-role', {withCredentials: true, headers: {Authorization: `${accessToken}`}},);
            console.log(response)
            const {user_role} = response.data;

            return user_role || 'Unknown';

        }catch(error){
            console.error('Error al obtener nombre de rol', error);
            return 'Unknown'
        }
    }



    return {
        //Properties
        status, 
        user,
        errorMessage,

        //Métodos
        startLogin,
        startRegister,
        getRoleName,
        getUsers,
        getRoles,
        deleteUser,
        updateUser,
        checkVerificationCode,
        startLogout
    }
}
