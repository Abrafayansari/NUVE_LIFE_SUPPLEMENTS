import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, Heart, Package, LayoutDashboard, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { ToastContainer } from 'react-toast';
import { getCategories, Category } from '../data/Product';

const Navbar: React.FC = () => {
  const { totalItems } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = totalItems;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Navbar Container */}
      <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 w-full ${isScrolled ? 'bg-[#179149]/95 shadow-lg backdrop-blur-xl' : 'bg-[#179149] shadow-md'}`}>
        <ToastContainer />
        <div className="w-full px-4 sm:px-6 lg:px-12">
          <div className="flex justify-between items-center h-20 sm:h-24">

            {/* Left: Desktop Links */}
            <div className="hidden lg:flex flex-1 justify-start items-center space-x-6 xl:space-x-10">
              <Link to="/" className="text-[12px] font-black uppercase tracking-[0.15em] transition-all text-white flex items-center hover:text-[#FF6B00] group">
                Home
              </Link>

              {/* Shop Dropdown */}
              <div className="relative group/shop-dropdown">
                <Link
                  to="/products"
                  className="flex items-center text-[12px] font-black uppercase tracking-[0.15em] transition-all text-white hover:text-[#FF6B00]"
                >
                  Shop <ChevronDown className="w-3.5 h-3.5 ml-1 opacity-70 group-hover/shop-dropdown:rotate-180 transition-transform" />
                </Link>

                <div className="absolute left-0 mt-6 w-[500px] xl:w-[550px] opacity-0 translate-y-2 pointer-events-none group-hover/shop-dropdown:opacity-100 group-hover/shop-dropdown:translate-y-0 group-hover/shop-dropdown:pointer-events-auto transition-all duration-300 z-[70]">
                  <div className="bg-white border text-black border-gray-100 shadow-2xl p-5 xl:p-6 grid grid-cols-3 gap-4 xl:gap-6 rounded-md">
                    {categories.map((cat) => (
                      <div key={cat.name} className="space-y-2.5 xl:space-y-3">
                        <Link
                          to={`/products?category=${cat.name}`}
                          className="text-[10px] xl:text-[11px] font-black uppercase tracking-[0.2em] text-[#179149] border-b border-gray-100 pb-1.5 block truncate hover:text-[#FF6B00] transition-colors"
                          title={cat.name}
                        >
                          {cat.name.split(/[- ]/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                        </Link>
                        <div className="space-y-1.5">
                          {cat.subCategories.map((sub) => (
                            <Link
                              key={sub}
                              to={`/products?subCategory=${sub}`}
                              className="block text-[9px] xl:text-[10px] font-bold text-gray-500 hover:text-[#179149] uppercase tracking-widest transition-colors"
                            >
                              {sub.split(/[- ]/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                    {categories.length === 0 && (
                      <div className="col-span-3 text-center py-2 text-gray-400 text-[10px] uppercase font-black tracking-widest">
                        Loading Categories...
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Link to="/plans" className="text-[12px] font-black uppercase tracking-[0.15em] transition-all text-white flex items-center hover:text-[#FF6B00] group">
                Plans
              </Link>
              <Link to="/bundles" className="text-[12px] font-black uppercase tracking-[0.15em] transition-all text-white flex items-center hover:text-[#FF6B00] group">
                Bundles
              </Link>
              <Link to="/contact" className="text-[12px] font-black uppercase tracking-[0.15em] transition-all text-white flex items-center hover:text-[#FF6B00] group">
                Contact
              </Link>
            </div>

            {/* Center: Logo */}
            <div className="flex-1 flex justify-start lg:justify-center">
              <Link to="/" className="flex items-center gap-1.5 sm:gap-2 group shrink-0">
                <div className="flex flex-col justify-center">
                  <span className="text-xl sm:text-2xl md:text-3xl tracking-tighter uppercase font-bebas leading-none text-white">
                    NUVE<span className="text-[#FF6B00]">LIFE</span>
                  </span>
                  <span className="text-[7px] sm:text-[9px] tracking-[0.25em] uppercase font-bold text-white/80">
                    Nutrition Value Life
                  </span>
                </div>
              </Link>
            </div>

            {/* Right: Icons & Mobile Hamburger */}
            <div className="flex flex-1 justify-end items-center space-x-4 sm:space-x-6 lg:space-x-8">
              <div className="relative flex items-center">
                <AnimatePresence mode="wait">
                  {isSearchOpen && (
                    <motion.form
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: window.innerWidth < 640 ? 120 : 200, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      onSubmit={handleSearch}
                      className="absolute right-full mr-3"
                    >
                      <input
                        autoFocus
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="w-full bg-white text-black px-3 py-1.5 text-[10px] sm:text-[12px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-[#FF6B00] rounded-md transition-all shadow-lg"
                      />
                    </motion.form>
                  )}
                </AnimatePresence>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="transition-colors text-white hover:text-[#FF6B00]"
                >
                  {isSearchOpen ? <X className="w-5 h-5 md:w-6 md:h-6" /> : <Search className="w-5 h-5 md:w-6 md:h-6 stroke-[1.5px]" />}
                </button>
              </div>

              {/* Account */}
              {user ? (
                <div className="relative group/user-menu">
                  <Link to="/profile" className="flex items-center transition-colors text-white hover:text-[#FF6B00]">
                    <User className="w-5 h-5 md:w-6 md:h-6 stroke-[1.5px]" />
                  </Link>

                  {/* Dropdown Menu (Desktop) */}
                  <div className="absolute right-0 top-full mt-6 w-44 xl:w-48 opacity-0 translate-y-2 pointer-events-none group-hover/user-menu:opacity-100 group-hover/user-menu:translate-y-0 group-hover/user-menu:pointer-events-auto transition-all duration-300 z-[70] hidden lg:block">
                    <div className="bg-white border text-black border-gray-100 shadow-2xl overflow-hidden p-1.5 rounded-lg">
                      <div className="px-3 py-2 border-b border-gray-100 mb-1.5 text-center">
                        <p className="text-[10px] font-black uppercase tracking-tighter truncate">{user.name}</p>
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{user.role}</p>
                      </div>
                      {isAdmin && (
                        <Link to="/admin" className="flex items-center justify-center gap-2 px-3 py-2 text-[10px] font-black uppercase tracking-widest hover:text-[#FF6B00] hover:bg-gray-50 transition-colors border-b border-gray-100 mb-1.5 rounded-md">
                          <LayoutDashboard className="w-3.5 h-3.5" /> Admin
                        </Link>
                      )}
                      <Link to="/profile" className="flex items-center justify-center gap-2 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-[#FF6B00] hover:bg-gray-50 transition-colors rounded-md">
                        <User className="w-3.5 h-3.5" /> Account
                      </Link>
                      <Link to="/profile" className="flex items-center justify-center gap-2 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-[#FF6B00] hover:bg-gray-50 transition-colors rounded-md">
                        <Package className="w-3.5 h-3.5" /> Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex justify-center items-center gap-2 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-[#FF6B00] hover:text-white hover:bg-[#FF6B00] transition-colors mt-1.5 border-t border-gray-100 pt-3 rounded-b-md"
                      >
                        <X className="w-3.5 h-3.5" /> Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="transition-colors text-white hover:text-[#FF6B00]">
                  <User className="w-5 h-5 md:w-6 md:h-6 stroke-[1.5px]" />
                </Link>
              )}

              {/* Wishlist */}
              <Link to="/wishlist" className="relative transition-colors text-white hover:text-[#FF6B00] hidden sm:flex items-center group">
                <Heart className="w-5 h-5 md:w-6 md:h-6 stroke-[1.5px]" />
                <span className="absolute -top-1.5 -right-2 bg-[#FF6B00] text-white text-[9px] font-black w-[16px] h-[16px] flex items-center justify-center rounded-full leading-none group-hover:bg-white group-hover:text-[#FF6B00] transition-colors shadow-sm">
                  0
                </span>
              </Link>

              {/* Cart */}
              <Link to="/cart" className="relative transition-colors text-white hover:text-[#FF6B00] flex items-center group">
                <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 stroke-[1.5px]" />
                <span className="absolute -top-1.5 -right-2 bg-[#FF6B00] text-white text-[9px] font-black w-[16px] h-[16px] flex items-center justify-center rounded-full leading-none group-hover:bg-white group-hover:text-[#FF6B00] transition-colors shadow-sm">
                  {cartCount}
                </span>
              </Link>

              {/* Mobile Menu Trigger */}
              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                className="lg:hidden p-1 transition-colors z-[70] relative text-white hover:text-[#FF6B00]"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6 md:w-7 md:h-7 stroke-[2px]" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile/Tablet Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="mobile-menu-portal"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden bg-[#179149] fixed inset-0 z-[1000] overflow-y-auto font-sans"
          >
            <div className="flex flex-col min-h-screen px-4 sm:px-8 py-6 sm:py-8">
              <div className="flex justify-between items-center mb-8 sm:mb-12">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter">NUVE<span className="text-[#FF6B00]">LIFE</span></span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-white hover:text-[#FF6B00] transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col space-y-4 sm:space-y-5">
                <Link to="/" className="text-2xl sm:text-3xl font-black text-white hover:text-[#FF6B00] transition-colors uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>Home</Link>
                <Link to="/products" className="text-2xl sm:text-3xl font-black text-white hover:text-[#FF6B00] transition-colors uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>Shop All</Link>
                <Link to="/plans" className="text-2xl sm:text-3xl font-black text-white hover:text-[#FF6B00] transition-colors uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>Plans</Link>
                <Link to="/bundles" className="text-2xl sm:text-3xl font-black text-white hover:text-[#FF6B00] transition-colors uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>Bundles</Link>
                <Link to="/contact" className="text-2xl sm:text-3xl font-black text-white hover:text-[#FF6B00] transition-colors uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>Contact</Link>

                {isAdmin && (
                  <Link to="/admin" className="text-2xl sm:text-3xl font-black text-[#FF6B00] hover:text-white transition-colors uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>Admin Console</Link>
                )}
              </div>

              <div className="mt-10 pt-8 border-t border-white/10 space-y-8 mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {categories.map(cat => (
                    <div key={cat.name} className="space-y-3">
                      <Link
                        to={`/products?category=${cat.name}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="block text-sm font-black uppercase tracking-[0.2em] text-[#FF6B00] border-b border-[#FF6B00]/20 pb-1.5"
                      >
                        {cat.name.split(/[- ]/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                      </Link>
                      <div className="pl-2 space-y-2">
                        {cat.subCategories.map(sub => (
                          <Link
                            key={sub}
                            to={`/products?subCategory=${sub}`}
                            onClick={() => setIsMenuOpen(false)}
                            className="block text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors"
                          >
                            {sub.split(/[- ]/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col space-y-3 pt-8 border-t border-white/10">
                  <Link to="/wishlist" className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-white/50 hover:text-white" onClick={() => setIsMenuOpen(false)}>
                    <Heart className="w-4 h-4" /> Wishlist
                  </Link>
                  {user ? (
                    <>
                      <Link to="/profile" className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-white hover:text-[#FF6B00]" onClick={() => setIsMenuOpen(false)}>
                        <User className="w-4 h-4" /> My Account
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-[#FF6B00] hover:text-white"
                      >
                        <X className="w-4 h-4" /> Logout
                      </button>
                    </>
                  ) : (
                    <Link to="/login" className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-white/50 hover:text-white" onClick={() => setIsMenuOpen(false)}>
                      <User className="w-4 h-4" /> Login / Register
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
