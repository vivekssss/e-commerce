import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { observer } from 'mobx-react';
import { Product } from '../types';
import { cleanImageUrl, formatPrice } from '../utils';
import { StoreContext } from '../context';

interface ProductCardProps {
  product: Product;
  index: number;
  onAddToCart: (product: Product, e?: React.MouseEvent) => void;
  onRemoveOne: (product: Product, e: React.MouseEvent) => void;
}

function ProductCardComponent({
  product,
  index,
  onAddToCart,
  onRemoveOne,
}: ProductCardProps) {
  const store = useContext(StoreContext);
  const quantity = store.getItemQuantity(product.id);
  const imageUrl = cleanImageUrl(product.images?.[0]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index % 8) * 0.05 }}
      whileHover={{ y: -10, transition: { duration: 0.2 } }}
    >
      <Link
        to={`/product/${product.id}/details`}
        state={{ product }}
        data-testid={`product-card-${product.id}`}
        className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 block group relative"
      >
        <div className="relative overflow-hidden aspect-square">
          <motion.img
            layoutId={`product-image-${product.id}`}
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=No+Image&background=e2e8f0&color=64748b&size=400';
            }}
          />
          <div className="absolute top-4 right-4">
            <span className="bg-white/90 backdrop-blur-md text-[10px] font-black text-indigo-600 px-3 py-1.5 rounded-full shadow-sm uppercase tracking-widest border border-indigo-50">
              {product.category?.name}
            </span>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-tight h-12">
            {product.title}
          </h3>
          <div className="flex justify-between items-center mt-4">
            <div className="flex flex-col">
              <span className="text-xl font-black text-gray-900">
                {formatPrice(product.price)}
              </span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Best Price</span>
            </div>
            {quantity > 0 ? (
              <div 
                className="flex items-center gap-3 bg-indigo-600 px-3 py-1.5 rounded-[20px] shadow-sm"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              >
                <button 
                  onClick={(e) => onRemoveOne(product, e)}
                  className="text-white hover:text-indigo-200 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-sm font-black text-white">{quantity}</span>
                <button 
                  onClick={(e) => onAddToCart(product, e)}
                  className="text-white hover:text-indigo-200 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            ) : (
              <button 
                onClick={(e) => onAddToCart(product, e)}
                className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-300 transform hover:rotate-12 shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export const ProductCard = observer(ProductCardComponent);
