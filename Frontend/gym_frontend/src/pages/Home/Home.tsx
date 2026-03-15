import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const [currentHeroIndex, setCurrentHeroIndex] = React.useState(0);
  const navigate = useNavigate();

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
        setInitialProducts(res.products);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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
        className="relative overflow-hidden bg-gradient-to-br from-[#179149] via-[#0D5229] to-[#0A3F1F] min-h-[calc(100vh-5rem)] h-auto py-20 lg:py-0"
      >
        {/* Multiple Gradient Overlays for Depth and Dimension */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.1)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,rgba(255,140,0,0.1)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.05)_0%,transparent_50%)]" />

        {/* Subtle Modern Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

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
              <div className="absolute -inset-12 bg-gradient-to-r from-white/0 via-white/5 to-white/0 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Brand Name Script with Enhanced Animation */}
              <motion.span
                initial={{ rotate: -5, opacity: 0, y: 10 }}
                animate={{ rotate: -8, opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="block font-script text-4xl md:text-6xl lg:text-7xl text-white/90 mb-[-12px] ml-2 md:ml-4 drop-shadow-2xl hover:scale-105 transition-transform"
              >
                NUVELIFE
              </motion.span>

              {/* "MUSCLE & POWER" Bold Distressed with Glow Effect */}
              <motion.h1
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.2, type: "spring" }}
                className="font-bebas text-7xl md:text-8xl lg:text-6xl xl:text-[7rem] leading-[0.85] text-white tracking-tight mb-4 drop-shadow-2xl"
                style={{
                  textShadow: "0 0 30px rgba(0,0,0,0.5), 0 10px 20px rgba(0,0,0,0.3)"
                }}
              >
                MUSCLE & <br /> <span className="text-[#FF6B00] drop-shadow-[0_0_20px_rgba(255,107,0,0.5)]">POWER</span>
              </motion.h1>

              {/* "Limited time only" with Pulsing Animation */}
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="block font-script text-3xl md:text-5xl text-white mt-3 drop-shadow-lg"
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
                  <motion.span
                    className="font-script text-2xl md:text-3xl text-white block rotate-[-10deg] drop-shadow-2xl relative z-10"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <br /> <span className="text-[#FF6B00]">Quality</span> Guaranteed
                  </motion.span>
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
                    className="bg-[#FF6B00] text-white px-8 py-3 rounded-full font-bebas text-lg tracking-wider flex items-center gap-3 shadow-xl transition-all group"
                  >
                    <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center group-hover:bg-[#179149] transition-colors">
                      <ArrowRight size={16} className="text-[#FF6B00] group-hover:text-white" />
                    </div>
                    EXPLORE NOW
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Side - Changing Products with Enhanced Visuals */}
          <div className="w-full lg:w-1/2 h-full flex items-center justify-center relative mt-12 lg:mt-0">
            <div className="relative w-full py-12 max-w-[380px] aspect-square flex items-center justify-center">
              {/* Animated Background Circle */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
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
                  <motion.div
                    whileHover={{ scale: 1.12, rotate: 8, y: -15 }}
                    className="relative group cursor-pointer flex items-center justify-center w-[280px] h-[280px]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/20 rounded-full blur-2xl -z-10" />

                    <motion.div
                      className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[70%] h-8 bg-black/40 blur-2xl rounded-full group-hover:bg-black/50 transition-all"
                      animate={{
                        scale: [0.9, 1.1, 0.9],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />

                    <img
                      src={HERO_IMAGES[currentHeroIndex].src}
                      alt={HERO_IMAGES[currentHeroIndex].name}
                      className="w-[90%] h-[90%] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Bottom Center CTA - Enhanced */}
        <motion.div
          className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-30 lg:hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          <Link to="/products">
            <motion.button
              whileHover={{ scale: 1.08, boxShadow: "0 25px 50px rgba(0,0,0,0.4)" }}
              whileTap={{ scale: 0.95 }}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="bg-[#FF6B00] text-white px-8 md:px-12 py-4 rounded-full font-bebas text-lg md:text-2xl tracking-wider flex items-center gap-3 shadow-2xl transition-all group"
            >
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
              className={`rounded-full transition-all duration-300 ${idx === currentHeroIndex ? 'bg-white shadow-xl' : 'bg-white/40 hover:bg-white/60'}`}
              style={{ width: idx === currentHeroIndex ? 32 : 12, height: 12 }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </motion.div>
      </section>

      <AutomaticBannerSlider />

      {/* <Categories /> */}

      {/* 3. BEST SELLERS SECTION */}
      <section className="py-24 bg-white border-b-[4px] border-black relative overflow-hidden">
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="space-y-4">
              <span className="text-[#FF6B00] font-syne font-black tracking-[0.2em] uppercase text-sm bg-black px-4 py-2 inline-block border-[2px] border-black shadow-[4px_4px_0_#F5F0E8] -rotate-1">
                ELITE SELECTIONS
              </span>
              <h2 className="text-5xl md:text-8xl font-syne font-black text-black uppercase leading-[0.8] tracking-tighter">
                BEST <span className="text-white bg-black px-4 pt-2 inline-block shadow-[8px_8px_0_#FF6B00]">SELLERS</span>
              </h2>
            </div>
            <Link to="/products" className="flex items-center gap-3 bg-white text-black hover:bg-[#179149] hover:text-white px-8 py-4 font-syne font-black uppercase tracking-widest text-sm border-[3px] border-black shadow-[6px_6px_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0_#000] transition-all group">
              VIEW ARSENAL <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" strokeWidth={3} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {loading ? (
              <div className="flex justify-center py-20 col-span-full border-[4px] border-black bg-[#F5F0E8] shadow-[8px_8px_0_#000]"><NuvelifeLoader /></div>
            ) : initialProducts.length > 0 ? (
              initialProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 2).map((product, idx) => (
                <div key={product.id} className="bg-white border-[4px] border-black shadow-[12px_12px_0_#000] flex flex-col xl:flex-row transition-all group relative">
                  {/* Category Sticker */}
                  <div className="absolute -top-4 -right-4 bg-[#FF6B00] text-white font-syne font-black px-3 py-1 border-[3px] border-black shadow-[4px_4px_0_#000] z-30 rotate-3 uppercase text-xs">
                    {product.category?.split(' ')[0] || 'ELITE'}
                  </div>

                  <div className="w-full xl:w-1/2 aspect-square bg-[#F5F0E8] border-b-[4px] xl:border-b-0 xl:border-r-[4px] border-black flex items-center justify-center p-10 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }}></div>
                    <img src={product.images?.[0] || '/placeholder.png'} alt={product.name} className="w-[85%] h-[85%] object-contain group-hover:scale-110 transition-transform duration-500 z-10 drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)]" />
                  </div>
                  <div className="w-full xl:w-1/2 p-8 flex flex-col justify-between bg-white">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 5) ? 'fill-[#FF6B00] text-[#FF6B00]' : 'text-black/10'}`} strokeWidth={2.5} />
                        ))}
                      </div>
                      <h3 className="text-3xl xl:text-4xl font-syne font-black text-black mb-4 uppercase leading-[0.9] tracking-tighter">
                        {product.name}
                      </h3>
                      <p className="text-black font-bold text-sm uppercase leading-relaxed tracking-wider mb-8 line-clamp-3">
                        {product.description || 'Precision engineered formula for peak physiological performance.'}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-auto border-t-[4px] border-black pt-8">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-[#FF6B00] tracking-widest">UNIT PRICE</span>
                        <span className="text-4xl font-syne font-black text-black">Rs.{product.price}</span>
                      </div>
                      <button
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="bg-[#179149] text-white p-5 border-[3px] border-black shadow-[4px_4px_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_#000] active:translate-y-0 active:translate-x-0 active:shadow-none transition-all"
                      >
                        <ShoppingCart size={28} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-black font-syne font-black col-span-full py-20 border-[4px] border-black bg-[#F5F0E8] shadow-[12px_12px_0_#000] uppercase text-2xl">
                MANIFEST EMPTY
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US SECTION - Industrial Style */}
      <section className="py-24 bg-[#F5F0E8] border-b-[4px] border-black relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[8px] bg-black"></div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-center">
            <div className="lg:col-span-8">
              <h2 className="text-6xl md:text-9xl font-syne font-black text-black uppercase leading-[0.8] tracking-tighter">
                WHY CHOOSE <br /><span className="text-[#179149] font-script normal-case tracking-normal">Nuvelife</span>
              </h2>
            </div>
            <div className="lg:col-span-4 bg-white border-[3px] border-black p-6 shadow-[6px_6px_0_#FF6B00] rotate-2">
              <p className="font-syne font-black uppercase text-xs tracking-[0.2em] text-black">
                WE DISMANTLED THE TRADITIONAL MODEL TO BUILD A BRAND CENTERED ON TRANSPARENCY AND RESULTS.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {[
              { icon: <Shield className="text-white" size={40} strokeWidth={3} />, title: "PREMIUM GRADE", desc: "Clinically-dosed components for maximum efficacy.", bg: "bg-[#FF6B00]" },
              { icon: <Zap className="text-white" size={40} strokeWidth={3} />, title: "LAB VERIFIED", desc: "Third-party tested to ensure absolute purity.", bg: "bg-black" },
              { icon: <Award className="text-white" size={40} strokeWidth={3} />, title: "RAPID RECOVERY", desc: "Formulated to terminate fatigue instantly.", bg: "bg-[#179149]" },
              { icon: <ShieldCheck className="text-white" size={40} strokeWidth={3} />, title: "PRO PROTOCOL", desc: "Used by elite professionals worldwide.", bg: "bg-[#FF6B00]" }
            ].map((benefit, idx) => (
              <div key={idx} className="bg-white border-[4px] border-black shadow-[8px_8px_0_#000] p-8 flex flex-col group hover:-translate-y-2 hover:-translate-x-2 transition-all">
                <div className={`w-20 h-20 ${benefit.bg} border-[3px] border-black shadow-[4px_4px_0_#000] flex items-center justify-center mb-10 transform -rotate-6 group-hover:rotate-0 transition-transform`}>
                  {benefit.icon}
                </div>
                <h3 className="text-2xl font-syne font-black text-black mb-4 uppercase tracking-tighter leading-none">
                  {benefit.title}
                </h3>
                <p className="text-black text-sm font-bold uppercase tracking-widest leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CORE VALUES / MISSION - Bold Contrast */}
      <section className="py-24 bg-white border-b-[4px] border-black overflow-hidden relative">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center px-6 relative z-10">
          <div className="space-y-12">
            <div>
              <span className="text-white bg-[#FF6B00] font-syne font-black uppercase tracking-[0.2em] text-xs border-[2px] border-black shadow-[4px_4px_0_#000] px-4 py-2 inline-block mb-8 -rotate-2">
                MISSION STATEMENT
              </span>
              <h2 className="text-6xl md:text-8xl font-syne font-black text-black uppercase leading-[0.8] tracking-tighter">
                SCIENCE OVER <br /><span className="text-white bg-black px-4 pt-2 shadow-[8px_8px_0_#179149]">SPECULATION</span>
              </h2>
            </div>

            <div className="bg-[#F5F0E8] border-[4px] border-black p-8 md:p-12 shadow-[12px_12px_0_#000] relative">
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-[#179149] border-[3px] border-black rounded-full flex items-center justify-center text-white z-10 shadow-[4px_4px_0_#000]">
                <ShieldCheck size={32} strokeWidth={3} />
              </div>
              <p className="text-xl md:text-2xl text-black font-syne font-black uppercase leading-[1.2] tracking-tighter italic">
                NUVE LIFE WAS BORN FROM A SINGULAR FRUSTRATION. WE DISMANTLED THE TRADITIONAL MODEL TO BUILD A BRAND CENTERED ON TRANSPARENCY AND PROVEN RESULTS.
              </p>
            </div>

            <div className="flex flex-wrap gap-6">
              <div className="bg-black text-white border-[3px] border-[#179149] shadow-[6px_6px_0_#000] px-8 py-6 hover:-translate-y-1 transition-transform">
                <h4 className="font-syne font-black uppercase text-xl mb-1">99.9% PURITY</h4>
                <p className="font-syne font-bold uppercase text-[10px] tracking-[0.2em] text-[#179149]">CERTIFIED LABORATORY BATCH TESTING</p>
              </div>
              <div className="bg-white text-black border-[3px] border-[#FF6B00] shadow-[6px_6px_0_#000] px-8 py-6 hover:-translate-y-1 transition-transform">
                <h4 className="font-syne font-black uppercase text-xl mb-1">ZERO FILLERS</h4>
                <p className="font-syne font-bold uppercase text-[10px] tracking-[0.2em] text-[#FF6B00]">MAXIMUM BIO-AVAILABILITY DRIVEN</p>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-black border-[4px] border-black transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
            <div className="relative aspect-[4/5] bg-[#F5F0E8] border-[4px] border-black overflow-hidden shadow-[16px_16px_0_#FF6B00]">
              <img
                src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&w=1000"
                className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700"
                alt="Elite Standard"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-8 left-8 right-8 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <p className="bg-white border-[3px] border-black p-4 font-syne font-black uppercase tracking-tighter text-xl text-center shadow-[6px_6px_0_#FF6B00]">
                  THE STANDARD OF EXCELLENCE
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. START YOUR JOURNEY - High Voltage Style */}
      <section className="bg-black py-40 md:py-60 text-center relative overflow-hidden flex flex-col items-center justify-center">
        {/* Animated Background Element */}
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden select-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-syne font-black text-[#FF6B00] animate-pulse">
            NUVE
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10 space-y-16">
          <div className="space-y-6">
            <h2 className="text-6xl md:text-[10rem] font-syne font-black uppercase tracking-tight leading-[0.8] text-white">
              START YOUR <br /><span className="text-[#FF6B00] drop-shadow-[0_10px_20px_rgba(255,107,0,0.3)]">JOURNEY</span>
            </h2>
            <p className="text-white font-syne font-black text-xl md:text-3xl uppercase tracking-widest border-[3px] border-[#179149] inline-block px-10 py-6 bg-black/50 backdrop-blur-sm shadow-[8px_8px_0_#179149] -rotate-1">
              BUILD YOUR ULTIMATE FOUNDATION.
            </p>
          </div>

          <div className="flex justify-center pt-8">
            <Link to="/products" className="group relative inline-block">
              {/* Button Shadow Layer */}
              <div className="absolute inset-0 bg-[#179149] border-[4px] border-black transition-transform group-hover:translate-x-3 group-hover:translate-y-3"></div>

              {/* Main Button Layer */}
              <div className="relative bg-[#FF6B00] text-white border-[4px] border-black px-12 md:px-20 py-8 font-syne font-black text-3xl md:text-5xl uppercase transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1 group-active:translate-x-1 group-active:translate-y-1">
                <span className="flex items-center gap-6">
                  SHOP ALL PRODUCTS <ArrowRight size={48} strokeWidth={4} />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
