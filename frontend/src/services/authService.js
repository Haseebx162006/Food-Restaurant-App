import api from './api';

const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.success) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    signup: async (userData) => {
        const response = await api.post('/auth/signup', userData);
        if (response.data.success) {
            // Backend uses 'result' for token in register, normalized here
            const token = response.data.token || response.data.result;
            localStorage.setItem('token', token);
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    getCurrentUser: async () => {
        const response = await api.get('/auth/profile');
        return response.data;
    },

    getToken: () => {
        return localStorage.getItem('token');
    },

    updateProfile: async (userData) => {
        const response = await api.put('/auth/profile', userData);
        return response.data;
    }
};

export default authService;
