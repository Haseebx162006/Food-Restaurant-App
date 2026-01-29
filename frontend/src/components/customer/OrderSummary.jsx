import React from 'react';
import { ShoppingBag } from 'lucide-react';
import Button from '../common/Button';

const OrderSummary = ({ cartItems, totals, onPlaceOrder, isLoading }) => {
    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="text-xl font-heading font-bold text-dark mb-6 flex items-center">
                <ShoppingBag className="mr-3 text-primary" size={24} />
                Your Order
            </h3>

            <div className="max-h-60 overflow-y-auto mb-6 pr-2 scrollbar-thin">
                {cartItems.map((item) => (
                    <div key={item._id} className="flex justify-between items-center mb-4 py-2 border-b border-gray-50 last:border-0">
                        <div className="flex items-center">
                            <span className="bg-red-50 text-primary font-bold text-xs h-6 w-6 rounded-md flex items-center justify-center mr-3">
                                {item.quantity}x
                            </span>
                            <div>
                                <p className="text-sm font-bold text-dark truncate w-32">{item.name}</p>
                                <p className="text-xs text-gray-400">Rs. {item.price}</p>
                            </div>
                        </div>
                        <p className="text-sm font-bold text-dark">Rs. {item.price * item.quantity}</p>
                    </div>
                ))}
            </div>

            <div className="space-y-3 mb-8 text-sm">
                <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>Rs. {totals.subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                    <span>Tax (5%)</span>
                    <span>Rs. {totals.taxAmount}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                    <span>Delivery</span>
                    <span>Rs. {totals.deliveryAmount}</span>
                </div>
                <div className="border-t pt-4 flex justify-between items-center">
                    <span className="text-lg font-bold text-dark">Total</span>
                    <span className="text-xl font-bold text-primary">Rs. {totals.grandTotal}</span>
                </div>
            </div>

            <Button
                type="submit"
                form="delivery-form"
                className="w-full h-14 text-lg"
                isLoading={isLoading}
            >
                Place Order
            </Button>

            <p className="text-center text-[10px] text-gray-400 mt-4 px-4">
                By placing order, you agree to our Terms of Service and Privacy Policy.
            </p>
        </div>
    );
};

export default OrderSummary;
