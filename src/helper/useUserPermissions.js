import React, { createContext, useContext, useState, useEffect } from 'react';
import { GET_USER_PERMISSIONS } from '../features/user-permissions/api';

const useUserPermissions = (permissions) => {
    const [permissionsStatus, setPermissionsStatus] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const response = await GET_USER_PERMISSIONS({ permissions });
                const status = response.data.reduce((acc, item) => {
                    acc[item.name] = item.status;
                    return acc;
                }, {});
                setPermissionsStatus(status);
            } catch (error) {
                console.error("Error fetching user permissions", error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchPermissions();
    }, [permissions]);

    return { permissionsStatus, loading, error };
};

export default useUserPermissions;
