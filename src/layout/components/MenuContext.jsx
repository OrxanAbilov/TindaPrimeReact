import React, { createContext, useContext, useEffect, useState } from 'react';
import { GET_USER_MENUS } from '../../features/layout/services/api';

const MenuContext = createContext();

export const useMenu = () => {
    return useContext(MenuContext);
};

export const MenuProvider = ({ children }) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const res = await GET_USER_MENUS();
                setData(res.data);
                setError(false);
            } catch (error) {
                setError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <MenuContext.Provider value={{ data, isLoading, error }}>
            {children}
        </MenuContext.Provider>
    );
};