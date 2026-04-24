import React from 'react';
import Image from 'next/image';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';
import { Heart, Plus, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const MenuCard = ({ item }) => {
    const { addToCart } = useCart();
    const { _id, name, description, price, image, availability } = item;

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(item);
        toast.success(`${name} added to bucket!`, {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            theme: "dark"
        });
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/images/food-placeholder.jpg';
        if (imagePath.startsWith('http')) return imagePath;
        const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const baseUrl = rawUrl.endsWith('/api') ? rawUrl.slice(0, -4) : rawUrl;
        return `${baseUrl}${imagePath}`;
    };

    return (
        <motion.div 
            whileHover={{ y: -10 }}
            className={`relative group bg-white rounded-[32px] p-6 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 ${!availability ? 'opacity-75 grayscale' : ''}`}
        >
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {!availability && (
                    <span className="bg-dark text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                        Sold Out
                    </span>
                )}
                {availability && (
                    <span className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-primary/30">
                        Top Deal
                    </span>
                )}
            </div>

            <button className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-gray-400 hover:text-primary transition-colors shadow-sm">
                <Heart size={20} />
            </button>

            <div className="relative w-full aspect-square mb-6 p-4">
                <img 
                    src={getImageUrl(image)} 
                    alt={name} 
                    className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
                />
            </div>

            <div className="space-y-2">
                <h3 className="text-xl font-black text-dark line-clamp-1">{name}</h3>
                <p className="text-gray-400 text-sm line-clamp-2 min-h-[40px] font-medium leading-relaxed">
                    {description || "No description available for this delicious item."}
                </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-6">
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Price</span>
                    <span className="text-2xl font-black text-primary">Rs {price}</span>
                </div>
                
                <button 
                    onClick={handleAddToCart}
                    disabled={!availability}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        availability 
                        ? 'bg-dark text-white hover:bg-primary shadow-lg hover:shadow-primary/30' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    <Plus size={24} />
                </button>
            </div>
        </motion.div>
    );
};

export default MenuCard;

