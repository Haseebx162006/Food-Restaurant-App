import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import orderService from '@/services/orderService';
import OrderStatusTimeline from '@/components/customer/OrderStatusTimeline';
import OrderDetails from '@/components/customer/OrderDetails';
import ProtectedRoute from '@/components/ProtectedRoute';
import Spinner from '@/components/common/Spinner';
import Button from '@/components/common/Button';
import { useSocket } from '@/context/SocketContext';
import { toast } from 'react-toastify';
import { Package, ArrowLeft, Download, X } from 'lucide-react';
import Link from 'next/link';

export default function OrderTracking() {
    const router = useRouter();
    const { orderId } = router.query;
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { on, off, emit } = useSocket();

    useEffect(() => {
        if (orderId) {
            fetchOrder();

            // Join order room for updates
            emit('customer-join-order', { orderId });

            // Listen for status updates
            on('order-status-updated', (data) => {
                if (data.orderId === orderId || (order && data.orderId === order._id)) {
                    setOrder(prev => ({ ...prev, orderStatus: data.status }));
                    toast.info(`Order status updated to: ${data.status}`);
                }
            });

            return () => {
                off('order-status-updated');
            };
        }
    }, [orderId, on, off, emit]);

    const fetchOrder = async () => {
        setIsLoading(true);
        try {
            const response = await orderService.fetchOrderById(orderId);
            if (response.success) {
                setOrder(response.data);
            }
        } catch (err) {
            toast.error('Failed to load order details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;

        try {
            const response = await orderService.cancelOrder(order._id);
            if (response.success) {
                toast.success('Order cancelled');
                fetchOrder();
            }
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to cancel order');
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Spinner size="large" />
        </div>
    );

    if (!order) return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-4">Order not found</h2>
            <Link href="/menu" className="btn-primary">Browse Menu</Link>
        </div>
    );

    const canCancel = ['Pending', 'Preparing'].includes(order.orderStatus);

    return (
        <ProtectedRoute>
            <div className="bg-gray-50 min-h-screen py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <Link href="/menu" className="flex items-center text-secondary font-bold hover:text-primary transition-colors group">
                            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
                            Continue Shopping
                        </Link>
                        <div className="flex space-x-3">
                            {order.orderStatus === 'Delivered' && (
                                <Button variant="outline" size="sm" onClick={() => router.push(`/invoices/${order._id}`)}>
                                    <Download size={16} className="mr-2" />
                                    Invoice
                                </Button>
                            )}
                            {canCancel && (
                                <Button variant="danger" size="sm" onClick={handleCancelOrder}>
                                    <X size={16} className="mr-2" />
                                    Cancel Order
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
                        <div className="flex items-center mb-10">
                            <div className="bg-red-50 p-3 rounded-2xl mr-4 text-primary">
                                <Package size={32} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-heading font-bold text-dark">Track Your Order</h1>
                                <p className="text-gray-400 text-sm">Real-time status of your meal</p>
                            </div>
                        </div>

                        <OrderStatusTimeline currentStatus={order.orderStatus} />
                    </div>

                    <OrderDetails order={order} />
                </div>
            </div>
        </ProtectedRoute>
    );
}
