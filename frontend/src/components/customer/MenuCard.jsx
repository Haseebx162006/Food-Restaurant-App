import React from 'react';
import Image from 'next/image';
import Button from '../common/Button';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';
import { Clock, ShoppingCart, Star, Flame } from 'lucide-react';

const MenuCard = ({ item }) => {
    const { addToCart } = useCart();
    const { _id, name, description, price, category, image, availability, preparationTime } = item;

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(item);
        toast.info(`${name} added!`, {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
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
        <div className={`group bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(230,57,70,0.1)] transition-all duration-500 border border-gray-100/50 flex flex-col h-full transform hover:-translate-y-2 ${!availability ? 'opacity-75 grayscale-[0.8]' : ''}`}>
            <div className="relative h-56 overflow-hidden bg-gray-50/50">
                <Image
                    src={getImageUrl(image)}
                    alt={name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain group-hover:scale-110 transition-transform duration-700 ease-out p-4"
                    priority={false}
                />
                <div className="absolute top-4 left-4 flex space-x-2">
                    <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl text-dark font-black text-[10px] uppercase tracking-wider shadow-sm flex items-center border border-white/50">
                        {category}
                    </div>
                </div>

                {availability && (
                    <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-md p-2 rounded-xl text-white shadow-lg shadow-primary/20">
                        <Flame size={16} className="animate-pulse" />
                    </div>
                )}

                {!availability && (
                    <div className="absolute inset-0 bg-dark/40 backdrop-blur-[3px] flex items-center justify-center p-6">
                        <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-5 py-2 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px]">Sold Out</span>
                    </div>
                )}
            </div>

            <div className="p-7 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-heading font-black text-dark group-hover:text-primary transition-colors leading-tight">{name}</h3>
                </div>

                <p className="text-gray-400 text-sm mb-6 line-clamp-2 font-medium flex-grow leading-relaxed">{description}</p>

                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <span className="text-2xl font-black text-dark tracking-tighter">Rs.{price}</span>
                        {preparationTime && (
                            <div className="flex items-center bg-gray-50 px-2 py-1 rounded-lg text-gray-400 text-[10px] font-bold">
                                <Clock size={12} className="mr-1" />
                                {preparationTime}m
                            </div>
                        )}
                    </div>
                    <div className="flex items-center text-yellow-400">
                        <Star size={14} fill="currentColor" />
                        <span className="ml-1 text-xs font-black text-dark">4.9</span>
                    </div>
                </div>

                <button
                    onClick={handleAddToCart}
                    disabled={!availability}
                    className={`
                        w-full flex items-center justify-center space-x-2 py-4 rounded-2xl font-black text-sm transition-all duration-300
                        ${availability
                            ? 'bg-primary text-white shadow-lg shadow-primary/25 hover:bg-dark hover:shadow-dark/20 group-hover:scale-[1.02]'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }
                    `}
                >
                    <ShoppingCart size={18} />
                    <span>Add to Cart</span>
                </button>
            </div>
        </div>
    );
};

export default MenuCard;
