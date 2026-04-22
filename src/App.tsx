import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { StoreProvider } from './context';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import CartFooter from './components/CartFooter';

class App extends React.Component {
  render() {
    return (
      <StoreProvider>
        <Router>
          <div className="max-w-6xl mx-auto px-4 md:px-6 min-h-screen font-sans text-gray-900 bg-gray-50">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id/details" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
            <CartFooter />
            <ToastContainer 
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </div>
        </Router>
      </StoreProvider>
    );
  }
}

export default App;
