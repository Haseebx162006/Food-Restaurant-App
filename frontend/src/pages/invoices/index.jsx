/**
 * Invoices List Page
 * Displays all invoices for the current logged-in user
 * Allows viewing and downloading each invoice
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import Spinner from '@/components/common/Spinner';
import Button from '@/components/common/Button';
import orderService from '@/services/orderService';
import invoiceService from '@/services/invoiceService';
import { toast } from 'react-toastify';
import { FileText, Download, Eye, ArrowLeft, Receipt } from 'lucide-react';

export default function InvoicesList() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState(null);

    // Fetch user's orders on component mount
    useEffect(() => {
        fetchOrders();
    }, []);

    /**
     * Fetch all orders for the current user
     * Invoices are generated from orders
     */
    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const response = await orderService.fetchMyOrders();
            if (response.success) {
                setOrders(response.data);
            }
        } catch (err) {
            toast.error('Failed to load invoices');
            console.error('Fetch orders error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handle PDF download for a specific order
     * @param {string} orderId - Order ID to download invoice for
     */
    const handleDownload = async (orderId) => {
        setDownloadingId(orderId);
        try {
            await invoiceService.downloadInvoicePDFBlob(orderId);
            toast.success('Invoice downloaded successfully');
        } catch (err) {
            toast.error('Failed to download invoice');
            console.error('Download error:', err);
        } finally {
            setDownloadingId(null);
        }
    };

    /**
     * Format date to readable string
     * @param {string} dateString - ISO date string
     */
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    /**
     * Get status badge color based on order status
     * @param {string} status - Order status
     */
    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered':
                return 'bg-green-100 text-green-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Preparing':
                return 'bg-blue-100 text-blue-800';
            case 'Ready':
                return 'bg-purple-100 text-purple-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header Section */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center">
                            <Link
                                href="/profile"
                                className="mr-4 text-gray-500 hover:text-primary transition-colors"
                            >
                                <ArrowLeft size={24} />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-heading font-bold text-dark">
                                    My Invoices
                                </h1>
                                <p className="text-gray-500 mt-1">
                                    View and download your order invoices
                                </p>
                            </div>
                        </div>
                        <Receipt size={48} className="text-primary opacity-50" />
                    </div>

                    {/* Loading State */}
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Spinner size="large" />
                        </div>
                    ) : orders.length === 0 ? (
                        /* Empty State */
                        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                            <FileText size={64} className="mx-auto text-gray-300 mb-4" />
                            <h2 className="text-xl font-bold text-dark mb-2">
                                No Invoices Yet
                            </h2>
                            <p className="text-gray-500 mb-6">
                                You haven't placed any orders yet. Start ordering to see your invoices here.
                            </p>
                            <Link href="/menu">
                                <Button>Browse Menu</Button>
                            </Link>
                        </div>
                    ) : (
                        /* Invoices Table */
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200">
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                Invoice
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                Items
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                Total
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {orders.map((order) => (
                                            <tr
                                                key={order._id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                {/* Invoice ID */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <FileText size={20} className="text-primary mr-3" />
                                                        <div>
                                                            <p className="font-bold text-dark">
                                                                INV-{order.orderId}
                                                            </p>
                                                            <p className="text-xs text-gray-400">
                                                                Order #{order.orderId}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Date */}
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {formatDate(order.createdAt)}
                                                </td>

                                                {/* Items Count */}
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {order.items?.length || 0} items
                                                </td>

                                                {/* Total Amount */}
                                                <td className="px-6 py-4">
                                                    <span className="font-bold text-dark">
                                                        Rs. {order.grandTotal}
                                                    </span>
                                                </td>

                                                {/* Status Badge */}
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                                                        {order.orderStatus}
                                                    </span>
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-end space-x-2">
                                                        {/* View Invoice */}
                                                        <Link href={`/invoices/${order._id}`}>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="flex items-center"
                                                            >
                                                                <Eye size={16} className="mr-1" />
                                                                View
                                                            </Button>
                                                        </Link>

                                                        {/* Download PDF */}
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleDownload(order._id)}
                                                            disabled={downloadingId === order._id}
                                                            className="flex items-center"
                                                        >
                                                            <Download size={16} className="mr-1" />
                                                            {downloadingId === order._id ? 'Downloading...' : 'PDF'}
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Footer */}
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                <p className="text-sm text-gray-500">
                                    Showing {orders.length} invoice{orders.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
