import React from 'react';
import { Eye, Clock, User } from 'lucide-react';
import Link from 'next/link';

const OrderList = ({ orders, onUpdateStatus }) => {
    const statusColors = {
        Pending: 'bg-red-100 text-primary',
        Preparing: 'bg-gray-100 text-secondary',
        Ready: 'bg-yellow-100 text-yellow-700',
        Delivered: 'bg-success text-white',
        Cancelled: 'bg-error text-white',
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                        <th className="px-6 py-4">Order ID</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Time</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="px-6 py-4 font-bold text-dark">{order.orderId}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 text-xs font-bold text-secondary">
                                        {order.customerName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-dark">{order.customerName}</p>
                                        <p className="text-xs text-gray-400">{order.customerPhone}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 font-bold text-primary">Rs. {order.grandTotal}</td>
                            <td className="px-6 py-4">
                                <select
                                    value={order.orderStatus}
                                    onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                                    className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full outline-none border-none cursor-pointer ${statusColors[order.orderStatus]}`}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Preparing">Preparing</option>
                                    <option value="Ready">Ready</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </td>
                            <td className="px-6 py-4 text-xs text-gray-400">
                                <div className="flex items-center">
                                    <Clock size={12} className="mr-1" />
                                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <Link href={`/admin/orders/${order._id}`}>
                                    <button className="p-2 text-gray-300 hover:text-secondary hover:bg-white rounded-lg shadow-sm transition-all">
                                        <Eye size={18} />
                                    </button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderList;
