import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Spinner from '@/components/common/Spinner';
import { BarChart3, TrendingUp, PieChart, Calendar } from 'lucide-react';

export default function AdminStats() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="large" /></div>;

    return (
        <ProtectedRoute requiredRole="admin">
            <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h1 className="text-3xl font-heading font-bold text-dark">Statistics & Reports</h1>
                            <p className="text-gray-400">Deep dive into your restaurant's performance.</p>
                        </div>
                        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                            <Calendar size={18} className="text-primary" />
                            <span className="text-sm font-bold text-dark">This Month</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-96 flex flex-col">
                            <h3 className="text-lg font-bold text-dark mb-8 flex items-center">
                                <TrendingUp size={20} className="mr-3 text-success" />
                                Revenue Growth
                            </h3>
                            <div className="flex-grow flex items-end justify-between space-x-2">
                                {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                                    <div key={i} className="flex flex-col items-center w-full">
                                        <div
                                            className="w-full bg-primary/20 rounded-t-lg transition-all duration-1000 group hover:bg-primary cursor-pointer relative"
                                            style={{ height: `${h}%` }}
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                Rs.{h * 100}
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-gray-400 mt-2 font-bold">Day {i + 1}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-96 flex flex-col">
                            <h3 className="text-lg font-bold text-dark mb-8 flex items-center">
                                <PieChart size={20} className="mr-3 text-secondary" />
                                Category Distribution
                            </h3>
                            <div className="flex-grow flex items-center justify-center relative">
                                <div className="w-48 h-48 rounded-full border-[20px] border-secondary border-r-primary border-b-success border-l-yellow-400"></div>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-2xl font-bold text-dark">152</span>
                                    <span className="text-[10px] text-gray-400 uppercase font-black">Sales Today</span>
                                </div>

                                <div className="ml-12 space-y-4">
                                    {[
                                        { label: 'Fast Food', color: 'bg-primary', percent: 45 },
                                        { label: 'Main Course', color: 'bg-secondary', percent: 25 },
                                        { label: 'Drinks', color: 'bg-success', percent: 20 },
                                        { label: 'Others', color: 'bg-yellow-400', percent: 10 },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center space-x-3">
                                            <div className={`h-3 w-3 rounded-full ${item.color}`}></div>
                                            <span className="text-xs text-dark font-medium">{item.label}</span>
                                            <span className="text-xs text-gray-400 font-bold">{item.percent}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-dark mb-6 flex items-center">
                            <BarChart3 size={20} className="mr-3 text-primary" />
                            Top Selling Items
                        </h3>
                        <div className="space-y-6">
                            {[
                                { name: 'Zinger Burger', sales: 120, revenue: 36000, trend: '+15%' },
                                { name: 'Peri Peri Fries', sales: 95, revenue: 19000, trend: '+10%' },
                                { name: 'Chicken Manchurian', sales: 82, revenue: 41000, trend: '+5%' },
                                { name: 'Chocolate Lava Cake', sales: 76, revenue: 15200, trend: '+12%' },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-gray-100 h-10 w-10 flex items-center justify-center rounded-lg font-bold text-dark">
                                            #{idx + 1}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-dark">{item.name}</p>
                                            <p className="text-xs text-gray-400">{item.sales} units sold</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-primary">Rs. {item.revenue}</p>
                                        <p className="text-[10px] font-bold text-success">{item.trend}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
