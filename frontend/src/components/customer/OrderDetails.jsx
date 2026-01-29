import React from 'react';
import { MapPin, Phone, User, Calendar, Hash } from 'lucide-react';

const OrderDetails = ({ order }) => {
    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <div>
                    <h3 className="text-xl font-heading font-bold text-dark flex items-center">
                        <Hash className="mr-2 text-primary" size={20} />
                        {order.orderId}
                    </h3>
                    <p className="text-gray-400 text-xs flex items-center mt-1">
                        <Calendar size={12} className="mr-1" />
                        Placed on {new Date(order.createdAt).toLocaleString()}
                    </p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${order.orderStatus === 'Delivered' ? 'bg-success text-white' :
                    order.orderStatus === 'Cancelled' ? 'bg-error text-white' :
                        'bg-red-100 text-primary'
                    }`}>
                    {order.orderStatus}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="p-8 border-r border-gray-50">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Delivery Information</h4>
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <User size={18} className="text-secondary mt-0.5 mr-3 shrink-0" />
                            <div>
                                <p className="text-xs text-gray-400">Recipient</p>
                                <p className="text-dark font-medium">{order.customerName}</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <Phone size={18} className="text-secondary mt-0.5 mr-3 shrink-0" />
                            <div>
                                <p className="text-xs text-gray-400">Phone Number</p>
                                <p className="text-dark font-medium">{order.customerPhone}</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <MapPin size={18} className="text-secondary mt-0.5 mr-3 shrink-0" />
                            <div>
                                <p className="text-xs text-gray-400">Delivery Address</p>
                                <p className="text-dark font-medium">{order.deliveryAddress}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Order Items</h4>
                    <div className="space-y-4 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                                <div className="flex items-center">
                                    <span className="bg-gray-100 text-secondary text-[10px] font-bold h-5 w-5 rounded flex items-center justify-center mr-3">{item.quantity}</span>
                                    <span className="text-dark font-medium">{item.itemName}</span>
                                </div>
                                <span className="text-gray-400">Rs. {item.subtotal}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-50 space-y-2">
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Subtotal</span>
                            <span>Rs. {order.totalAmount}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Tax & Delivery</span>
                            <span>Rs. {order.taxAmount + order.deliveryAmount}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <span className="font-bold text-dark">Total Paid</span>
                            <span className="text-xl font-bold text-primary">Rs. {order.grandTotal}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
