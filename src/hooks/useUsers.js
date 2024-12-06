import React from 'react';
import useSWR from 'swr';
import steamApi from '../api/steamApi';
import Cookies from 'js-cookie';

    
    //Obtener usuarios con SWR
    const fetcher = async ([url, token]) => {
        try {
          const response = await steamApi.post(
            url,
            { limit: 10, offset: 0 },
            { headers: { Authorization: `${token}` } }
          );
          return response.data.users;
  
        } catch (error) {
          console.error("Error al obtener usuarios:", error);
          throw error; 
        }
    };
    
    
      export const useUsers = () => { 
        const accessToken = Cookies.get('access_token');
        const {data: users, error, isLoading } = useSWR(
        accessToken ? ['/users/get-users', accessToken] : null,
        fetcher
    );
    return { users, error, isLoading };
}
