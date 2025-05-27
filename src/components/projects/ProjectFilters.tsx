'use client';

import { motion } from 'framer-motion';

interface ProjectFiltersProps {
  categories: string[];
  activeCategory: string;
  onFilterChange: (category: string) => void;
}

export default function ProjectFilters({ 
  categories, 
  activeCategory, 
  onFilterChange 
}: ProjectFiltersProps) {
  return (
    <motion.div 
      className="flex flex-wrap justify-center gap-2 mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      {categories.map((category, index) => (
        <motion.button
          key={category}
          onClick={() => onFilterChange(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeCategory === category
              ? 'bg-[#b85a00] text-white'
              : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </motion.button>
      ))}
    </motion.div>
  );
} 