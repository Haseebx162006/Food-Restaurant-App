import api from './api';

const adminService = {
    getDashboardStats: async () => {
        const response = await api.get('/orders/stats');
        return response.data;
    },

    getAnalytics: async () => {
        const response = await api.get('/orders/analytics');
        return response.data;
    },

    fetchAllOrders: async (params) => {
        // Note: Documentation says /api/orders for admin
        const response = await api.get('/orders', { params });
        return response.data;
    },

    updateOrderStatus: async (id, status) => {
        const response = await api.patch(`/orders/${id}/status`, { orderStatus: status });
        return response.data;
    },

    // Menu Management for Admin
    createMenuItem: async (itemData) => {
        // Axios handles FormData boundary automatically if Content-Type is NOT set manually
        const response = await api.post('/menu/createitem', itemData);
        return response.data;
    },

    updateMenuItem: async (id, itemData) => {
        // Axios handles FormData boundary automatically if Content-Type is NOT set manually
        const response = await api.put(`/menu/updateitem/${id}`, itemData);
        return response.data;
    },

    deleteMenuItem: async (id) => {
        const response = await api.delete(`/menu/deleteitem/${id}`);
        return response.data;
    },

    toggleMenuAvailability: async (id, availability) => {
        const response = await api.put(`/menu/updateitem/${id}`, { availability });
        return response.data;
    }
};

export default adminService;
