import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '@/context/CartContext';
import useAuth from '@/hooks/useAuth';
import orderService from '@/services/orderService';
import DeliveryForm from '@/components/customer/DeliveryForm';
import OrderSummary from '@/components/customer/OrderSummary';
import ProtectedRoute from '@/components/ProtectedRoute';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function Checkout() {
    const { cartItems, subtotal, taxAmount, deliveryAmount, grandTotal, totalItems, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (cartItems.length === 0 && !isLoading) {
            router.push('/menu');
        }
    }, [cartItems, router, isLoading]);

    const handlePlaceOrder = async (deliveryData) => {
        setIsLoading(true);
        try {
            const items = cartItems.map(item => ({
                itemId: item._id,
                itemName: item.name,
                quantity: item.quantity,
                price: item.price,
                subtotal: item.price * item.quantity
            }));

            const orderData = {
                ...deliveryData,
                items
            };

            const response = await orderService.createOrder(orderData);

            if (response.success) {
                toast.success('Order placed successfully!');
                clearCart();
                // Redirect to confirmation or tracking
                router.push(`/order/${response.orderId}`);
            }
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to place order. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="bg-gray-50 min-h-screen py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <Link href="/cart" className="flex items-center text-secondary font-bold mb-8 hover:text-primary transition-colors group">
                        <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
                        Back to Cart
                    </Link>

                    <h1 className="text-3xl font-heading font-bold text-dark mb-10">Checkout</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2">
                            <DeliveryForm
                                onSubmit={handlePlaceOrder}
                                isLoading={isLoading}
                                initialData={user}
                            />
                        </div>

                        <div className="lg:col-span-1">
                            <OrderSummary
                                cartItems={cartItems}
                                totals={{ subtotal, taxAmount, deliveryAmount, grandTotal }}
                                isLoading={isLoading}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
