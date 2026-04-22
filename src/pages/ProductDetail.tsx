import React from 'react';
import { observer } from 'mobx-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Product } from '../types';
import { cleanImageUrl, formatPrice } from '../utils';
import { withRouter, RouterProps } from '../withRouter';
import { StoreContext } from '../context';
import { BackButton } from '../components/BackButton';

interface DetailState {
  product: Product | null;
  loading: boolean;
  error: string | null;
  selectedImage: number;
  windowWidth: number;
  isFlying: boolean;
}

class ProductDetail extends React.Component<RouterProps, DetailState> {
  static contextType = StoreContext;
  context!: React.ContextType<typeof StoreContext>;

  state: DetailState = {
    product: null,
    loading: true,
    error: null,
    selectedImage: 0,
    windowWidth: window.innerWidth,
    isFlying: false,
  };

  handleResize = () => {
    this.setState({ windowWidth: window.innerWidth });
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.fetchProduct();
  }

  fetchProduct = async () => {
    const { params } = this.props;
    if (!params.id) return;
    
    this.setState({ loading: true, error: null });
    try {
      // @ts-ignore
      const ky = (await import('ky')).default;
      const response = await ky(`https://api.escuelajs.co/api/v1/products/${params.id}`).json();
      this.setState({ product: response as Product, loading: false });
    } catch (err) {
      this.setState({ error: 'Failed to load product details', loading: false });
    }
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleAddToCart = (product: Product) => {
    this.context.addToCart(product);
    this.setState({ isFlying: true });
    setTimeout(() => this.setState({ isFlying: false }), 800);
    
    toast.success(`${product.title} added to cart!`, {
      icon: <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 100-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /></svg>,
      style: { borderRadius: '16px', fontWeight: 'bold', color: '#1e1b4b' }
    });
  };

  handleRemoveOne = (productId: number, title: string) => {
    this.context.removeFromCart(productId);
    toast.info(`Removed one ${title}`, {
      icon: <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" /></svg>,
      style: { borderRadius: '16px', fontWeight: 'bold' }
    });
  };

  render() {
    const { product, loading, error, selectedImage, windowWidth, isFlying } = this.state;
    const isMobile = windowWidth < 768;
    const cart = this.context;

    if (loading) {
      return (
        <div className="page-transition flex flex-col items-center justify-center py-40">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      );
    }

    if (error || !product) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="page-transition flex flex-col items-center justify-center py-20"
        >
          <div className="text-6xl mb-6">😕</div>
          <p className="text-gray-500 text-lg font-medium mb-6">Product not found</p>
          <button
            onClick={() => this.props.navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold btn-hover"
          >
            Back to Home
          </button>
        </motion.div>
      );
    }

    const quantity = cart.getItemQuantity(product.id);
    const images = product.images?.map(cleanImageUrl) || [];

    return (
      <div className="page-transition relative">
        <div className="sticky top-6 z-50 mb-8 pointer-events-none">
          <BackButton to="/" label="Back to Explore" />
        </div>

        <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-8 bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100`}>
          <div className={`${isMobile ? 'w-full' : 'w-1/2'} p-8 md:p-10 relative`}>
            <motion.div 
              layoutId={`product-image-${product.id}`}
              className="relative rounded-3xl overflow-hidden bg-gray-50 aspect-square"
            >
              <img
                src={images[selectedImage] || images[0]}
                alt={product.title}
                className="w-full h-full object-cover transition-all duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=No+Image&background=e2e8f0&color=64748b&size=400';
                }}
              />
            </motion.div>

            <AnimatePresence>
              {isFlying && (
                <motion.div
                  initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                  animate={{ 
                    x: window.innerWidth > 768 ? 500 : 0, 
                    y: window.innerHeight > 768 ? 500 : 800, 
                    scale: 0.1, 
                    opacity: 0 
                  }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="fixed z-[100] w-32 h-32 pointer-events-none"
                  style={{ 
                    top: '20%', 
                    left: '20%',
                  }}
                >
                  <img
                    src={images[selectedImage] || images[0]}
                    alt=""
                    className="w-full h-full object-cover rounded-2xl shadow-2xl border-4 border-white"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {images.length > 1 && (
              <div className="flex gap-4 mt-6 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => this.setState({ selectedImage: i })}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedImage === i ? 'border-indigo-500 shadow-xl shadow-indigo-100 scale-105' : 'border-gray-100 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Img&background=e2e8f0&color=64748b&size=64';
                    }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={`${isMobile ? 'w-full' : 'w-1/2'} p-8 md:p-12 flex flex-col`}>
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-black rounded-full w-fit mb-6 uppercase tracking-[0.2em]"
            >
              {product.category?.name}
            </motion.span>

            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-6 tracking-tighter"
            >
              {product.title}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 leading-relaxed mb-8 text-base md:text-lg font-medium flex-grow"
            >
              {product.description}
            </motion.p>

            <div className="border-t-2 border-gray-50 pt-8 mt-auto">
              <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Total Price</span>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-black text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-xs text-gray-400 font-bold mb-2 uppercase tracking-tighter">INC. GST</span>
                  </div>
                </div>
                
                <AnimatePresence>
                  {quantity > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8, x: 20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.8, x: 20 }}
                      className="flex items-center gap-5 bg-gray-900 px-5 py-2.5 rounded-[20px] shadow-xl shadow-gray-200"
                    >
                      <button 
                        onClick={() => this.handleRemoveOne(product.id, product.title)}
                        className="text-white hover:text-rose-400 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="text-xl font-black text-white min-w-[24px] text-center">
                        {quantity}
                      </span>
                      <button 
                        onClick={() => this.handleAddToCart(product)}
                        className="text-white hover:text-emerald-400 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                data-testid="add-to-cart-btn"
                onClick={() => this.handleAddToCart(product)}
                className={`w-full py-5 rounded-[24px] font-black text-xl transition-all duration-500 bg-gray-900 text-white shadow-2xl shadow-gray-300 hover:bg-indigo-600 hover:shadow-indigo-200 flex items-center justify-center gap-3`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {quantity > 0 ? 'Add Another' : 'Add to Bag'}
              </motion.button>
            </div>
          </div>
        </div>

        <div className="h-32" />
      </div>
    );
  }
}

export default withRouter(observer(ProductDetail));
