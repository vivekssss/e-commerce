import React from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Product, Category } from '../types';
import { cleanImageUrl, formatPrice } from '../utils';
import { withRouter, RouterProps } from '../withRouter';
import { StoreContext } from '../context';
import { ProductCard } from '../components/ProductCard';
import { ProductSkeleton } from '../components/ProductSkeleton';
import { CategoryFilter } from '../components/CategoryFilter';

interface FlyingProduct {
  product: Product;
  startPos: { x: number; y: number };
}

interface HomeState {
  products: Product[];
  categories: Category[];
  selectedCategory: number | null;
  searchQuery: string;
  sortOrder: string;
  loading: boolean;
  error: string | null;
  flyingProduct: FlyingProduct | null;
}

class Home extends React.Component<RouterProps, HomeState> {
  static contextType = StoreContext;
  context!: React.ContextType<typeof StoreContext>;
  state: HomeState = {
    products: [],
    categories: [],
    selectedCategory: null,
    searchQuery: '',
    sortOrder: 'default',
    loading: true,
    error: null,
    flyingProduct: null,
  };

  searchTimeout: NodeJS.Timeout | null = null;

  componentDidMount() {
    const { searchParams } = this.props;
    const category = searchParams.get('category');
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'default';

    this.setState({
      selectedCategory: category ? parseInt(category) : null,
      searchQuery: search,
      sortOrder: sort,
    }, () => {
      this.fetchCategories();
      this.fetchProducts();
    });
  }

  componentDidUpdate(prevProps: RouterProps) {
    const prevParams = new URLSearchParams(prevProps.location.search);
    const currParams = this.props.searchParams;

    const prevCat = prevParams.get('category');
    const currCat = currParams.get('category');
    const prevSearch = prevParams.get('search') || '';
    const currSearch = currParams.get('search') || '';
    const prevSort = prevParams.get('sort') || 'default';
    const currSort = currParams.get('sort') || 'default';

    if (prevCat !== currCat || prevSearch !== currSearch || prevSort !== currSort) {
      this.setState({
        selectedCategory: currCat ? parseInt(currCat) : null,
        searchQuery: currSearch,
        sortOrder: currSort,
      }, () => {
        this.fetchProducts();
      });
    }
  }

  componentWillUnmount() {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
  }

  handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    let startPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      startPos = { x: e.clientX - 100, y: e.clientY - 100 }; // Use viewport coordinates
    }
    
    this.context.addToCart(product);
    this.setState({ flyingProduct: { product, startPos } });
    setTimeout(() => this.setState({ flyingProduct: null }), 800);
    
    toast.success(`${product.title} added to cart!`, { 
      icon: <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 100-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /></svg>, 
      style: { borderRadius: '16px', fontWeight: 'bold', color: '#1e1b4b' }
    });
  };

  handleRemoveOne = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.context.removeFromCart(product.id);
    toast.info(`Removed one ${product.title}`, { 
      icon: <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" /></svg>, 
      style: { borderRadius: '16px', fontWeight: 'bold' }
    });
  };

  fetchCategories = async () => {
    try {
      // @ts-ignore
      const ky = (await import('ky')).default;
      const data: any = await ky('https://api.escuelajs.co/api/v1/categories').json();
      this.setState({ categories: data });
    } catch (err) {
      this.setState({ error: 'Failed to load categories' });
    }
  };

  fetchProducts = async () => {
    const { selectedCategory, searchQuery } = this.state;
    this.setState({ loading: true, error: null });
    try {
      let url = 'https://api.escuelajs.co/api/v1/products/';
      const params = new URLSearchParams();
      if (selectedCategory) params.append('categoryId', selectedCategory.toString());
      if (searchQuery) params.append('title', searchQuery);
      
      const queryString = params.toString();
      if (queryString) {
        url += '?' + queryString;
      }
      
      // @ts-ignore
      const ky = (await import('ky')).default;
      const data: any = await ky(url).json();
      this.setState({ products: data, loading: false });
    } catch (err) {
      this.setState({ error: 'Failed to load products', loading: false });
    }
  };

  updateURL = (categoryId: number | null, search: string, sort: string, replace = false) => {
    const params = new URLSearchParams();
    if (categoryId) params.set('category', categoryId.toString());
    if (search) params.set('search', search);
    if (sort !== 'default') params.set('sort', sort);
    this.props.setSearchParams(params, { replace });
  };

  handleCategoryClick = (categoryId: number | null) => {
    const newCategory = this.state.selectedCategory === categoryId ? null : categoryId;
    this.updateURL(newCategory, this.state.searchQuery, this.state.sortOrder);
  };

  handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    this.setState({ searchQuery: query });

    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.updateURL(this.state.selectedCategory, query, this.state.sortOrder, true);
    }, 500);
  };

  handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sort = e.target.value;
    this.updateURL(this.state.selectedCategory, this.state.searchQuery, sort);
  };

  getSortedProducts = () => {
    const { products, sortOrder } = this.state;
    if (sortOrder === 'default') return products;

    return [...products].sort((a, b) => {
      switch (sortOrder) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'title_asc':
          return a.title.localeCompare(b.title);
        case 'title_desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  };



  renderProductCard = (product: Product, index: number) => {
    return (
      <ProductCard 
        key={product.id}
        product={product} 
        index={index} 
        onAddToCart={this.handleAddToCart}
        onRemoveOne={this.handleRemoveOne}
      />
    );
  };

  render() {
    const { categories, selectedCategory, loading, error, searchQuery, sortOrder } = this.state;
    const sortedProducts = this.getSortedProducts();

    return (
      <div className="page-transition pb-24">
        <header className="mb-12 pt-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-5"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-200 transform -rotate-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tighter leading-none">ShopWave</h1>
                <p className="text-xs text-gray-400 font-black mt-2 uppercase tracking-[0.3em]">Premium Collection</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex flex-col sm:flex-row gap-4 w-full lg:max-w-3xl"
            >
              <div className="relative flex-grow group">
                <span className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-600">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  id="search-input"
                  data-testid="search-input"
                  type="text"
                  placeholder="What are you looking for today?"
                  value={searchQuery}
                  onChange={this.handleSearchChange}
                  className="block w-full pl-11 pr-4 py-3.5 border-2 border-gray-100 rounded-2xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm font-medium transition-all duration-300 shadow-sm"
                />
              </div>
              <select
                id="sort-select"
                data-testid="sort-select"
                value={sortOrder}
                onChange={this.handleSortChange}
                className="sm:w-48 pl-4 pr-10 py-3.5 text-sm border-2 border-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-2xl bg-white text-gray-700 font-bold transition-all duration-300 shadow-sm cursor-pointer appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236B7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem' }}
              >
                <option value="default">Quick Sort</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="title_asc">Name: A-Z</option>
                <option value="title_desc">Name: Z-A</option>
              </select>
            </motion.div>
          </div>
        </header>

        <CategoryFilter 
          categories={categories} 
          selectedCategory={selectedCategory} 
          onCategoryClick={this.handleCategoryClick} 
        />

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-rose-50 border-2 border-rose-100 rounded-[40px] p-16 text-center max-w-xl mx-auto my-12 shadow-xl shadow-rose-100/50"
          >
            <div className="text-5xl mb-6">🛰️</div>
            <p className="text-rose-600 font-black text-xl mb-8 leading-relaxed">{error}</p>
            <button
              onClick={() => this.fetchProducts()}
              className="px-10 py-4 bg-rose-500 text-white rounded-2xl font-black shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all active:scale-95"
            >
              Reconnect
            </button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {loading ? <ProductSkeleton /> : sortedProducts.map((p, i) => this.renderProductCard(p, i))}
        </div>

        {!loading && sortedProducts.length === 0 && !error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-40 bg-white rounded-[60px] border-4 border-dashed border-gray-50"
          >
            <div className="text-8xl mb-8 grayscale opacity-10">🔭</div>
            <h3 className="text-3xl font-black text-gray-900 mb-3">Hidden Treasure?</h3>
            <p className="text-gray-400 font-bold text-lg max-w-md mx-auto">We couldn't find exactly what you were looking for. Try a different search!</p>
            <button 
              onClick={() => this.updateURL(null, '', 'default')}
              className="mt-10 px-8 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-black hover:bg-indigo-600 hover:text-white transition-all duration-300"
            >
              Clear Exploration
            </button>
          </motion.div>
        )}

        <AnimatePresence>
          {this.state.flyingProduct && (
            <motion.div
              initial={{ 
                x: this.state.flyingProduct.startPos.x, 
                y: this.state.flyingProduct.startPos.y, 
                scale: 0.8, 
                opacity: 1 
              }}
              animate={{ 
                x: window.innerWidth / 2 - 50, 
                y: window.innerHeight - 100, 
                scale: 0.1, 
                opacity: 0 
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="fixed z-[100] w-64 bg-white rounded-[32px] overflow-hidden shadow-2xl border border-gray-100 pointer-events-none"
              style={{ left: 0, top: 0 }}
            >
              <img 
                src={cleanImageUrl(this.state.flyingProduct.product.images?.[0])} 
                className="w-full h-64 object-cover" 
                alt=""
              />
              <div className="p-5">
                <h3 className="text-sm font-bold truncate">{this.state.flyingProduct.product.title}</h3>
                <span className="text-lg font-black text-indigo-600 block mt-2">
                  {formatPrice(this.state.flyingProduct.product.price)}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
}

export default withRouter(observer(Home));
