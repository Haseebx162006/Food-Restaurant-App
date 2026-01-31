import React, { useState, useEffect } from 'react';
import adminService from '@/services/adminService';
import ProtectedRoute from '@/components/ProtectedRoute';
import Spinner from '@/components/common/Spinner';
import { toast } from 'react-toastify';
import { BarChart3, TrendingUp, PieChart, Calendar, Package, DollarSign, RefreshCw } from 'lucide-react';

// Color palette for categories
const categoryColors = {
    'Fast Food': { bg: 'bg-primary', text: 'text-primary', light: 'bg-primary/20' },
    'Main Course': { bg: 'bg-secondary', text: 'text-secondary', light: 'bg-secondary/20' },
    'Drinks': { bg: 'bg-success', text: 'text-success', light: 'bg-success/20' },
    'Desserts': { bg: 'bg-yellow-500', text: 'text-yellow-500', light: 'bg-yellow-100' },
    'Snacks': { bg: 'bg-purple-500', text: 'text-purple-500', light: 'bg-purple-100' },
    'Unknown': { bg: 'bg-gray-400', text: 'text-gray-400', light: 'bg-gray-100' }
};

const getColorForCategory = (category) => {
    return categoryColors[category] || categoryColors['Unknown'];
};

export default function AdminStats() {
    const [isLoading, setIsLoading] = useState(true);
    const [analytics, setAnalytics] = useState({
        revenueByDay: [],
        categoryDistribution: [],
        topSellingItems: [],
        salesToday: 0
    });

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        setIsLoading(true);
        try {
            const response = await adminService.getAnalytics();
            if (response.success) {
                setAnalytics(response.analytics);
            }
        } catch (err) {
            toast.error('Failed to load analytics data');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate max revenue for bar chart scaling
    const maxRevenue = Math.max(...analytics.revenueByDay.map(d => d.revenue), 1);

    // Format date for display
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    };

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
                            <h1 className="text-3xl font-heading font-bold text-dark">Statistics & Reports</h1>
                            <p className="text-gray-400">Deep dive into your restaurant's performance.</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={fetchAnalytics}
                                className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 text-gray-500 hover:text-primary transition-colors"
                            >
                                <RefreshCw size={16} />
                                <span className="text-sm font-bold">Refresh</span>
                            </button>
                            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                                <Calendar size={18} className="text-primary" />
                                <span className="text-sm font-bold text-dark">Last 7 Days</span>
                            </div>
                        </div>
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Revenue Growth Chart */}
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                            <div className="flex justify-between items-start mb-8">
                                <h3 className="text-lg font-bold text-dark flex items-center">
                                    <TrendingUp size={20} className="mr-3 text-success" />
                                    Revenue Growth (Last 7 Days)
                                </h3>
                                {analytics.trends?.revenue !== undefined && (
                                    <div className={`px-3 py-1 rounded-full text-xs font-black flex items-center ${analytics.trends.revenue >= 0 ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                                        {analytics.trends.revenue >= 0 ? '+' : ''}{analytics.trends.revenue}%
                                    </div>
                                )}
                            </div>

                            {analytics.revenueByDay.length > 0 ? (
                                <div className="h-64 flex items-end justify-between space-x-2">
                                    {analytics.revenueByDay.map((day, i) => (
                                        <div key={i} className="flex flex-col items-center w-full">
                                            <div
                                                className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-lg transition-all duration-500 group hover:from-secondary hover:to-secondary/60 cursor-pointer relative min-h-[8px]"
                                                style={{ height: `${Math.max((day.revenue / maxRevenue) * 100, 5)}%` }}
                                            >
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-dark text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                    Rs. {day.revenue.toLocaleString()}
                                                </div>
                                            </div>
                                            <span className="text-[10px] text-gray-400 mt-2 font-bold">
                                                {formatDate(day._id)}
                                            </span>
                                            <span className="text-[8px] text-gray-300">
                                                {day.orders} orders
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-64 flex items-center justify-center text-gray-400">
                                    <div className="text-center">
                                        <BarChart3 size={48} className="mx-auto mb-2 opacity-20" />
                                        <p>No revenue data available</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Category Distribution */}
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-bold text-dark mb-8 flex items-center">
                                <PieChart size={20} className="mr-3 text-secondary" />
                                Category Distribution
                            </h3>

                            {analytics.categoryDistribution.length > 0 ? (
                                <div className="flex items-center justify-center">
                                    {/* Pie Chart Visual */}
                                    <div className="relative w-48 h-48 mr-8">
                                        <div
                                            className="w-full h-full rounded-full"
                                            style={{
                                                background: `conic-gradient(${analytics.categoryDistribution.map((cat, i) => {
                                                    const colors = ['#E63946', '#2D3436', '#27AE60', '#F1C40F', '#9B59B6', '#95A5A6'];
                                                    const startPercent = analytics.categoryDistribution.slice(0, i).reduce((sum, c) => sum + c.percent, 0);
                                                    return `${colors[i % colors.length]} ${startPercent}% ${startPercent + cat.percent}%`;
                                                }).join(', ')})`
                                            }}
                                        >
                                            <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center">
                                                <span className="text-2xl font-bold text-dark">{analytics.salesToday}</span>
                                                <span className="text-[10px] text-gray-400 uppercase font-black">Sales Today</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Legend */}
                                    <div className="space-y-3">
                                        {analytics.categoryDistribution.map((cat, idx) => {
                                            const colors = getColorForCategory(cat.category);
                                            return (
                                                <div key={idx} className="flex items-center space-x-3">
                                                    <div className={`h-3 w-3 rounded-full ${colors.bg}`}></div>
                                                    <span className="text-xs text-dark font-medium w-24">{cat.category}</span>
                                                    <span className="text-xs text-gray-400 font-bold">{cat.percent}%</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="h-48 flex items-center justify-center text-gray-400">
                                    <div className="text-center">
                                        <PieChart size={48} className="mx-auto mb-2 opacity-20" />
                                        <p>No category data available</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Top Selling Items */}
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-dark mb-6 flex items-center">
                            <BarChart3 size={20} className="mr-3 text-primary" />
                            Top Selling Items
                        </h3>

                        {analytics.topSellingItems.length > 0 ? (
                            <div className="space-y-6">
                                {analytics.topSellingItems.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between group hover:bg-gray-50 p-3 rounded-xl transition-colors">
                                        <div className="flex items-center space-x-4">
                                            <div className={`h-12 w-12 flex items-center justify-center rounded-xl font-bold text-white ${idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' : idx === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' : idx === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                                                #{idx + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-dark">{item._id}</p>
                                                <p className="text-xs text-gray-400 flex items-center">
                                                    <Package size={12} className="mr-1" />
                                                    {item.sales} units sold
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-primary flex items-center">
                                                <DollarSign size={14} className="mr-1" />
                                                Rs. {item.revenue.toLocaleString()}
                                            </p>
                                            <div className="w-24 h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                                                    style={{ width: `${(item.sales / analytics.topSellingItems[0].sales) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center text-gray-400">
                                <Package size={48} className="mx-auto mb-2 opacity-20" />
                                <p>No sales data available yet</p>
                                <p className="text-sm">Start receiving orders to see top selling items</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
