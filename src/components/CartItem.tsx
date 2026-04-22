import React from 'react';
import { motion } from 'framer-motion';
import { observer } from 'mobx-react';
import { cleanImageUrl, formatPrice } from '../utils';

interface CartItemProps {
  item: any;
  onRemove: (id: number, title: string) => void;
  onIncrement: (item: any) => void;
  onDecrement: (id: number) => void;
}

function CartItemComponent({ item, onRemove, onIncrement, onDecrement }: CartItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, x: -20 }}
      className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-2xl border border-gray-100 group"
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-white border border-gray-100 flex-shrink-0">
        <img
          src={cleanImageUrl(item.images?.[0])}
          alt={item.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=P&background=e2e8f0&color=64748b&size=64';
          }}
        />
      </div>
      
      <div className="flex-grow flex flex-col justify-between min-w-0">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-gray-900 truncate">{item.title}</h3>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{item.category?.name}</p>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-gray-100">
            <button 
              onClick={() => onDecrement(item.id)}
              className="text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
              </svg>
            </button>
            <span className="text-sm font-black text-gray-900 min-w-[20px] text-center">{item.quantity}</span>
            <button 
              onClick={() => onIncrement(item)}
              className="text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          <button 
            onClick={() => onRemove(item.id, item.title)}
            className="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between sm:text-right">
        <span className="text-lg font-black text-gray-900">
          {formatPrice(item.price * item.quantity)}
        </span>
        <span className="text-[10px] text-gray-400 font-medium">
          {formatPrice(item.price)} each
        </span>
      </div>
    </motion.div>
  );
}

export const CartItem = observer(CartItemComponent);
