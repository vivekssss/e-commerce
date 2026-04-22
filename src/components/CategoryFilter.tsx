import React from 'react';
import { motion } from 'framer-motion';
import { Category } from '../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: number | null;
  onCategoryClick: (categoryId: number | null) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategory, onCategoryClick }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="mb-12"
    >
      <div className="flex items-center justify-between mb-6 px-1">
        <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Categories</h2>
        <div className="h-[2px] flex-grow mx-6 bg-gray-100 rounded-full opacity-50" />
      </div>
      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide -mx-2 px-2">
        <button
          data-testid="filter-all"
          onClick={() => onCategoryClick(null)}
          className={`px-8 py-3.5 rounded-2xl text-sm font-black whitespace-nowrap transition-all duration-500 ${
            selectedCategory === null
              ? 'bg-gray-900 text-white shadow-2xl shadow-gray-300 scale-105'
              : 'bg-white text-gray-500 border-2 border-gray-100 hover:border-indigo-200 hover:text-indigo-600'
          }`}
        >
          All Arrivals
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            data-testid={`filter-${cat.id}`}
            onClick={() => onCategoryClick(cat.id)}
            className={`px-8 py-3.5 rounded-2xl text-sm font-black whitespace-nowrap transition-all duration-500 ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-2xl shadow-indigo-200 scale-105'
                : 'bg-white text-gray-500 border-2 border-gray-100 hover:border-indigo-200 hover:text-indigo-600'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </motion.div>
  );
};
