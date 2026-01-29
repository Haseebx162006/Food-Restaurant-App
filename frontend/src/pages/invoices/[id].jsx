import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import orderService from '@/services/orderService';
import ProtectedRoute from '@/components/ProtectedRoute';
import Spinner from '@/components/common/Spinner';
import Button from '@/components/common/Button';
import { toast } from 'react-toastify';
import { Printer, Download, ArrowLeft, DownloadCloud } from 'lucide-react';
import Link from 'next/link';

export default function Invoice() {
    const router = useRouter();
    const { id } = router.query;
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const invoiceRef = useRef();

    useEffect(() => {
        if (id) {
            fetchOrder();
        }
    }, [id]);

    const fetchOrder = async () => {
        setIsLoading(true);
        try {
            const response = await orderService.fetchOrderById(id);
            if (response.success) {
                setOrder(response.data);
            }
        } catch (err) {
            toast.error('Failed to load invoice details');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="large" /></div>;

    if (!order) return <div className="text-center py-20">Order not found</div>;

    return (
        <ProtectedRoute>
            <div className="bg-gray-100 min-h-screen py-12 px-4 print:p-0 print:bg-white">
                <div className="max-w-3xl mx-auto">
                    <div className="flex justify-between items-center mb-8 print:hidden">
                        <Link href={`/order/${order._id}`} className="flex items-center text-secondary font-bold hover:text-primary transition-colors">
                            <ArrowLeft className="mr-2" size={20} />
                            Back to Order
                        </Link>
                        <div className="space-x-4">
                            <Button variant="outline" size="sm" onClick={handlePrint}>
                                <Printer size={18} className="mr-2" />
                                Print
                            </Button>
                            <Button size="sm" onClick={() => toast.info('PDF Generation starting...')}>
                                <Download size={18} className="mr-2" />
                                Download PDF
                            </Button>
                        </div>
                    </div>

                    {/* Invoice Document */}
                    <div ref={invoiceRef} className="bg-white p-12 shadow-2xl rounded-sm border-t-8 border-primary print:shadow-none print:border-t-0 print:p-0">
                        <div className="flex justify-between items-start mb-12">
                            <div>
                                <h1 className="text-4xl font-heading font-bold text-primary mb-2">FoodExpress</h1>
                                <p className="text-gray-400 text-sm">Delicious food, fast delivery</p>
                                <div className="mt-6 text-sm text-gray-500 space-y-1">
                                    <p>123 Food Street, Tasty City</p>
                                    <p>Phone: +1 234 567 890</p>
                                    <p>Email: billing@foodexpress.com</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <h2 className="text-2xl font-heading font-bold text-dark mb-4 uppercase tracking-widest">Invoice</h2>
                                <div className="space-y-2 text-sm">
                                    <p className="flex justify-between"><span className="text-gray-400 mr-4">Invoice #:</span> <span className="font-bold text-dark">INV-{order.orderId}</span></p>
                                    <p className="flex justify-between"><span className="text-gray-400 mr-4">Order ID:</span> <span className="font-medium">{order.orderId}</span></p>
                                    <p className="flex justify-between"><span className="text-gray-400 mr-4">Date:</span> <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span></p>
                                    <p className="flex justify-between"><span className="text-gray-400 mr-4">Status:</span> <span className="font-bold text-success uppercase">Paid</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-12 mb-12 border-y border-gray-100 py-8">
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Invoice To:</h3>
                                <div className="text-sm text-dark space-y-1">
                                    <p className="text-lg font-bold">{order.customerName}</p>
                                    <p>{order.deliveryAddress}</p>
                                    <p>{order.customerPhone}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Payment Method:</h3>
                                <div className="text-sm text-dark">
                                    <p className="font-bold">Cash on Delivery</p>
                                    <p className="text-gray-500 mt-2 italic text-xs">Note: Payment collected upon delivery of items.</p>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <table className="w-full mb-12">
                            <thead>
                                <tr className="bg-gray-50 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <th className="px-4 py-3">Description</th>
                                    <th className="px-4 py-3 text-center">Qty</th>
                                    <th className="px-4 py-3 text-right">Unit Price</th>
                                    <th className="px-4 py-3 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {order.items.map((item, idx) => (
                                    <tr key={idx} className="text-sm text-dark">
                                        <td className="px-4 py-4 font-medium">{item.itemName}</td>
                                        <td className="px-4 py-4 text-center">{item.quantity}</td>
                                        <td className="px-4 py-4 text-right">Rs. {item.price}</td>
                                        <td className="px-4 py-4 text-right font-bold">Rs. {item.subtotal}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Totals */}
                        <div className="flex justify-end">
                            <div className="w-64 space-y-3">
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Subtotal:</span>
                                    <span>Rs. {order.totalAmount}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>GST (5%):</span>
                                    <span>Rs. {order.taxAmount}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Delivery:</span>
                                    <span>Rs. {order.deliveryAmount}</span>
                                </div>
                                <div className="flex justify-between pt-4 border-t border-dark font-heading font-bold text-xl text-primary">
                                    <span>Grand Total:</span>
                                    <span>Rs. {order.grandTotal}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-20 pt-8 border-t border-gray-100 text-center text-xs text-gray-400">
                            <p className="mb-2">Thank you for ordering with FoodExpress! We appreciate your business.</p>
                            <p>For any queries, please contact our support at support@foodexpress.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
