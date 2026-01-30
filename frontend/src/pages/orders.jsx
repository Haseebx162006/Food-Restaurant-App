import React, { useState, useEffect } from 'react';
import orderService from '@/services/orderService';
import ProtectedRoute from '@/components/ProtectedRoute';
import Spinner from '@/components/common/Spinner';
import Link from 'next/link';
import { Package, ChevronRight, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const response = await orderService.fetchMyOrders();
            if (response.success) {
                setOrders(response.data);
            }
        } catch (err) {
            console.error('Failed to load orders:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered':
                return <CheckCircle className="text-success" size={20} />;
            case 'Cancelled':
                return <XCircle className="text-error" size={20} />;
            default:
                return <Clock className="text-primary" size={20} />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered':
                return 'bg-success/10 text-success';
            case 'Cancelled':
                return 'bg-error/10 text-error';
            default:
                return 'bg-primary/10 text-primary';
        }
    };

    if (isLoading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen flex items-center justify-center">
                    <Spinner size="large" />
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="bg-gray-50 min-h-screen py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex items-center mb-8">
                        <div className="bg-red-50 p-3 rounded-2xl mr-4 text-primary">
                            <Package size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-heading font-bold text-dark">My Orders</h1>
                            <p className="text-gray-400">Track all your orders here</p>
                        </div>
                    </div>

                    {orders.length === 0 ? (
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
                            <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Package className="text-primary" size={36} />
                            </div>
                            <h2 className="text-xl font-heading font-bold text-dark mb-2">No orders yet</h2>
                            <p className="text-gray-400 mb-6">Start ordering delicious food!</p>
                            <Link href="/menu" className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-red-600 transition-colors">
                                Browse Menu
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <Link key={order._id} href={`/order/${order._id}`}>
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all cursor-pointer group">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="bg-gray-50 p-3 rounded-xl">
                                                    {getStatusIcon(order.orderStatus)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-dark">Order #{order.orderId}</p>
                                                    <p className="text-sm text-gray-400">
                                                        {new Date(order.createdAt).toLocaleDateString()} • {order.items?.length || 0} items
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <div className="text-right">
                                                    <p className="font-bold text-dark">Rs. {order.grandTotal}</p>
                                                    <span className={`text-xs px-3 py-1 rounded-full font-bold ${getStatusColor(order.orderStatus)}`}>
                                                        {order.orderStatus}
                                                    </span>
                                                </div>
                                                <ChevronRight className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" size={24} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
