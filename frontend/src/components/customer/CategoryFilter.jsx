import React from 'react';
import { Utensils, Pizza, Coffee, Cake, Sandwich, LayoutGrid } from 'lucide-react';

const categories = [
    { name: 'All', icon: LayoutGrid },
    { name: 'Fast Food', icon: Pizza },
    { name: 'Main Course', icon: Utensils },
    { name: 'Drinks', icon: Coffee },
    { name: 'Desserts', icon: Cake },
    { name: 'Snacks', icon: Sandwich }
];

const CategoryFilter = ({ activeCategory, onCategoryChange }) => {
    return (
        <div className="flex items-center space-x-3 overflow-x-auto pb-4 scrollbar-hide no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
            {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.name;

                return (
                    <button
                        key={cat.name}
                        onClick={() => onCategoryChange(cat.name)}
                        className={`
                            flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap
                            ${isActive
                                ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105 active-scale-95'
                                : 'bg-white/80 backdrop-blur-md border border-gray-100/50 text-gray-500 hover:text-primary hover:border-primary/30 hover:bg-white'
                            }
                        `}
                    >
                        <Icon size={18} className={`${isActive ? 'text-white' : 'text-primary/70'}`} />
                        <span>{cat.name}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default CategoryFilter;
