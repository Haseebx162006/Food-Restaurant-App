import api from './api';

const orderService = {
    createOrder: async (orderData) => {
        const response = await api.post('/orders', orderData);
        return response.data;
    },

    fetchMyOrders: async () => {
        const response = await api.get('/orders/my-orders');
        return response.data;
    },

    fetchOrderById: async (id) => {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },

    cancelOrder: async (id) => {
        const response = await api.delete(`/orders/${id}`);
        return response.data;
    }
};

export default orderService;
