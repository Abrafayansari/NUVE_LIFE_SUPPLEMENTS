import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, ShieldCheck, Target, Award, FlaskConical, ChevronLeft, ChevronRight, Star, Badge, ShoppingCart, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Slider from '../../components/Slider.tsx';
import Categories from './Categories.tsx';
import ProductCard from '../../components/ProductCard.tsx';
import { fetchProducts } from '../../data/Product.tsx';
import { MOCK_PRODUCTS } from '../../mockData.ts';
import NuvelifeLoader from '../../components/NuvelifeLoader';
import AutomaticBannerSlider from '../../components/AutomaticBannerSlider';
import { Product } from '@/types.ts';

const Home: React.FC = () => {
  const [initialProducts, setInitialProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const productsPerSlide = 3;
  const totalSlides = initialProducts.length > 0 ? Math.ceil(initialProducts.length / productsPerSlide) : 1;
  const [currentHeroIndex, setCurrentHeroIndex] = React.useState(0);

  // Background removed hero images from public folder
  const HERO_IMAGES = [
    { src: '/1.png', name: 'Premium Supplement', price: '$49.99' },
    { src: '/2.png', name: 'Muscle Builder', price: '$59.99' },
    { src: '/3.png', name: 'Power Boost', price: '$69.99' }
  ];

  React.useEffect(() => {
    setLoading(true);
    fetchProducts({ sort: 'newest', limit: 10 })
      .then((res) => {
        console.log('Fetched products:', res.products);
        setInitialProducts(res.products);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const HERO_PRODUCTS = initialProducts.slice(0, 3);

  // Auto-change hero image every 6 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [HERO_IMAGES.length]);

  // Navigation functions for New Arrivals slider
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Get the current slide products
  const getCurrentSlideProducts = () => {
    const startIndex = currentSlide * productsPerSlide;
    const products = initialProducts.slice(startIndex, startIndex + productsPerSlide);
    console.log('Current slide products:', products, 'for slide:', currentSlide);
    return products;
  };

  return (
    <div className="pb-0 overflow-x-hidden">
      {/* 1. HERO SECTION - Enhanced with Advanced Animations and Visuals */}

      <section
        id="home"
        className="relative overflow-hidden bg-gradient-to-br from-vibrant-orange via-vibrant-orange to-[#FF8C00] min-h-[calc(100vh-5rem)] h-auto py-20 lg:py-0"
      >
        {/* Multiple Gradient Overlays for Depth and Dimension */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.3)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,rgba(255,140,0,0.2)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />

        {/* Subtle Modern Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

        {/* Decorative Diagonal Lines */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }} />

        <div className="relative z-20 h-full max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-12 py-12">

          {/* Left Side - Large Editorial Text with Enhanced Animations */}
          <div className="w-full lg:w-1/2 text-center lg:text-left flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              {/* Animated Background Glow for Text */}
              <div className="absolute -inset-12 bg-gradient-to-r from-white/0 via-white/10 to-white/0 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Brand Name Script with Enhanced Animation */}
              <motion.span
                initial={{ rotate: -5, opacity: 0, y: 10 }}
                animate={{ rotate: -8, opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="block font-script text-4xl md:text-6xl lg:text-7xl text-white mb-[-12px] ml-2 md:ml-4 drop-shadow-2xl hover:scale-105 transition-transform"
              >
                NUVELIFE
              </motion.span>

              {/* "MUSCLE & POWER" Bold Distressed with Glow Effect */}
              <motion.h1
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.2, type: "spring" }}
                className="font-bebas text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] leading-[0.85] text-white text-distressed tracking-tight mb-4 drop-shadow-2xl"
                style={{
                  textShadow: "0 0 30px rgba(255,140,0,0.5), 0 0 60px rgba(255,215,0,0.3), 0 10px 20px rgba(0,0,0,0.3)"
                }}
              >
                MUSCLE & <br /> <span className="text-charcoal drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]">POWER</span>
              </motion.h1>

              {/* "Limited time only" with Pulsing Animation */}
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="block font-script text-3xl md:text-5xl text-golden-yellow mt-3 drop-shadow-lg"
                style={{
                  textShadow: "0 0 15px rgba(255,215,0,0.6)"
                }}
              >
                Unleash Your Potential
              </motion.span>

              {/* Free Delivery Badge with Enhanced Arrow Animation */}
              <motion.div
                initial={{ opacity: 0, rotate: -15, x: 20 }}
                animate={{ opacity: 1, rotate: 0, x: 0 }}
                transition={{ delay: 0.7, duration: 0.7 }}
                className="absolute -top-12 right-0 lg:right-20 hidden md:block group"
              >
                <div className="relative">
                  {/* Background glow for delivery badge */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-golden-yellow/20 to-white/10 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <motion.span
                    className="font-script text-2xl md:text-3xl text-white block rotate-[-10deg] drop-shadow-2xl relative z-10"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                      textShadow: "0 0 20px rgba(255,215,0,0.8), 0 2px 4px rgba(0,0,0,0.5)"
                    }}
                  >
                    ðŸšš FREE <br /> <span className="text-golden-yellow">Express</span> Delivery
                  </motion.span>

                  <motion.svg
                    className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-12 h-12 text-golden-yellow opacity-80"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    animate={{ y: [0, 5, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                  >
                    <path d="M12 5c0 0-5 2-5 7s5 7 5 7M12 5c0 0 5 2 5 7s-5 7-5 7" strokeLinecap="round" />
                    <path d="M7 12h10M14 9l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>

                  {/* Sparkle effect */}
                  <motion.div
                    className="absolute -top-2 -right-2 w-2 h-2 bg-golden-yellow rounded-full"
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 1
                    }}
                  />
                </div>
              </motion.div>

              {/* CTA Button for Desktop Left */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="mt-8 hidden md:block"
              >
                <Link to="/products">
                  <motion.button
                    whileHover={{ scale: 1.08, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-vibrant-orange px-8 py-3 rounded-full font-bebas text-lg tracking-wider flex items-center gap-3 shadow-xl transition-all group"
                  >
                    <div className="w-7 h-7 bg-vibrant-orange rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
                      <ArrowRight size={16} className="text-white group-hover:text-vibrant-orange" />
                    </div>
                    EXPLORE NOW
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Side - Changing Products with Enhanced Visuals */}
          <div className="w-full lg:w-1/2 h-full flex items-center justify-center relative">
            <div className="relative w-full py-12 max-w-[380px] aspect-square flex items-center justify-center">
              {/* Animated Background Circle */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Rotating Background Accent */}
              <motion.div
                className="absolute inset-0 rounded-full border border-white/20 opacity-40"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentHeroIndex}
                  initial={{ opacity: 0, scale: 0.4, rotate: -25 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.4, rotate: 25 }}
                  transition={{ duration: 0.6, type: "spring", damping: 12, stiffness: 120 }}
                  className="absolute inset-0 flex items-center justify-center z-10"
                >
                  {/* Product Image Container with Gradient Background */}
                  <motion.div
                    whileHover={{ scale: 1.12, rotate: 8, y: -15 }}
                    className="relative group cursor-pointer flex items-center justify-center w-[280px] h-[280px]"
                  >
                    {/* Gradient Background for Image */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/20 rounded-full blur-2xl -z-10" />

                    {/* Shadow Enhancement */}
                    <motion.div
                      className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[70%] h-8 bg-black/25 blur-3xl rounded-full group-hover:bg-black/40 transition-all"
                      animate={{
                        scale: [0.9, 1.1, 0.9],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />

                    {/* Product Image with Better Styling */}
                    <img
                      src={HERO_IMAGES[currentHeroIndex].src}
                      alt={HERO_IMAGES[currentHeroIndex].name}
                      className="w-[90%] h-[90%] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)] filter brightness-110 contrast-110"
                      referrerPolicy="no-referrer"
                    />

                    {/* Enhanced Hover Info Tooltip */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="absolute top-full mt-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-charcoal to-black/90 text-white px-6 py-3 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none shadow-2xl z-30 border border-white/20"
                      style={{
                        textShadow: "0 2px 4px rgba(0,0,0,0.5)"
                      }}
                    >
                      {HERO_IMAGES[currentHeroIndex].name} â€¢ {HERO_IMAGES[currentHeroIndex].price}
                    </motion.div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Bottom Center CTA - Enhanced */}
        <motion.div
          className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          <Link to="/products">
            <motion.button
              whileHover={{ scale: 1.08, boxShadow: "0 25px 50px rgba(0,0,0,0.4)" }}
              whileTap={{ scale: 0.95 }}
              animate={{
                y: [0, -5, 0]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="bg-white text-vibrant-orange px-8 md:px-12 py-4 rounded-full font-bebas text-lg md:text-2xl tracking-wider flex items-center gap-3 md:gap-4 shadow-2xl transition-all group"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 bg-vibrant-orange rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
                <ArrowRight size={20} className="text-white group-hover:text-vibrant-orange" />
              </div>
              ORDER NOW
            </motion.button>
          </Link>
        </motion.div>

        {/* Indicators - Enhanced */}
        <motion.div
          className="absolute bottom-8 md:bottom-12 right-6 md:right-10 flex gap-3 z-30"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          {HERO_IMAGES.map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => setCurrentHeroIndex(idx)}
              className={`rounded-full transition-all duration-300 ${idx === currentHeroIndex ? 'bg-white shadow-xl' : 'bg-white/40 hover:bg-white/60'
                }`}
              style={{
                width: idx === currentHeroIndex ? 32 : 12,
                height: 12
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </motion.div>
      </section>

      <AutomaticBannerSlider />

      {/* 3. BEST SELLERS SECTION - Clean White Design */}
      <motion.section
        className="py-24 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div>
              <motion.span
                className="text-brand font-bold tracking-[0.3em] uppercase mb-2 block text-sm"
                animate={{
                  color: ["#CC5500", "#E67E22", "#CC5500"]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Top Rated
              </motion.span>
              <motion.h2
                className="text-4xl md:text-6xl font-bebas tracking-wider text-brand-matte"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                BEST <span className="text-brand">SELLERS</span>
              </motion.h2>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link
                to="/products"
                className="flex items-center gap-2 text-brand-matte/60 hover:text-brand transition-colors font-bold uppercase tracking-widest text-sm group"
              >
                View All Products <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-12"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            {loading ? (
              <div className="flex items-center justify-center min-h-[300px] col-span-full">
                <NuvelifeLoader />
              </div>
            ) : initialProducts.length > 0 ? (
              initialProducts
                .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                .slice(0, 2)
                .map((product, idx) => (
                  <motion.div
                    key={product.id}
                    whileHover={{ y: -10 }}
                    className="bg-white rounded-3xl overflow-hidden border border-black/5 flex flex-col md:flex-row group shadow-sm hover:shadow-xl transition-all"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.2 }}
                  >
                    <div className="w-full md:w-1/2 aspect-square bg-gradient-to-br from-brand-warm/50 to-white flex items-center justify-center p-8 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <motion.img
                        src={product.images?.[0] || '/placeholder.png'}
                        alt={product.name}
                        className="w-full h-full object-contain relative z-10 drop-shadow-2xl"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                      <motion.span
                        className="text-brand font-bold uppercase tracking-widest mb-2 text-xs"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + idx * 0.2 }}
                      >
                        {product.category || 'SUPPLEMENT'}
                      </motion.span>

                      <motion.h3
                        className="text-2xl font-bold text-brand-matte mb-3 uppercase tracking-tight"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.55 + idx * 0.2 }}
                      >
                        {product.name}
                      </motion.h3>

                      <motion.p
                        className="text-brand-matte/60 text-sm mb-6 leading-relaxed"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 + idx * 0.2 }}
                      >
                        {product.description || 'Premium quality supplement trusted by customers'}
                      </motion.p>

                      {/* Rating */}
                      <motion.div
                        className="flex items-center gap-2 mb-6"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.65 + idx * 0.2 }}
                      >
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${i < Math.floor(product.rating || 0)
                                  ? 'text-brand'
                                  : 'text-brand-matte/20'
                                }`}
                            >
                              â˜…
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-brand-matte/50 font-bold">
                          ({product.reviewCount || product.reviews?.length || 0})
                        </span>
                      </motion.div>

                      <motion.div
                        className="flex items-center justify-between mt-auto"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.7 + idx * 0.2 }}
                      >
                        <span className="text-2xl font-bebas text-brand-matte">${product.price}</span>
                        <motion.button
                          onClick={() => console.log('Add to cart:', product.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="bg-brand text-white p-3 rounded-xl hover:bg-brand-matte hover:text-white transition-all shadow-lg shadow-brand/10"
                        >
                          <ShoppingCart size={20} />
                        </motion.button>
                      </motion.div>
                    </div>
                  </motion.div>
                ))
            ) : (
              <div className="text-center text-brand-matte col-span-full py-12">
                <p>No products available</p>
              </div>
            )}
          </motion.div>
        </div>
      </motion.section>


      {/* 2. WHY CHOOSE US SECTION - Dark Premium */}
      <motion.section
        className="py-24 bg-brand-matte relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:50px_50px] opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h2
              className="text-3xl md:text-5xl font-bebas tracking-wider text-brand-warm mb-4"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              WHY CHOOSE <span className="text-brand">OUR SUPPLEMENTS</span>
            </motion.h2>
            <motion.div
              className="h-1 w-24 bg-brand mx-auto"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            {[
              {
                icon: <Shield className="text-brand" size={32} />,
                title: "Premium Ingredients",
                description: "We source only the highest quality, clinically-dosed ingredients for maximum efficacy."
              },
              {
                icon: <Zap className="text-brand" size={32} />,
                title: "Lab Tested Quality",
                description: "Every batch is third-party tested to ensure purity, potency, and safety."
              },
              {
                icon: <Award className="text-brand" size={32} />,
                title: "Fast Muscle Recovery",
                description: "Our formulas are designed to get you back in the gym faster and stronger."
              },
              {
                icon: <ShieldCheck className="text-brand" size={32} />,
                title: "Trusted by Athletes",
                description: "Used by professional athletes and fitness enthusiasts worldwide."
              }
            ].map((benefit, idx) => (
              <motion.div
                key={idx}
                className="text-center group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 + idx * 0.1 }}
              >
                <motion.div
                  className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/5 group-hover:bg-brand/10 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {benefit.icon}
                </motion.div>
                <motion.h3
                  className="text-xl font-bold text-brand-warm mb-3 uppercase tracking-tight"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                >
                  {benefit.title}
                </motion.h3>
                <motion.p
                  className="text-brand-warm/60 text-sm leading-relaxed"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.55 + idx * 0.1 }}
                >
                  {benefit.description}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>



      {/* 4. STATS AREA - Matte Black (#0E0E0E) */}
      {/* <section className="py-40 bg-brand-matte border-y border-white/5 relative overflow-hidden">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-24 text-center relative z-10">
          {[
            { label: 'Integrity', val: '100%', sub: 'Third-Party Testing', icon: <ShieldCheck className="w-12 h-12 text-brand mx-auto" /> },
            { label: 'Absorption', val: 'MAX', sub: 'Maximum Results', icon: <Zap className="w-12 h-12 text-brand-gold mx-auto" /> },
            { label: 'Results', val: 'PROVEN', sub: 'Lab Tested', icon: <Target className="w-12 h-12 text-white mx-auto" /> }
          ].map((stat, i) => (
            <div key={i} className="space-y-8 group">
              <div className="group-hover:scale-125 transition-transform duration-700">
                {stat.icon}
              </div>
              <div className="space-y-3">
                <p className="text-brand-gold font-black uppercase tracking-widest text-[12px] opacity-40 group-hover:opacity-100 transition-opacity">{stat.label}</p>
                <h3 className="text-8xl lg:text-8xl md:text-8xl font-black text-white italic tracking-tighter leading-none">{stat.val}</h3>
                <p className="text-white/10 text-[11px] font-bold uppercase tracking-[0.4em]">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section> */}

      {/* 5. CORE VALUES (From About) - White */}
      <section className="py-32 bg-white container mx-auto px-6 max-w-full">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center px-6">
          <div className="space-y-12">
            <div className="space-y-4">
              <span className="text-brand font-black uppercase tracking-[0.4em] text-[11px]">Our Mission</span>
              <h2 className="text-5xl font-black text-brand-matte uppercase tracking-tighter leading-tight">
                SCIENCE OVER <span className="text-brand-gold italic">SPECULATION</span>
              </h2>
            </div>
            <p className="text-lg text-brand-matte/60 leading-relaxed font-light">
              NUVE LIFE was born from a singular frustration: the supplement industry's obsession with marketing over quality. We dismantled the traditional model to build a brand centered on transparency, high-quality ingredients, and proven results.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-brand-matte text-brand-gold flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="font-black uppercase tracking-widest text-sm text-brand-matte">Quality Standards</h4>
                <p className="text-[10px] text-brand-matte/50 leading-loose uppercase font-bold tracking-widest">Every batch is verified through third-party testing.</p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-brand-matte text-brand-gold flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
                <h4 className="font-black uppercase tracking-widest text-sm text-brand-matte">Maximum Absorption</h4>
                <p className="text-[10px] text-brand-matte/50 leading-loose uppercase font-bold tracking-widest">Optimized absorption rates for immediate results.</p>
              </div>
            </div>
          </div>
          <div className="relative aspect-[4/5] bg-brand-warm overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&w=1000"
              className="w-full h-full object-cover grayscale brightness-75 hover:scale-105 transition-transform duration-1000"
              alt="The Standard"
            />
            <div className="absolute inset-0 border-[20px] border-white/10 m-10"></div>
          </div>
        </div>
      </section>

      {/* 6. THE PROMISE (From About) - Matte Black */}
      {/* <section className="py-40 bg-brand-matte text-white relative">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-20">
          {[
            {
              icon: <Target className="w-12 h-12 text-brand" />,
              title: "PRECISION",
              desc: "Targeted formulas designed for specific fitness goals."
            },
            {
              icon: <Award className="w-12 h-12 text-brand-gold" />,
              title: "ELITE STATUS",
              desc: "Supplying the nutritional foundation for world-class athletes."
            },
            {
              icon: <ShieldCheck className="w-12 h-12 text-white" />,
              title: "INTEGRITY",
              desc: "Full label disclosure. Zero proprietary blends. Zero fillers."
            }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center space-y-8">
              {item.icon}
              <h3 className="text-2xl font-black uppercase tracking-[0.4em]">{item.title}</h3>
              <p className="text-white/40 text-sm font-bold uppercase tracking-widest leading-relaxed px-4">{item.desc}</p>
            </div>
          ))}
        </div>
      </section> */}

      {/* 7. QUALITY ASSURANCE (From About) - Warm White */}
      {/* <section className="py-32 bg-brand-warm border-y border-black/5">
        <div className="container mx-auto px-6 text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-5xl font-black text-brand-matte uppercase tracking-tighter">CERTIFIED <span className="text-brand">FACILITIES</span></h2>
            <div className="h-1 w-24 bg-brand-gold mx-auto"></div>
          </div>
          <p className="max-w-3xl mx-auto text-xl text-brand-matte/60 font-light leading-relaxed">
            Our labs operate at ISO-9001 and cGMP standards, utilizing advanced laboratory testing to ensure every gram of powder meets our exact specifications.
          </p>
          <div className="flex flex-wrap justify-center gap-20 opacity-30 grayscale pointer-events-none">
            <div className="text-4xl font-black tracking-tighter uppercase text-brand-matte">ISO-9001</div>
            <div className="text-4xl font-black tracking-tighter uppercase text-brand-matte">cGMP</div>
            <div className="text-4xl font-black tracking-tighter uppercase text-brand-matte">LAB-TESTED</div>
            <div className="text-4xl font-black tracking-tighter uppercase text-brand-matte">NSF-CERT</div>
          </div>
        </div>
      </section> */}

      {/* 8. CTA SECTION - Warm White (#FAFAFA) */}
      <section className="bg-brand-warm py-40 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-24 opacity-[0.03] pointer-events-none">
          <span className="text-[300px] font-black text-brand-matte uppercase select-none leading-none tracking-tighter">NUVELIFE</span>
        </div>
        <div className="container mx-auto px-6 relative z-10 space-y-16">
          <h2 className="text-6xl md:text-[9rem] font-black uppercase tracking-tighter leading-[0.8] text-brand-matte">START <br /><span className="text-brand">YOUR JOURNEY</span></h2>
          <p className="text-brand-matte/50 max-w-2xl mx-auto italic text-xl leading-relaxed">Choose the most advanced supplement brand for your fitness goals.</p>
          <div className="flex justify-center">
            <Link to="/signup" className="btn-luxury px-16 py-8 text-[14px] rounded-none shadow-[0_30px_60px_rgba(123,15,23,0.15)] hover:shadow-brand-gold/20">Join Now</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;


