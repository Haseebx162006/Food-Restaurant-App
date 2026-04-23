import React, { useState, useEffect } from 'react';
import menuService from '@/services/menuService';
import MenuCard from '@/components/customer/MenuCard';
import CategoryFilter from '@/components/customer/CategoryFilter';
import Spinner from '@/components/common/Spinner';
import { useSocket } from '@/context/SocketContext';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';

export default function Menu() {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const { on, off } = useSocket();

    useEffect(() => {
        fetchMenu();

        on('menu-updated', (updatedItem) => {
            setItems(prev => prev.map(item => item._id === updatedItem._id ? { ...item, ...updatedItem } : item));
        });

        return () => off('menu-updated');
    }, [on, off]);

    useEffect(() => {
        filterItems();
    }, [items, activeCategory, searchQuery]);

    const fetchMenu = async () => {
        setIsLoading(true);
        try {
            const response = await menuService.fetchAllMenuItems();
            if (response.success) {
                setItems(response.data);
            }
        } catch (err) {
            setError('Failed to load menu. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const filterItems = () => {
        let result = [...items];

        if (activeCategory !== 'All') {
            result = result.filter(item => item.category === activeCategory);
        }

        if (searchQuery) {
            result = result.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredItems(result);
    };

    if (isLoading) return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center">
            <Spinner size="large" />
            <div className="mt-8 flex flex-col items-center">
                <p className="text-secondary font-black animate-pulse uppercase tracking-[0.3em] text-xs">Authenticating Flavors</p>
                <div className="w-48 h-1 bg-gray-100 rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-primary animate-progress-fast"></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white min-h-screen">
            {/* Premium Hero Section */}
            <div className="relative pt-24 pb-40 px-4 overflow-hidden">
                {/* Visual Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full -z-10">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[120px] animate-delay-1000"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-2xl text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-6">
                        <Sparkles size={12} />
                        <span>Curated for you</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-heading font-black text-dark mb-6 tracking-tight">
                        Choose your <span className="text-primary italic">Flavor</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
                        Experience the art of fine dining delivered right to your doorstep. Every dish is crafted with passion.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-24 pb-24">
                {/* Search and Filters - Glassmorphism UI */}
                <div className="bg-white/70 backdrop-blur-2xl p-4 md:p-6 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-white/40 mb-16">
                    <div className="flex flex-col gap-6">
                        {/* Top Bar: Search */}
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <div className="relative flex-grow w-full group">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search for gourmet dishes..."
                                    className="w-full pl-14 pr-6 py-5 bg-gray-50/50 border-none rounded-3xl focus:ring-2 focus:ring-primary/20 transition-all text-dark font-bold placeholder:text-gray-300 shadow-inner"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button className="hidden md:flex items-center justify-center p-5 bg-dark text-white rounded-3xl hover:bg-primary transition-all shadow-lg shadow-dark/10 group">
                                <SlidersHorizontal size={20} className="group-hover:rotate-90 transition-transform" />
                            </button>
                        </div>

                        {/* Bottom Bar: Categories */}
                        <div className="w-full">
                            <CategoryFilter
                                activeCategory={activeCategory}
                                onCategoryChange={setActiveCategory}
                            />
                        </div>
                    </div>
                </div>

                {error ? (
                    <div className="text-center py-24">
                        <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                            <SlidersHorizontal size={36} />
                        </div>
                        <h2 className="text-2xl font-black text-dark mb-2">Something went wrong</h2>
                        <p className="text-gray-400 mb-8 max-w-xs mx-auto">{error}</p>
                        <button onClick={fetchMenu} className="bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-105 transition-transform">Retry Now</button>
                    </div>
                ) : filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                        {filteredItems.map((item, index) => (
                            <div key={item._id} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                                <MenuCard item={item} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
                        <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                            <Search className="text-gray-200" size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-dark mb-2">No flavors found</h2>
                        <p className="text-gray-400 mb-8">Try adjusting your filters or search keywords.</p>
                        <button
                            onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
                            className="text-primary font-black hover:scale-105 transition-transform inline-flex items-center"
                        >
                            <Sparkles size={16} className="mr-2" />
                            Reset Selection
                        </button>
                    </div>
                )}
            </div>

            {/* Global Animation Styles */}
            <style jsx global>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out forwards;
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
