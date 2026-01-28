import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('parsona_token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifySession = async () => {
            if (token) {
                try {
                    const res = await api.get('/auth/me');
                    if (res.data.success) {
                        setUser(res.data.user);
                        localStorage.setItem('parsona_user', JSON.stringify(res.data.user));
                    }
                } catch (err) {
                    logout();
                }
            }
            setLoading(false);
        };
        verifySession();
    }, [token]);

    const signup = (userData, userToken) => {
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('parsona_user', JSON.stringify(userData));
        localStorage.setItem('parsona_token', userToken);
    };

    const login = (userData, userToken) => {
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('parsona_user', JSON.stringify(userData));
        localStorage.setItem('parsona_token', userToken);
    };

    const refreshUser = (updatedData) => {
        setUser(prev => {
            const newUser = { ...prev, ...updatedData };
            localStorage.setItem('parsona_user', JSON.stringify(newUser));
            return newUser;
        });
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('parsona_user');
        localStorage.removeItem('parsona_token');
    };

    return (
        <AuthContext.Provider value={{ user, token, signup, login, logout, refreshUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
