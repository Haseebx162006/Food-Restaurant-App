import React from 'react';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';
import { Plus, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const MenuCard = ({ item }) => {
    const { addToCart } = useCart();
    const { name, description, price, image, availability } = item;

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
            className="relative group h-[420px] mb-12"
        >
            <div className={`relative h-full w-full rounded-[35px] bg-primary shadow-2xl flex flex-col overflow-hidden ${!availability ? 'opacity-70 grayscale' : ''}`}>
                {/* TOP HALF: White Background + Image */}
                <div className="relative h-[48%] bg-white flex items-center justify-center p-6">
                    <div className="absolute top-4 left-4 flex items-center gap-1 bg-yellow-400 px-2 py-0.5 rounded-full z-20 shadow-md">
                        <Star size={10} fill="white" stroke="white" />
                        <span className="text-[9px] font-black text-white">4.9</span>
                    </div>
                    
                    <div className="relative w-32 h-32 z-10">
                        <img 
                            src={getImageUrl(image)} 
                            alt={name} 
                            className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700"
                        />
                    </div>

                    {/* MULTI-LAYERED ORGANIC WAVY DIVIDER */}
                    <div className="absolute bottom-0 left-0 w-full leading-[0] translate-y-[95%] z-20">
                        {/* Secondary subtle wave for depth */}
                        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-2 left-0 w-full h-[70px] fill-white/20">
                            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.38,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C1003.12,14.81,1104,1,1200,0V0H0Z"></path>
                        </svg>
                        {/* Main clean wave */}
                        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[65px] fill-white text-white">
                            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.38,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C1003.12,14.81,1104,1,1200,0V0H0Z"></path>
                        </svg>
                    </div>
                </div>

                {/* LOWER HALF: Red Background + Info */}
                <div className="flex-grow flex flex-col items-center text-center px-6 pb-10 pt-12 relative z-10">
                    <div className="w-full pr-1"> {/* Added pr-1 to prevent italic clipping */}
                        <h3 className="text-[17px] font-black text-white mb-2 italic tracking-tight uppercase line-clamp-1 leading-tight">
                            {name}
                        </h3>
                    </div>
                    <p className="text-[11px] font-medium text-white/80 line-clamp-2 px-2 mb-4 leading-relaxed overflow-hidden">
                        {description || "Authentic Shehwar Broast premium selection, crafted for the ultimate flavor experience."}
                    </p>
                    <div className="mt-auto text-3xl font-black italic tracking-tighter text-white">
                        RS {price}
                    </div>
                </div>
            </div>

            {/* ADD TO BUCKET BUTTON (Moved outside the overflow-hidden container) */}
            <button 
                onClick={handleAddToCart}
                disabled={!availability}
                className="absolute bottom-[-22px] left-1/2 -translate-x-1/2 flex items-center gap-2 bg-dark text-white px-8 py-4 rounded-full font-black uppercase tracking-[0.2em] text-[9px] shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:bg-white hover:text-primary transition-all active:scale-95 whitespace-nowrap z-30 group-hover:px-10"
            >
                <Plus size={16} />
                ADD TO BUCKET
            </button>
        </motion.div>
    );
};

export default MenuCard;




