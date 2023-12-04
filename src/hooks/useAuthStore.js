//Este hook tiene como objetivo realizar cualquier interacción con la parte del Auth en nuestro Store
import { useDispatch, useSelector } from 'react-redux';
import steamApi  from '../api/steamApi';
import { clearErrorMessage, onDeleteUser, onGetUsers, onLogin, onLogout, onRegister, onUpdateUser } from '../store/auth/authSlice';
import Swal from 'sweetalert2';


export const useAuthStore = () => {

    const { status,user, errorMessage } = useSelector( state => state.auth);
    const dispatch = useDispatch();

    const startLogin = async({ username, password }) => {
        try {
            const {data} = await steamApi.post('/auth/login', {username, password});
            dispatch(onLogin({username: data.username, uid: data.uuid}))
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
            
            const {data} = await steamApi.post('/auth', { username, email, password});
            //dispatch(onLogin({ username: data.username, uid: data.uuid}));
            console.log(username)

        } catch (error) {
            //dispatch( onLogout(error.response.data?.msg || '--'));
            Swal.fire('Error', error.response.data.msg, 'error');
            dispatch( onLogout() );
            setTimeout(() => {
                dispatch(clearErrorMessage());
            }, 10);
        }
    }

    const getUsers = async ({ searchStr, limit, offset }) => {
        try {  
            const response = await steamApi.get('/users', { params: {
                search_str: searchStr,
                limit: limit,
                offset: offset,
              }});
            const users = response.data.users;
            dispatch(onGetUsers(users));

        } catch (error) {
            console.log(error);
            Swal.fire('Error al obtener usuarios', error.response.data.msg, 'error');
        }
    }


    const startLogout = () => {
        localStorage.clear();
        dispatch( onLogout() );
    }


    const deleteUser = async(uuid) => {
        try {
            const {data} = await steamApi.delete(`users/delete/${uuid}`);
            dispatch( onDeleteUser() );
            Swal.fire('Usuario eliminado', 'El usuario ha sido eliminado exitosamente', 'success');

        } catch (error) {
            console.log(error);
            Swal.fire('Error al eliminar', error.response.data.msg, 'error');
        }

    }

    const updateUser = async(uuid, userData) => {
        try {
            const {data} = await steamApi.post(`/users/update/${uuid}`, userData);
            dispatch( onUpdateUser());
            Swal.fire('Usuario actualizado', 'El usuario ha sido actualizado exitosamente', 'success');

        } catch (error) {
            console.log(error);
            Swal.fire('Error al actualizar', error.response.data.msg, 'error');
        }
    }

    
    const checkVerificationCode = async ({email, code}) => {
        try {
            const {data} = await steamApi.post(`/${data.user_uuid}/redeem-code`, { code });

            if (data.isValid) {
                console.log('Código válido');
                dispatch(onLogin({ username: data.username, uid: data.uuid }));
                Swal.fire('Código válido', error.response.data.msg, 'success');
                
              } else {
                console.log('Código no válido');
                Swal.fire('Código no válido', error.response.data.msg, 'error');
              }

        } catch (error) {
          console.error(error.response.data.msg);
        }
      };


      const getRoles = async () => {
        try {
          const response = await steamApi.get("/roles");
          const roles = response.data.roles;

          console.log("Roles:", roles);
      
          return roles;
        } catch (error) {

          console.error("Error al obtener roles:", error);
          throw error;
        }
      };



    return {
        //Properties
        status, 
        user,
        errorMessage,

        //Métodos
        startLogin,
        startRegister,
        getUsers,
        getRoles,
        deleteUser,
        updateUser,
        checkVerificationCode,
        startLogout
    }
}
