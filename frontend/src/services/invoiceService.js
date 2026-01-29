import api from './api';

const invoiceService = {
    fetchMyInvoices: async () => {
        const response = await api.get('/invoices');
        return response.data;
    },

    fetchInvoiceByOrderId: async (orderId) => {
        // Note: Documentation says /api/invoices/:id
        // But usually we generate it from orderId
        const response = await api.get(`/invoices/${orderId}`);
        return response.data;
    },

    downloadInvoicePDF: async (invoiceId) => {
        // API endpoint for PDF download
        const response = await api.get(`/invoices/${invoiceId}/download`, {
            responseType: 'blob'
        });
        return response.data;
    }
};

export default invoiceService;
