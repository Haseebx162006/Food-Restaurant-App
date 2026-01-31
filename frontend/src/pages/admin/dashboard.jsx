import React, { useState, useEffect } from 'react';
import adminService from '@/services/adminService';
import StatCard from '@/components/admin/StatCard';
import OrderList from '@/components/admin/OrderList';
import ProtectedRoute from '@/components/ProtectedRoute';
import Spinner from '@/components/common/Spinner';
import { useSocket } from '@/context/SocketContext';
import { toast } from 'react-toastify';
import { ShoppingBag, Users, DollarSign, Activity, Bell } from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        activeUsers: 0
    });
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const { on, off } = useSocket();

    useEffect(() => {
        fetchData();

        on('new-order', (newOrder) => {
            setOrders(prev => [newOrder, ...prev]);
            setStats(prev => ({
                ...prev,
                totalOrders: prev.totalOrders + 1,
                pendingOrders: prev.pendingOrders + 1
            }));
            toast.info('🚀 New order received!', {
                position: "top-right",
                autoClose: 5000,
                icon: Bell
            });
            // Optional: Play sound
            const audio = new Audio('/sounds/notification.mp3');
            audio.play().catch(e => console.log('Audio play failed'));
        });

        return () => off('new-order');
    }, [on, off]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const statsRes = await adminService.getDashboardStats();
            const ordersRes = await adminService.fetchAllOrders();

            if (statsRes.success) setStats(statsRes.stats);
            if (ordersRes.success) setOrders(ordersRes.data);
        } catch (err) {
            toast.error('Failed to load dashboard data');
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

                // Refresh stats from server to ensure trends and counts are 100% accurate
                const statsRes = await adminService.getDashboardStats();
                if (statsRes.success) setStats(statsRes.stats);
            }
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const filteredOrders = filter === 'All'
        ? orders
        : orders.filter(o => o.orderStatus === filter);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="large" /></div>;

    return (
        <ProtectedRoute requiredRole="admin">
            <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h1 className="text-3xl font-heading font-bold text-dark">Admin Dashboard</h1>
                            <p className="text-gray-400">Welcome back! Here's what's happening today.</p>
                        </div>
                        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                            <span className="h-2 w-2 rounded-full bg-success animate-pulse"></span>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Live Updates</span>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingBag} trend={stats.trends?.orders || 0} color="primary" />
                        <StatCard title="Total Revenue" value={`Rs. ${stats.totalRevenue}`} icon={DollarSign} trend={stats.trends?.revenue || 0} color="success" />
                        <StatCard title="Pending Orders" value={stats.pendingOrders} icon={Activity} trend={stats.trends?.pending || 0} color="error" />
                        <StatCard title="Active Customers" value={stats.activeUsers || 0} icon={Users} trend={stats.trends?.users || 0} color="secondary" />
                    </div>

                    {/* Orders Section */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                            <h2 className="text-xl font-heading font-bold text-dark">Recent Orders</h2>
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
                                    </button>
                                ))}
                            </div>
                        </div>

                        <OrderList orders={filteredOrders} onUpdateStatus={handleUpdateStatus} />

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
