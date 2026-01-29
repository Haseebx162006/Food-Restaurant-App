import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = authService.getToken();
            if (storedToken) {
                setToken(storedToken);
                try {
                    const response = await authService.getCurrentUser();
                    if (response && response._id) {
                        setUser(response);
                        setIsAuthenticated(true);
                    } else {
                        authService.logout();
                        setIsAuthenticated(false);
                    }
                } catch (err) {
                    console.error('Failed to fetch user:', err);
                    authService.logout();
                    setIsAuthenticated(false);
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await authService.login(email, password);
            if (data.success) {
                setToken(data.token);
                const userResponse = await authService.getCurrentUser();
                setUser(userResponse);
                setIsAuthenticated(true);
                router.push(userResponse?.role === 'admin' ? '/admin/dashboard' : '/menu');
                return { success: true };
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            return { success: false, message: err.response?.data?.message || 'Login failed' };
        } finally {
            setIsLoading(false);
        }
    };

    const signup = async (userData) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await authService.signup(userData);
            if (data.success) {
                const newToken = data.token || data.result;
                setToken(newToken);
                localStorage.setItem('token', newToken); // Ensure token is in storage for getCurrentUser
                const userResponse = await authService.getCurrentUser();
                setUser(userResponse);
                setIsAuthenticated(true);
                router.push('/menu');
                return { success: true };
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Sign up failed');
            return { success: false, message: err.response?.data?.message || 'Sign up failed' };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
        router.push('/login');
    };

    const updateProfile = async (userData) => {
        // This endpoint wasn't explicitly in the backend list but was in frontend requirements
        // For now, we'll assume it exists or will be added.
        try {
            const response = await authService.updateProfile(userData);
            if (response.success) {
                setUser(response.user);
                return { success: true };
            }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Update failed' };
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                isAuthenticated,
                error,
                login,
                signup,
                logout,
                updateProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
