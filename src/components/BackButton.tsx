import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  to?: string;
  label?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ to = '/', label = 'Back to Explore' }) => {
  const navigate = useNavigate();
  
  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      data-testid="back-button"
      onClick={() => navigate(to)}
      className="inline-flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-xl shadow-xl shadow-gray-200/50 rounded-2xl text-gray-800 hover:text-indigo-600 hover:shadow-indigo-100 font-black transition-all hover:-translate-y-0.5 group border border-gray-100 pointer-events-auto"
    >
      <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
      </svg>
      {label}
    </motion.button>
  );
};
