import api from './api';

const menuService = {
    fetchAllMenuItems: async (params) => {
        const response = await api.get('/menu/getallitems', { params });
        return response.data;
    },

    fetchMenuItemById: async (id) => {
        const response = await api.get(`/menu/getSingleitem/${id}`);
        return response.data;
    },

    filterByCategory: async (category) => {
        const response = await api.get('/menu/getbycategory', { params: { category } });
        return response.data;
    },

    searchMenuItems: async (query) => {
        const response = await api.get('/menu/getallitems', { params: { search: query } });
        return response.data;
    }
};

export default menuService;
