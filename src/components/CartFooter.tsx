import React from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../context';
import { formatPrice } from '../utils';
import { withRouter, RouterProps } from '../withRouter';

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

    if (cart.totalItems === 0 || isCart) return null;

    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 footer-slide">
        <div className="max-w-5xl mx-auto px-4 pb-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-gray-300/50 border border-gray-200/60 px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`relative w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 ${isAnimating ? 'cart-pop' : ''}`}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {cart.totalItems}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">{cart.totalItems} item{cart.totalItems !== 1 ? 's' : ''}</p>
                <p className="text-lg font-extrabold text-gray-900">{formatPrice(cart.totalPrice)}</p>
              </div>
            </div>

            <button
              data-testid="cart-btn"
              onClick={() => this.props.navigate('/cart')}
              className="px-6 py-2.5 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              Go to Cart →
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(observer(CartFooter));
