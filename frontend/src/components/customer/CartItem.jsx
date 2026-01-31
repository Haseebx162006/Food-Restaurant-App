import React from 'react';
import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';

const CartItem = ({ item, updateQuantity, removeFromCart }) => {
    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/images/food-placeholder.jpg';
        if (imagePath.startsWith('http')) return imagePath;
        // Use a safe fallback for base URL
        const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const baseUrl = rawUrl.endsWith('/api') ? rawUrl.slice(0, -4) : rawUrl;
        return `${baseUrl}${imagePath}`;
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 mb-4 hover:shadow-md transition-shadow">
            <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
                <Image
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="object-cover rounded-xl"
                />
                <div className="ml-4">
                    <h4 className="text-lg font-heading font-bold text-dark">{item.name}</h4>
                    <p className="text-gray-400 text-sm">{item.category}</p>
                    <p className="text-primary font-bold sm:hidden mt-1">Rs. {item.price}</p>
                </div>
            </div>

            <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-12">
                <p className="hidden sm:block text-dark font-bold w-20">Rs. {item.price}</p>

                <div className="flex items-center bg-gray-50 rounded-lg p-1 border">
                    <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="p-1 hover:bg-white rounded transition-colors text-secondary"
                    >
                        <Minus size={16} />
                    </button>
                    <span className="w-10 text-center font-bold text-dark">{item.quantity}</span>
                    <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="p-1 hover:bg-white rounded transition-colors text-secondary"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                <p className="text-dark font-bold w-24 text-right">Rs. {item.price * item.quantity}</p>

                <button
                    onClick={() => removeFromCart(item._id)}
                    className="p-2 text-gray-300 hover:text-error transition-colors"
                >
                    <Trash2 size={20} />
                </button>
            </div>
        </div>
    );
};

export default CartItem;
