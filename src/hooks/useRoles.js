import React from 'react';
import useSWR from 'swr';
import steamApi from '../api/steamApi';

    
    const fetchRoles = async (url) => {
      try {
        const { data } = await steamApi.get(url);
        const rawRoles = data.items;
        return rawRoles.map(role => {
          const roleName = Object.keys(role)[0];
          const roleId = role[roleName];
          return { name: roleName, id: roleId };
        });
      } catch (error) {
        console.error("Error al obtener roles:", error);
        throw error;
      }
    };
    
    export const useRoles = () => {
      const { data: roles, error: rolesError, isLoading: rolesLoading } = useSWR('/users/roles', fetchRoles);
      return { roles, rolesError, rolesLoading };
    };


