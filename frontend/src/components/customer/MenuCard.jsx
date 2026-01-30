import React from 'react';
import Button from '../common/Button';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';
import { Clock, Plus, Tag } from 'lucide-react';

const MenuCard = ({ item }) => {
    const { addToCart } = useCart();
    const { _id, name, description, price, category, image, availability, preparationTime } = item;

    const handleAddToCart = () => {
        addToCart(item);
        toast.success(`${name} added to cart!`);
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/images/food-placeholder.jpg';
        if (imagePath.startsWith('http')) return imagePath;
        // Use a safe fallback for base URL
        const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const baseUrl = rawUrl.endsWith('/api') ? rawUrl.slice(0, -4) : rawUrl;
        return `${baseUrl}${imagePath}`;
    };

    return (
        <div className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full ${!availability ? 'opacity-75 grayscale-[0.5]' : ''}`}>
            <div className="relative h-48 overflow-hidden">
                <img
                    src={getImageUrl(image)}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.target.src = '/images/food-placeholder.jpg'; }}
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-secondary font-bold text-sm shadow-sm flex items-center">
                    <Tag size={14} className="mr-1" />
                    {category}
                </div>
                {!availability && (
                    <div className="absolute inset-0 bg-dark/60 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-error text-white px-4 py-1.5 rounded-full font-bold uppercase tracking-wider text-xs">Out of Stock</span>
                    </div>
                )}
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-heading font-bold text-dark group-hover:text-primary transition-colors">{name}</h3>
                    <span className="text-xl font-bold text-primary">Rs. {price}</span>
                </div>

                <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">{description}</p>

                <div className="flex items-center text-xs text-gray-400 mb-6 space-x-4">
                    {preparationTime && (
                        <div className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            {preparationTime} mins
                        </div>
                    )}
                    <div className="flex items-center">
                        <span className={`h-2 w-2 rounded-full mr-1.5 ${availability ? 'bg-success' : 'bg-error'}`}></span>
                        {availability ? 'Available Now' : 'Unavailable'}
                    </div>
                </div>

                <Button
                    onClick={handleAddToCart}
                    disabled={!availability}
                    className="w-full group/btn"
                >
                    <Plus size={18} className="mr-2 group-hover/btn:rotate-90 transition-transform" />
                    Add to Cart
                </Button>
            </div>
        </div>
    );
};

export default MenuCard;
