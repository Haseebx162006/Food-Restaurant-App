/**
 * Invoice Service
 * Handles all invoice-related API calls from the frontend
 */

import api from './api';

const invoiceService = {
    /**
     * Get invoice by order ID
     * Returns invoice data or generates on-the-fly from order if not exists
     * @param {string} orderId - The order ID to get invoice for
     */
    fetchInvoiceByOrderId: async (orderId) => {
        const response = await api.get(`/invoices/order/${orderId}`);
        return response.data;
    },

    /**
     * Get all invoices for the current user
     * Returns list of invoices belonging to the logged-in customer
     */
    fetchMyInvoices: async () => {
        const response = await api.get('/invoices/my-invoices');
        return response.data;
    },

    /**
     * Generate and save invoice for a delivered order
     * Only works for orders with status "Delivered"
     * @param {string} orderId - The order ID to generate invoice for
     */
    generateInvoice: async (orderId) => {
        const response = await api.post(`/invoices/generate/${orderId}`);
        return response.data;
    },

    /**
     * Download invoice as PDF using fetch API
     * This method handles authenticated PDF downloads properly
     * @param {string} orderId - The order ID to download PDF for
     */
    downloadInvoicePDFBlob: async (orderId) => {
        try {
            // Get the token from localStorage
            const token = localStorage.getItem('token');
            const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

            // Use fetch API for better blob handling
            const response = await fetch(`${baseURL}/invoices/download/${orderId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to download PDF');
            }

            // Get the blob from response
            const blob = await response.blob();

            // Create blob URL and trigger download
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `invoice-${orderId}.pdf`;
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            return { success: true };
        } catch (error) {
            console.error('PDF download error:', error);
            throw error;
        }
    }
};

export default invoiceService;
