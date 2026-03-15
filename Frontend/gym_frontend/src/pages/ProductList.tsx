import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import {
    Search,
    X,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { Category, fetchProducts, getCategories } from '../data/Product.tsx';
import NuvelifeLoader from '../components/NuvelifeLoader';
import ProductCard from '../components/ProductCard.tsx';

import { Badge } from '../components/ui/badge.tsx';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu.tsx";
import { Product } from '@/types.ts';

const ProductList: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
    const [catalogMaxPrice, setCatalogMaxPrice] = useState(10000);
    const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'name'>('newest');
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const activeCategory = searchParams.get('category') || 'All';
    const activeSubCategory = searchParams.get('subCategory') || 'All';

    useEffect(() => {
        setPage(1);
    }, [activeCategory, activeSubCategory, searchQuery, maxPrice, sortBy]);

    useEffect(() => {
        const loadPageData = async () => {
            setLoading(true);
            try {
                const [catsRes, productsRes] = await Promise.all([
                    getCategories(),
                    fetchProducts({
                        category: activeCategory !== "All" ? activeCategory : undefined,
                        subCategory: activeSubCategory !== "All" ? activeSubCategory : undefined,
                        search: searchQuery || undefined,
                        maxPrice,
                        sort: sortBy,
                        page,
                        limit: 12,
                        inStock: true,
                    })
                ]);
                setCategories(catsRes);
                setProducts(productsRes.products);
                setTotalPages(productsRes.totalPages);
                setCatalogMaxPrice(productsRes.maxPrice);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadPageData();
    }, [activeCategory, activeSubCategory, searchQuery, maxPrice, sortBy, page]);

    const clearAllFilters = () => {
        setSearchQuery('');
        setMaxPrice(undefined);
        setSearchParams(new URLSearchParams());
        setSortBy('newest');
    };

    return (
        <div className="min-h-screen bg-[#F5F0E8] font-sans selection:bg-[#FF6B00] selection:text-white pb-20">

            {/* 1. EDITORIAL HERO SECTION */}
            <header className="relative bg-brand-matte h-[40vh] md:h-[60vh] min-h-[300px] md:min-h-[450px] overflow-hidden border-b border-orange-100">
                <div className="absolute inset-0 z-0">
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                    >
                        <source src="/video.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </header>


            {/* 2. BRUTAL FILTERING OPTIONS */}
            <div className="sticky top-[64px] z-[100] bg-[#FF6B00] border-b-[3px] border-black shadow-[0_4px_0_#000]">
                <div className="max-w-[1400px] mx-auto px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 bg-white border-[2px] border-black text-black text-xs font-syne font-black uppercase tracking-widest shadow-[2px_2px_0_#000] hover:-translate-y-[1px] hover:-translate-x-[1px] hover:shadow-[3px_3px_0_#000] active:shadow-none active:translate-x-0 active:translate-y-0 transition-all outline-none">
                                {activeCategory === 'All' ? 'CATEGORY' : activeCategory} <ChevronDown className="w-4 h-4 ml-1" strokeWidth={3} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-white border-[3px] border-black shadow-[4px_4px_0_#000] p-0 min-w-[200px] rounded-none">
                                <DropdownMenuItem onClick={() => setSearchParams({})} className="px-4 py-3 text-xs font-syne font-black uppercase tracking-widest cursor-pointer hover:bg-[#F5F0E8] focus:bg-[#F5F0E8] border-b-[2px] border-black last:border-0 rounded-none">
                                    ALL GEAR
                                </DropdownMenuItem>
                                {categories.map(cat => (
                                    <DropdownMenuItem
                                        key={cat.name}
                                        onClick={() => setSearchParams({ category: cat.name })}
                                        className="px-4 py-3 text-xs font-syne font-black uppercase tracking-widest cursor-pointer hover:bg-[#F5F0E8] focus:bg-[#F5F0E8] border-b-[2px] border-black last:border-0 rounded-none"
                                    >
                                        {cat.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {activeCategory !== 'All' && (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 bg-white border-[2px] border-black text-black text-xs font-syne font-black uppercase tracking-widest shadow-[2px_2px_0_#000] hover:-translate-y-[1px] hover:-translate-x-[1px] hover:shadow-[3px_3px_0_#000] transition-all outline-none">
                                    {activeSubCategory === 'All' ? 'SUBCATEGORY' : activeSubCategory} <ChevronDown className="w-4 h-4 ml-1" strokeWidth={3} />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-white border-[3px] border-black shadow-[4px_4px_0_#000] p-0 min-w-[200px] rounded-none">
                                    {categories.find(c => c.name === activeCategory)?.subCategories.map(sub => (
                                        <DropdownMenuItem
                                            key={sub}
                                            onClick={() => setSearchParams({ category: activeCategory, subCategory: sub })}
                                            className="px-4 py-3 text-xs font-syne font-black uppercase tracking-widest cursor-pointer hover:bg-[#F5F0E8] focus:bg-[#F5F0E8] border-b-[2px] border-black last:border-0 rounded-none"
                                        >
                                            {sub}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        <div className="relative group ml-auto md:ml-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" strokeWidth={3} />
                            <input
                                type="text"
                                placeholder="SEARCH..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 text-xs font-syne font-black tracking-widest uppercase bg-white border-[2px] border-black text-black placeholder:text-black/50 focus:outline-none focus:-translate-y-[1px] focus:-translate-x-[1px] focus:shadow-[3px_3px_0_#000] transition-all w-48 md:w-64"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 bg-black text-white border-[2px] border-black text-xs font-syne font-black uppercase tracking-widest shadow-[2px_2px_0_#000] hover:-translate-y-[1px] hover:-translate-x-[1px] hover:shadow-[3px_3px_0_#000] transition-all outline-none">
                                SORT: <span className="text-[#FF6B00]">{sortBy === 'newest' ? 'NEW' : sortBy.replace('-', ' ')}</span> <ChevronDown className="w-4 h-4 ml-1" strokeWidth={3} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white border-[3px] border-black shadow-[4px_4px_0_#000] p-0 min-w-[200px] rounded-none">
                                {[
                                    { id: 'newest', label: 'LATEST INTEL' },
                                    { id: 'price-asc', label: 'PRICE: LOW - HIGH' },
                                    { id: 'price-desc', label: 'PRICE: HIGH - LOW' },
                                    { id: 'name', label: 'A - Z' }
                                ].map(opt => (
                                    <DropdownMenuItem key={opt.id} onClick={() => setSortBy(opt.id as any)} className="px-4 py-3 text-[10px] font-syne font-black uppercase tracking-widest cursor-pointer hover:bg-[#179149] hover:text-white focus:bg-[#179149] focus:text-white border-b-[2px] border-black last:border-0 rounded-none">
                                        {opt.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* 3. SPACIOUS PRODUCT GRID */}
            <main className="max-w-7xl bg-white mx-auto px-6 py-32">
                {activeCategory !== 'All' && (
                    <div className="mb-12 flex items-center gap-3">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Filtering by:</h3>
                        <Badge className="bg-brand text-white border-none rounded-none px-3 py-1 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                            {activeCategory} {activeSubCategory !== 'All' && ` / ${activeSubCategory}`}
                            <X className="w-3 h-3 cursor-pointer" onClick={clearAllFilters} />
                        </Badge>
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <NuvelifeLoader />
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-24">
                            {products.map(product => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    key={product.id}
                                    className="group"
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-24 flex items-center justify-center gap-6">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(p => p - 1)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white text-black border-[3px] border-black text-xs font-syne font-black uppercase tracking-widest shadow-[4px_4px_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_#000] disabled:opacity-50 disabled:shadow-none disabled:translate-y-0 disabled:translate-x-0 transition-all"
                                >
                                    <ChevronLeft className="w-4 h-4" strokeWidth={3} /> PREV
                                </button>
                                <span className="text-xl font-syne font-black uppercase tracking-widest bg-[#FF6B00] text-white border-[3px] border-black px-4 py-2 shadow-[4px_4px_0_#000] rotate-1">
                                    {page} / {totalPages}
                                </span>
                                <button
                                    disabled={page === totalPages}
                                    onClick={() => setPage(p => p + 1)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white text-black border-[3px] border-black text-xs font-syne font-black uppercase tracking-widest shadow-[4px_4px_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_#000] disabled:opacity-50 disabled:shadow-none disabled:translate-y-0 disabled:translate-x-0 transition-all"
                                >
                                    NEXT <ChevronRight className="w-4 h-4" strokeWidth={3} />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-40">
                        <Search className="w-12 h-12 text-gray-200 mx-auto mb-6" />
                        <h3 className="text-2xl font-serif text-gray-800 mb-2">No results found</h3>
                        <p className="text-gray-400 text-sm mb-8">Try adjusting your filters or search query.</p>
                        <button onClick={clearAllFilters} className="text-brand text-xs font-black uppercase tracking-widest border-b border-brand pb-1">Reset All</button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ProductList;
