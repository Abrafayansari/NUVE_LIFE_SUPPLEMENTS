import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import {
    Search,
    SlidersHorizontal,
    LayoutGrid,
    List,
    X,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    FlaskConical,
    Filter,
    ArrowUpDown
} from 'lucide-react';
import { Category, fetchProducts, getCategories } from '../data/Product.tsx';
import NuvelifeLoader from '../components/NuvelifeLoader';
import ProductCard from '../components/ProductCard.tsx';


import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '../components/ui/sheet.tsx';
import { Badge } from '../components/ui/badge.tsx';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu.tsx";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "../components/ui/collapsible.tsx";
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
        <div className="h-min-screen bg-[#FDFCFB] selection:bg-brand selection:text-white">

            {/* 1. EDITORIAL HERO SECTION */}
           <header className="relative bg-white h-[60vh] min-h-[450px] overflow-hidden border-b border-orange-100">

                {/* UnicornStudio Embed - Full Width Hero */}
                <div className="absolute inset-0 z-0">
                    <iframe
                        src="https://www.unicorn.studio/embed/0Tz2DcWVV7b1tjQeu8Ci"
                        className="w-full h-full"
                        frameBorder="0"
                        allow="autoplay; fullscreen"
                        title="Unicorn Studio Animation"
                    />
                    {/* Black overlay to hide watermark - positioned bottom middle, rounded and slightly raised */}
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-60 h-14 sm:w-72 sm:h-16 bg-black rounded-xl z-10" />
                </div>

                {/* Orange gradient accent decorations */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-400/10 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full blur-3xl" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 h-full flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="max-w-xl space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, duration: 1 }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative group">
                            <div className="absolute inset-0 bg-orange-400/20 rounded-full blur-[100px] group-hover:bg-orange-500/30 transition-all" />
                        </div>
                    </motion.div>
                </div> 

                {/* Bottom decorative line */}
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-300 to-transparent opacity-30"></div>
            </header>


            {/* 2. MINIMAL FILTERING OPTIONS */}
            <div className="sticky top-[64px] z-[10005] bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-50 transition-all outline-none">
                                {activeCategory === 'All' ? 'Category' : activeCategory} <ChevronDown className="w-4 h-4 opacity-30" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-white border-gray-100 shadow-xl p-1 min-w-[200px]">
                                <DropdownMenuItem onClick={() => setSearchParams({})} className="px-4 py-2.5 text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-gray-50 hover:text-brand">
                                    All Products
                                </DropdownMenuItem>
                                {categories.map(cat => (
                                    <DropdownMenuItem
                                        key={cat.name}
                                        onClick={() => setSearchParams({ category: cat.name })}
                                        className="px-4 py-2.5 text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-gray-50"
                                    >
                                        {cat.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {activeCategory !== 'All' && (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-50 transition-all outline-none">
                                    {activeSubCategory === 'All' ? 'Subcategory' : activeSubCategory} <ChevronDown className="w-4 h-4 opacity-30" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-white border-gray-100 shadow-xl p-1 min-w-[200px]">
                                    {categories.find(c => c.name === activeCategory)?.subCategories.map(sub => (
                                        <DropdownMenuItem
                                            key={sub}
                                            onClick={() => setSearchParams({ category: activeCategory, subCategory: sub })}
                                            className="px-4 py-2.5 text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-gray-50"
                                        >
                                            {sub}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        <div className="h-4 w-[1px] bg-gray-200 mx-2" />

                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-brand transition-colors" />
                            <input
                                type="text"
                                placeholder="Search inventory..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-1.5 text-sm bg-transparent focus:bg-white focus:outline-none transition-all w-48 md:w-64"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#BCAAA4] hover:text-brand transition-all outline-none">
                                SORT BY: <span className="text-gray-900">{sortBy === 'newest' ? 'Featured' : sortBy.replace('-', ' ')}</span> <ChevronDown className="w-4 h-4 opacity-30" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white border-gray-100 shadow-xl p-1 min-w-[200px]">
                                {[
                                    { id: 'newest', label: 'Featured' },
                                    { id: 'price-asc', label: 'Price: Low to High' },
                                    { id: 'price-desc', label: 'Price: High to Low' },
                                    { id: 'name', label: 'Alphabetical' }
                                ].map(opt => (
                                    <DropdownMenuItem key={opt.id} onClick={() => setSortBy(opt.id as any)} className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer hover:bg-gray-50">
                                        {opt.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* 3. SPACIOUS PRODUCT GRID */}
            <main className="max-w-7xl mx-auto px-6 py-32">
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
                            <div className="mt-24 pt-12 border-t border-gray-100 flex items-center justify-center gap-8">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(p => p - 1)}
                                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-brand disabled:opacity-30 transition-all"
                                >
                                    <ChevronLeft className="w-4 h-4" /> Previous
                                </button>
                                <span className="text-[12px] font-black uppercase tracking-widest">
                                    {page} <span className="opacity-20 mx-2">/</span> {totalPages}
                                </span>
                                <button
                                    disabled={page === totalPages}
                                    onClick={() => setPage(p => p + 1)}
                                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-brand disabled:opacity-30 transition-all"
                                >
                                    Next <ChevronRight className="w-4 h-4" />
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
