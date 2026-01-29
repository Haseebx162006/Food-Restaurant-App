import React, { useState, useEffect } from 'react';
import menuService from '@/services/menuService';
import MenuCard from '@/components/customer/MenuCard';
import CategoryFilter from '@/components/customer/CategoryFilter';
import Spinner from '@/components/common/Spinner';
import { useSocket } from '@/context/SocketContext';
import { Search, SlidersHorizontal } from 'lucide-react';

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

        // Real-time updates
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
            <p className="mt-4 text-secondary font-medium animate-pulse">Fetching deliciousness...</p>
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <div className="bg-secondary relative py-16 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full"></div>
                    <div className="absolute top-40 right-10 w-60 h-60 bg-white rounded-full"></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-heading text-white mb-4">Our Delicious Menu</h1>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        Choose from a wide variety of freshly prepared meals, from spicy burgers to sweet desserts.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12 -mt-8">
                {/* Search and Filters */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row gap-6 items-center">
                    <div className="relative flex-grow w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search for your favorite food..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary transition-all text-dark"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="hidden md:flex items-center space-x-2 text-gray-400">
                        <SlidersHorizontal size={20} />
                        <span className="text-sm font-medium">Filter:</span>
                    </div>
                    <div className="w-full md:w-auto">
                        <CategoryFilter
                            activeCategory={activeCategory}
                            onCategoryChange={setActiveCategory}
                        />
                    </div>
                </div>

                {error ? (
                    <div className="text-center py-20">
                        <p className="text-error font-bold mb-4">{error}</p>
                        <button onClick={fetchMenu} className="btn-primary">Retry</button>
                    </div>
                ) : filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredItems.map(item => (
                            <MenuCard key={item._id} item={item} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                        <p className="text-gray-400 text-lg">No food items match your selection.</p>
                        <button
                            onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
                            className="mt-4 text-primary font-bold hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
