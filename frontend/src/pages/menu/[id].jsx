import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import menuService from '@/services/menuService';
import Spinner from '@/components/common/Spinner';
import { ChevronLeft, ShoppingCart, Clock, Flame, Star } from 'lucide-react';
import Link from 'next/link';

export default function MenuItemDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchItem = async () => {
            try {
                const data = await menuService.fetchMenuItemById(id);
                setItem(data.data || data);
            } catch (error) {
                console.error("Error fetching item", error);
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
    if (!item) return <div className="min-h-screen flex items-center justify-center">Item not found</div>;

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/images/food-placeholder.jpg';
        if (imagePath.startsWith('http')) return imagePath;
        const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const baseUrl = rawUrl.endsWith('/api') ? rawUrl.slice(0, -4) : rawUrl;
        return `${baseUrl}${imagePath}`;
    };

    return (
        <div className="bg-white min-h-screen pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4">
                <Link href="/menu" className="inline-flex items-center text-gray-500 hover:text-primary mb-10 font-bold transition-colors">
                    <ChevronLeft size={20} className="mr-2" />
                    Back to Menu
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="relative aspect-square bg-gray-50 rounded-[3rem] overflow-hidden p-12">
                        <img 
                            src={getImageUrl(item.image)} 
                            alt={item.name} 
                            className="w-full h-full object-contain"
                        />
                        {item.availability && (
                            <div className="absolute top-8 right-8 bg-primary text-white p-4 rounded-2xl shadow-xl shadow-primary/20 animate-bounce">
                                <Flame size={24} />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <div className="inline-flex items-center space-x-2 bg-red-50 text-primary px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest mb-6 w-fit">
                            {item.category}
                        </div>
                        <h1 className="text-5xl md:text-7xl font-heading font-black text-dark mb-6 leading-tight">
                            {item.name}
                        </h1>
                        <p className="text-xl text-gray-400 mb-10 leading-relaxed font-medium">
                            {item.description}
                        </p>

                        <div className="flex items-center space-x-10 mb-12">
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-300 font-bold uppercase tracking-wider mb-1">Price</span>
                                <span className="text-4xl font-black text-dark">Rs.{item.price}</span>
                            </div>
                            <div className="w-px h-12 bg-gray-100"></div>
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-300 font-bold uppercase tracking-wider mb-1">Rating</span>
                                <div className="flex items-center text-yellow-400">
                                    <Star size={20} fill="currentColor" />
                                    <span className="ml-2 text-2xl font-black text-dark">4.9</span>
                                </div>
                            </div>
                        </div>

                        <button className="w-full md:w-fit bg-primary text-white px-12 py-6 rounded-3xl font-black text-lg shadow-2xl shadow-primary/30 hover:bg-dark transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-4">
                            <ShoppingCart size={24} />
                            <span>Add to Bag</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
