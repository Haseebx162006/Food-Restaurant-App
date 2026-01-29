import React from 'react';

const categories = [
    'All',
    'Fast Food',
    'Main Course',
    'Drinks',
    'Desserts',
    'Snacks'
];

const CategoryFilter = ({ activeCategory, onCategoryChange }) => {
    return (
        <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => onCategoryChange(cat)}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border-2 ${activeCategory === cat
                            ? 'bg-secondary border-secondary text-white shadow-md'
                            : 'bg-white border-gray-100 text-gray-500 hover:border-secondary hover:text-secondary'
                        }`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
};

export default CategoryFilter;
