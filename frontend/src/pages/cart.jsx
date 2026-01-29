import React from 'react';
import { useCart } from '@/context/CartContext';
import CartItem from '@/components/customer/CartItem';
import CartSummary from '@/components/customer/CartSummary';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart as CartIcon } from 'lucide-react';

export default function Cart() {
    const { cartItems, subtotal, taxAmount, deliveryAmount, grandTotal, totalItems, updateQuantity, removeFromCart } = useCart();

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between mb-10">
                    <Link href="/menu" className="flex items-center text-secondary font-bold hover:text-primary transition-colors group">
                        <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
                        Back to Menu
                    </Link>
                    <div className="text-right">
                        <h1 className="text-3xl font-heading font-bold text-dark flex items-center justify-end">
                            Your Cart <CartIcon className="ml-3 text-primary" size={28} />
                        </h1>
                        <p className="text-gray-400 text-sm">{totalItems} delightful items ready</p>
                    </div>
                </div>

                {cartItems.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                        <div className="lg:col-span-2">
                            <div className="mb-6 hidden sm:grid grid-cols-10 gap-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                <div className="col-span-5">Product</div>
                                <div className="col-span-2 text-center">Price</div>
                                <div className="col-span-2 text-center">Subtotal</div>
                                <div className="col-span-1"></div>
                            </div>

                            {cartItems.map(item => (
                                <CartItem
                                    key={item._id}
                                    item={item}
                                    updateQuantity={updateQuantity}
                                    removeFromCart={removeFromCart}
                                />
                            ))}
                        </div>

                        <div className="lg:col-span-1">
                            <CartSummary
                                subtotal={subtotal}
                                taxAmount={taxAmount}
                                deliveryAmount={deliveryAmount}
                                grandTotal={grandTotal}
                                totalItems={totalItems}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CartIcon className="text-primary" size={40} />
                        </div>
                        <h2 className="text-2xl font-heading font-bold text-dark mb-4">Your cart is empty</h2>
                        <p className="text-gray-400 mb-8 max-w-sm mx-auto">
                            Sounds like you haven't discovered our delicious menu yet.
                            Let's change that!
                        </p>
                        <Link href="/menu">
                            <button className="btn-primary px-10 py-3 text-lg">
                                Browse Menu
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
