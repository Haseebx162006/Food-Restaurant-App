import React from 'react';
import Button from '../common/Button';
import { useRouter } from 'next/router';
import { CreditCard, ShoppingBag } from 'lucide-react';

const CartSummary = ({ subtotal, taxAmount, deliveryAmount, grandTotal, totalItems }) => {
    const router = useRouter();

    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="text-2xl font-heading font-bold text-dark mb-6 flex items-center">
                <ShoppingBag className="mr-3 text-primary" size={24} />
                Order Summary
            </h3>

            <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-500">
                    <span>Items ({totalItems})</span>
                    <span>Rs. {subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                    <span>Tax (5%)</span>
                    <span>Rs. {taxAmount}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                    <span>Delivery Fee</span>
                    <span>Rs. {deliveryAmount}</span>
                </div>
                <div className="border-t pt-4 flex justify-between items-center">
                    <span className="text-xl font-bold text-dark">Total Amount</span>
                    <span className="text-2xl font-bold text-primary">Rs. {grandTotal}</span>
                </div>
            </div>

            <Button
                className="w-full h-14 text-lg shadow-lg shadow-red-200"
                onClick={() => router.push('/checkout')}
            >
                <CreditCard className="mr-2" size={20} />
                Proceed to Checkout
            </Button>

            <p className="text-center text-xs text-gray-400 mt-4">
                Taxes and fees are calculated at checkout
            </p>
        </div>
    );
};

export default CartSummary;
