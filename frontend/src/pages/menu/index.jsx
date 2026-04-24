import React, { useState, useEffect } from 'react';
import menuService from '@/services/menuService';
import MenuCard from '@/components/customer/MenuCard';
import CategoryFilter from '@/components/customer/CategoryFilter';
import Spinner from '@/components/common/Spinner';
import { useSocket } from '@/context/SocketContext';
import { Search, Sparkles, UtensilsCrossed } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <Spinner size="large" />
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, duration: 1, repeatType: 'reverse' }}
                className="mt-8 text-primary font-black uppercase tracking-[0.4em] text-[10px]"
            >
                Preparing the Feast
            </motion.p>
        </div>
    );

    return (
        <div className="bg-[#fafafa] min-h-screen pb-32 pt-32">
            <div className="max-w-[1600px] mx-auto px-8">
                {/* Search and Filters at the TOP */}
                <div className="mb-16">
                    <div className="bg-white p-6 rounded-[35px] shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col md:flex-row gap-6 items-center">
                        <div className="relative flex-grow w-full group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search your cravings..."
                                className="w-full pl-16 pr-8 py-5 bg-gray-50/50 border-none rounded-[25px] focus:ring-0 transition-all text-dark font-bold placeholder:text-gray-300 text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="w-full md:w-auto overflow-hidden">
                            <CategoryFilter
                                activeCategory={activeCategory}
                                onCategoryChange={setActiveCategory}
                            />
                        </div>
                    </div>
                </div>

                {error ? (
                    <div className="text-center py-24 bg-white rounded-[40px] shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-black text-dark mb-4 uppercase tracking-tighter">Something went wrong</h2>
                        <button onClick={fetchMenu} className="bg-primary text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-all">Retry</button>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {filteredItems.length > 0 ? (
                            <motion.div 
                                layout
                                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-16"
                            >
                                {filteredItems.map((item, index) => (
                                    <motion.div
                                        key={item._id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <MenuCard item={item} />
                                    </motion.div>
                                ))}
                            </motion.div>

                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-40 bg-white rounded-[40px] border-2 border-dashed border-gray-100"
                            >
                                <Sparkles className="mx-auto text-gray-200 mb-6" size={60} />
                                <h2 className="text-3xl font-black text-dark mb-2 uppercase tracking-tighter italic">No Flavors Found</h2>
                                <p className="text-gray-400 mb-10">Try a different category or search term.</p>
                                <button
                                    onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
                                    className="bg-dark text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-primary transition-all shadow-xl shadow-dark/10"
                                >
                                    Reset Selection
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}

