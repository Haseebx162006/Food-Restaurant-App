import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import adminService from '@/services/adminService';
import ProtectedRoute from '@/components/ProtectedRoute';
import Spinner from '@/components/common/Spinner';
import Button from '@/components/common/Button';
import OrderDetails from '@/components/customer/OrderDetails';
import { toast } from 'react-toastify';
import { ArrowLeft, Check, Printer, Download } from 'lucide-react';
import invoiceService from '@/services/invoiceService';
import Link from 'next/link';

export default function AdminOrderDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        if (id) {
            fetchOrder();
        }
    }, [id]);

    const fetchOrder = async () => {
        setIsLoading(true);
        try {
            const response = await adminService.fetchAllOrders({ id }); // Simplified for demo
            // Usually fetchOrderById
            if (response.success && response.data) {
                // Find the specific one if all-orders was called
                const found = Array.isArray(response.data) ? response.data.find(o => o._id === id || o.orderId === id) : response.data;
                setOrder(found);
            }
        } catch (err) {
            toast.error('Failed to load order details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (status) => {
        try {
            const response = await adminService.updateOrderStatus(order._id, status);
            if (response.success) {
                setOrder({ ...order, orderStatus: status });
                toast.success(`Status updated to ${status}`);
            }
        } catch (err) {
            toast.error('Update failed');
        }
    };

    const handleDownloadPDF = async () => {
        if (!order) return;
        setIsDownloading(true);
        try {
            await invoiceService.downloadInvoicePDFBlob(order._id);
            toast.success('Invoiced downloaded successfully');
        } catch (err) {
            toast.error('Failed to download invoice');
        } finally {
            setIsDownloading(false);
        }
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="large" /></div>;

    if (!order) return <div className="text-center py-20">Order not found</div>;

    return (
        <ProtectedRoute requiredRole="admin">
            <div className="bg-gray-50 min-h-screen py-12 px-4 print:bg-white print:py-0 print:px-0">
                <div className="max-w-4xl mx-auto print:max-w-none">
                    <div className="flex justify-between items-center mb-8 print:hidden">
                        <Link href="/admin/dashboard" className="flex items-center text-secondary font-bold hover:text-primary transition-colors group">
                            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
                            Back to Dashboard
                        </Link>
                        <div className="flex space-x-3">
                            <Button variant="outline" size="sm" onClick={() => window.print()}>
                                <Printer size={16} className="mr-2" />
                                Print Receipt
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleDownloadPDF}
                                disabled={isDownloading}
                            >
                                <Download size={16} className="mr-2" />
                                {isDownloading ? 'Downloading...' : 'Download PDF'}
                            </Button>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 print:hidden">
                        <h2 className="text-xl font-heading font-bold text-dark mb-6 tracking-tight">Manage Order Status</h2>
                        <div className="flex flex-wrap gap-3">
                            {['Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => handleUpdateStatus(s)}
                                    className={`flex items-center space-x-2 px-6 py-2 rounded-xl text-xs font-bold transition-all border-2 ${order.orderStatus === s
                                        ? 'bg-primary border-primary text-white shadow-lg'
                                        : 'bg-white border-gray-100 text-gray-400 hover:border-primary hover:text-primary'
                                        }`}
                                >
                                    {order.orderStatus === s && <Check size={14} />}
                                    <span>{s}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <OrderDetails order={order} />
                </div>
            </div>
        </ProtectedRoute>
    );
}
