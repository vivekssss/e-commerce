import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="page-transition flex flex-col items-center justify-center py-12 text-center">
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 12 }}
        className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-200"
      >
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>
      <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h2>
      <p className="text-gray-500 mb-2 max-w-sm">Your order has been placed and will be shipped soon.</p>
      <p className="text-xs text-gray-400 mb-8">Order #SW-{Math.floor(Math.random() * 900000 + 100000)}</p>
      <button
        onClick={() => navigate('/')}
        className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 btn-hover"
      >
        Continue Shopping
      </button>
    </div>
  );
};
