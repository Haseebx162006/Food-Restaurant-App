import React from 'react';
import Image from 'next/image';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';
import { Heart, Plus } from 'lucide-react';

const MenuCard = ({ item }) => {
    const { addToCart } = useCart();
    const { _id, name, description, price, image, availability } = item;

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
        <div className={`deal-card ${!availability ? 'opacity-75 grayscale' : ''}`}>
            <div className="kfc-stripes">
                <div className="stripe"></div>
                <div className="stripe"></div>
                <div className="stripe"></div>
            </div>

            <button className="fav-btn bg-transparent border-none p-0">
                <Heart size={24} />
            </button>

            <div className="deal-image-box">
                <img 
                    src={getImageUrl(image)} 
                    alt={name} 
                    className="deal-image"
                />
            </div>

            <h3 className="deal-name">{name}</h3>
            <p className="deal-desc">{description}</p>

            <div className="deal-footer">
                <span className="deal-price">Rs {price}</span>
                <button 
                    onClick={handleAddToCart}
                    disabled={!availability}
                    className="add-btn"
                >
                    <Plus size={16} />
                    {availability ? 'Add to Bucket' : 'Sold Out'}
                </button>
            </div>
        </div>
    );
};

export default MenuCard;
