import React from 'react';
import { observer } from 'mobx-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { cleanImageUrl, formatPrice } from '../utils';
import { withRouter, RouterProps } from '../withRouter';
import { StoreContext } from '../context';
import { CheckoutFormData } from '../types';

interface CartState {
  form: CheckoutFormData;
  step: 'cart' | 'shipping' | 'success';
  processing: boolean;
}

class Cart extends React.Component<RouterProps, CartState> {
  static contextType = StoreContext;
  context!: React.ContextType<typeof StoreContext>;

  state: CartState = {
    form: {
      fullName: '',
      email: '',
      address: '',
      city: '',
      zipCode: '',
      cardNumber: '',
      expiry: '',
      cvv: '',
    },
    step: 'cart',
    processing: false,
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState((prev) => ({
      form: { ...prev.form, [name]: value },
    }));
  };

  handlePlaceOrder = () => {
    this.setState({ processing: true });
    setTimeout(() => {
      this.context.clearCart();
      this.setState({ step: 'success', processing: false });
      toast.success('Order placed successfully!', { theme: 'colored' });
    }, 2000);
  };

  isFormValid = (): boolean => {
    const { fullName, email, address, city, zipCode, cardNumber, expiry, cvv } = this.state.form;
    return !!(fullName && email && address && city && zipCode && cardNumber && expiry && cvv);
  };

  handleRemoveItem = (id: number, title: string) => {
    this.context.removeItem(id);
    toast.error(`${title} removed from cart`);
  };

  renderCartItems = () => {
    const cart = this.context;
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-black text-gray-900">Your Shopping Cart</h2>
          {cart.items.length > 0 && (
            <button 
              onClick={() => cart.clearCart()}
              className="text-sm text-rose-500 font-bold hover:text-rose-600 transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              Clear All
            </button>
          )}
        </div>
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {cart.items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, x: -20 }}
                className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 group"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white border border-gray-100 flex-shrink-0">
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
                    <h3 className="text-base font-bold text-gray-900 truncate">{item.title}</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{item.category?.name}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-gray-100">
                      <button 
                        onClick={() => cart.removeFromCart(item.id)}
                        className="text-indigo-600 hover:text-indigo-700 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="text-sm font-black text-gray-900 min-w-[20px] text-center">{item.quantity}</span>
                      <button 
                        onClick={() => cart.addToCart(item)}
                        className="text-indigo-600 hover:text-indigo-700 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                    <button 
                      onClick={() => this.handleRemoveItem(item.id, item.title)}
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
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
          <div className="flex justify-between text-gray-500 font-medium">
            <span>Subtotal</span>
            <span className="text-gray-900 font-bold">{formatPrice(cart.totalPrice)}</span>
          </div>
          <div className="flex justify-between text-gray-500 font-medium">
            <span>GST (8%)</span>
            <span className="text-gray-900 font-bold">{formatPrice(cart.taxAmount)}</span>
          </div>
          <div className="flex justify-between text-xl font-black text-gray-900 pt-4 border-t border-gray-100">
            <span>Total Amount</span>
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {formatPrice(cart.grandTotal)}
            </span>
          </div>
        </div>

        <button
          onClick={() => this.setState({ step: 'shipping' })}
          className="w-full mt-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 btn-hover flex items-center justify-center gap-3"
        >
          Checkout Now
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7M3 12h18" />
          </svg>
        </button>
      </div>
    );
  };

  renderShippingForm = () => {
    const { form, processing } = this.state;
    const inputClass = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all";

    return (
      <div className="page-transition">
        <button
          onClick={() => this.setState({ step: 'cart' })}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 font-semibold mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Cart
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping & Payment</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Full Name</label>
            <input name="fullName" value={form.fullName} onChange={this.handleInputChange} placeholder="John Doe" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Email</label>
            <input name="email" type="email" value={form.email} onChange={this.handleInputChange} placeholder="john@example.com" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">City</label>
              <input name="city" value={form.city} onChange={this.handleInputChange} placeholder="Mumbai" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">PIN Code</label>
              <input name="zipCode" value={form.zipCode} onChange={this.handleInputChange} placeholder="400001" className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Address</label>
            <input name="address" value={form.address} onChange={this.handleInputChange} placeholder="Flat No, Building, Street" className={inputClass} />
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-700 mb-4">Payment Details</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Card Number</label>
                <input name="cardNumber" value={form.cardNumber} onChange={this.handleInputChange} placeholder="4242 4242 4242 4242" maxLength={19} className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Expiry</label>
                  <input name="expiry" value={form.expiry} onChange={this.handleInputChange} placeholder="MM/YY" maxLength={5} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">CVV</label>
                  <input name="cvv" type="password" value={form.cvv} onChange={this.handleInputChange} placeholder="***" maxLength={4} className={inputClass} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={this.handlePlaceOrder}
          disabled={!this.isFormValid() || processing}
          className={`w-full mt-6 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
            this.isFormValid() && !processing
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200 btn-hover'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {processing ? (
            <span className="inline-flex items-center gap-2">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing...
            </span>
          ) : (
            `Pay ${formatPrice(this.context.grandTotal)}`
          )}
        </button>
      </div>
    );
  };

  renderSuccess = () => {
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
          onClick={() => this.props.navigate('/')}
          className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 btn-hover"
        >
          Continue Shopping
        </button>
      </div>
    );
  };

  render() {
    const { step } = this.state;
    const cart = this.context;

    if (cart.totalItems === 0 && step !== 'success') {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="page-transition flex flex-col items-center justify-center py-20"
        >
          <div className="text-6xl mb-6">🛒</div>
          <p className="text-gray-500 text-lg font-medium mb-6">Your cart is empty</p>
          <button
            onClick={() => this.props.navigate('/')}
            className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 btn-hover"
          >
            Start Shopping
          </button>
        </motion.div>
      );
    }

    return (
      <div className="page-transition pb-20">
        <button
          onClick={() => this.props.navigate('/')}
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-indigo-600 font-semibold transition-colors mb-6 group"
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>

        <div className="max-w-3xl mx-auto bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100 p-6 md:p-10">
          {step !== 'success' && (
            <div className="flex items-center gap-4 mb-10 overflow-hidden">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${
                  step === 'cart' ? 'bg-indigo-600 text-white' : 'bg-emerald-500 text-white'
                }`}>
                  {step === 'cart' ? '1' : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className={`text-sm font-bold ${step === 'cart' ? 'text-gray-900' : 'text-gray-400'}`}>Cart</span>
              </div>
              <div className={`h-1 flex-grow rounded-full transition-colors duration-500 ${step === 'shipping' ? 'bg-indigo-600' : 'bg-gray-100'}`} />
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${
                  step === 'shipping' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'
                }`}>2</div>
                <span className={`text-sm font-bold ${step === 'shipping' ? 'text-gray-900' : 'text-gray-400'}`}>Shipping</span>
              </div>
            </div>
          )}

          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {step === 'cart' && this.renderCartItems()}
            {step === 'shipping' && this.renderShippingForm()}
            {step === 'success' && this.renderSuccess()}
          </motion.div>
        </div>
      </div>
    );
  }
}

export default withRouter(observer(Cart));
