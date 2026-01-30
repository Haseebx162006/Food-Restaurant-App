import React, { useState, useEffect } from 'react';
import adminService from '@/services/adminService';
import OrderList from '@/components/admin/OrderList';
import ProtectedRoute from '@/components/ProtectedRoute';
import Spinner from '@/components/common/Spinner';
import { useSocket } from '@/context/SocketContext';
import { toast } from 'react-toastify';
import { ShoppingBag, Bell, RefreshCw } from 'lucide-react';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const { on, off } = useSocket();

    useEffect(() => {
        fetchOrders();

        // Listen for new orders in real-time
        on('new-order', (newOrder) => {
            setOrders(prev => [newOrder, ...prev]);
            toast.info('🚀 New order received!', { position: "top-right" });
        });

        return () => off('new-order');
    }, [on, off]);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const response = await adminService.fetchAllOrders();
            if (response.success) {
                setOrders(response.data);
            }
        } catch (err) {
            toast.error('Failed to load orders');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            const response = await adminService.updateOrderStatus(id, status);
            if (response.success) {
                setOrders(prev => prev.map(o => o._id === id ? { ...o, orderStatus: status } : o));
                toast.success(`Order status updated to ${status}`);
            }
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const filteredOrders = filter === 'All'
        ? orders
        : orders.filter(o => o.orderStatus === filter);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="large" />
            </div>
        );
    }

    return (
        <ProtectedRoute requiredRole="admin">
            <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h1 className="text-3xl font-heading font-bold text-dark">Order Management</h1>
                            <p className="text-gray-400">View and manage all customer orders</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={fetchOrders}
                                className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 text-gray-500 hover:text-primary transition-colors"
                            >
                                <RefreshCw size={16} />
                                <span className="text-sm font-bold">Refresh</span>
                            </button>
                            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                                <span className="h-2 w-2 rounded-full bg-success animate-pulse"></span>
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Live</span>
                            </div>
                        </div>
                    </div>

                    {/* Orders Card */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Filter Tabs */}
                        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center space-x-3">
                                <ShoppingBag className="text-primary" size={24} />
                                <h2 className="text-xl font-heading font-bold text-dark">All Orders</h2>
                                <span className="bg-gray-100 text-secondary text-xs font-bold px-3 py-1 rounded-full">
                                    {orders.length} Total
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {['All', 'Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setFilter(s)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filter === s
                                            ? 'bg-secondary text-white'
                                            : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                            }`}
                                    >
                                        {s}
                                        {s !== 'All' && (
                                            <span className="ml-1 opacity-50">
                                                ({orders.filter(o => o.orderStatus === s).length})
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Orders List */}
                        <OrderList orders={filteredOrders} onUpdateStatus={handleUpdateStatus} />

                        {/* Empty State */}
                        {filteredOrders.length === 0 && (
                            <div className="py-20 text-center text-gray-400">
                                <ShoppingBag size={48} className="mx-auto mb-4 opacity-10" />
                                <p>No {filter !== 'All' ? filter.toLowerCase() : ''} orders found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
