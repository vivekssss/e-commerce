import React from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../context';
import { formatPrice } from '../utils';
import { withRouter, RouterProps } from '../withRouter';
import { motion, AnimatePresence } from 'framer-motion';

interface FooterState {
  isAnimating: boolean;
  prevCount: number;
}

class CartFooter extends React.Component<RouterProps, FooterState> {
  static contextType = StoreContext;
  context!: React.ContextType<typeof StoreContext>;

  state: FooterState = {
    isAnimating: false,
    prevCount: 0,
  };

  componentDidUpdate() {
    const cart = this.context;
    if (cart.totalItems !== this.state.prevCount && cart.totalItems > 0) {
      this.setState({ isAnimating: true, prevCount: cart.totalItems });
      setTimeout(() => this.setState({ isAnimating: false }), 400);
    }
  }

  render() {
    const cart = this.context;
    const { isAnimating } = this.state;
    const isCart = this.props.location.pathname === '/cart';

    return (
      <AnimatePresence>
        {cart.totalItems > 0 && !isCart && (
          <motion.div 
            key="cart-footer"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50"
          >
            <div className="max-w-5xl mx-auto px-4 pb-4 md:pb-6">
              <div className="bg-white/95 backdrop-blur-xl rounded-2xl md:rounded-[24px] shadow-2xl shadow-indigo-100/50 border border-gray-200/60 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className={`relative w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 ${isAnimating ? 'cart-pop' : ''}`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                      {cart.totalItems}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs text-gray-400 font-medium">{cart.totalItems} item{cart.totalItems !== 1 ? 's' : ''}</p>
                    <p className="text-base md:text-xl font-extrabold text-gray-900">{formatPrice(cart.totalPrice)}</p>
                  </div>
                </div>

                <button
                  data-testid="cart-btn"
                  onClick={() => this.props.navigate('/cart')}
                  className="px-4 md:px-8 py-2.5 md:py-3.5 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl md:rounded-2xl font-bold text-xs md:text-sm shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
                >
                  <span className="hidden sm:inline">Go to Cart →</span>
                  <span className="sm:hidden">Checkout</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
}

export default withRouter(observer(CartFooter));
