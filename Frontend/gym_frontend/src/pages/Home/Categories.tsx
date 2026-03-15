import { Category, getCategories, fetchProducts } from '@/src/data/Product';
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

// Fallback high-quality images for categories
const fallbackImages: Record<string, string> = {
  protein: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=800',
  'pre-workout': 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&q=80&w=800',
  creatine: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=800',
  bcaa: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
  'mass-gainer': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800',
  vitamins: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&q=80&w=800',
  omega: 'https://images.unsplash.com/photo-1591195855210-5e8b3b0c17e2?auto=format&fit=crop&q=80&w=800',
  energy: 'https://images.unsplash.com/photo-1580910051070-16c34d7fdd18?auto=format&fit=crop&q=80&w=800',
  snacks: 'https://images.unsplash.com/photo-1601050695535-4c029d6110cf?auto=format&fit=crop&q=80&w=800',
  accessories: 'https://images.unsplash.com/photo-1599058917212-5da0c4485f5c?auto=format&fit=crop&q=80&w=800',
};

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [catsRes, prodsRes] = await Promise.all([
          getCategories(),
          fetchProducts({ limit: 100 })
        ]);
        setCategories(catsRes);
        setProducts(prodsRes.products);
      } catch (error) {
        console.error('Failed to load category data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left'
        ? scrollLeft - clientWidth / 2
        : scrollLeft + clientWidth / 2;

      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  if (loading || !categories.length) return null;

  return (
    <div className="py-20 bg-white border-b-[4px] border-black overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 mb-12 flex items-end justify-between">
        <div className="space-y-4">
          <span className="bg-[#179149] text-white font-syne font-black uppercase tracking-widest text-xs px-4 py-2 border-[3px] border-black shadow-[4px_4px_0_#000] inline-block -rotate-2">
            Protocol Areas
          </span>
          <h2 className="text-5xl md:text-7xl font-syne font-black text-black uppercase leading-[0.8] tracking-tighter">
            BROWSE <br /><span className="text-[#FF6B00]">CATEGORIES</span>
          </h2>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={() => scroll('left')}
            className="w-16 h-16 bg-white border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_#000] active:translate-y-0 active:translate-x-0 active:shadow-none transition-all"
          >
            <ChevronLeft className="w-8 h-8" strokeWidth={3} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-16 h-16 bg-[#FF6B00] text-white border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_#000] active:translate-y-0 active:translate-x-0 active:shadow-none transition-all"
          >
            <ChevronRight className="w-8 h-8" strokeWidth={3} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-8 px-6 md:px-12 pb-12 transition-all no-scrollbar scroll-smooth"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {categories.map((category, index) => {
          const categoryProduct = products.find(p => p.category === category.name);
          const productImage = categoryProduct?.images?.[0];
          const imageKey = category.name.toLowerCase().replace(/\s+/g, '-');
          const displayImage = productImage || fallbackImages[imageKey] || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800';

          return (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="min-w-[280px] md:min-w-[340px] aspect-[4/5] scroll-snap-align-start flex-shrink-0"
            >
              <Link
                to={`/products?category=${category.name}`}
                className="group relative block w-full h-full bg-white border-[4px] border-black shadow-[8px_8px_0_#000] hover:shadow-[12px_12px_0_#000] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-300 overflow-hidden"
              >
                <img
                  src={displayImage}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                />

                {/* Overlay for text legibility */}
                <div className="absolute inset-x-0 bottom-0 p-8 pt-20 bg-gradient-to-t from-black via-black/40 to-transparent">
                  <span className="text-[10px] font-black uppercase text-[#FF6B00] tracking-[0.3em] mb-2 block translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    ACCESS ARCHIVE
                  </span>
                  <h3 className="text-3xl md:text-4xl font-syne font-black text-white uppercase tracking-tighter leading-[0.9]">
                    {category.name.split(/[- ]/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                  </h3>
                </div>

                {/* Industrial Corner Accent */}
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
                  <div className="absolute top-0 right-0 w-full h-full bg-black translate-x-1/2 -translate-y-1/2 rotate-45 border-[4px] border-black"></div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
