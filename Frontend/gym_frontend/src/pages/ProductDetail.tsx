import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Star,
    Minus,
    Plus,
    ShoppingBag,
    ArrowLeft,
    ShieldCheck,
    Zap,
    Heart,
    MapPin,
    AlertTriangle,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProducts, fetchProductById } from '../data/Product.tsx';
import { useCart } from '../contexts/CartContext.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { Product } from '@/types.ts';
import api from '../lib/api';
import { toast } from 'sonner';
import NuvelifeLoader from '../components/NuvelifeLoader';

const ProductDetail: React.FC = () => {
    const [initialProducts, setInitialProducts] = useState<Array<any>>([]);
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState<'details' | 'warnings' | 'reviews'>('details');
    const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedFlavor, setSelectedFlavor] = useState<string>('');
    const [activeImageIdx, setActiveImageIdx] = useState(0);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const { user, isAuthenticated } = useAuth();
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);

    const refreshProduct = async () => {
        if (id) {
            const fetchedProduct = await fetchProductById(id);
            setProduct(fetchedProduct);
        }
    };

    useEffect(() => {
        const found = async () => {
            setFetching(true);
            try {
                if (id) {
                    const fetchedProduct = await fetchProductById(id);
                    setProduct(fetchedProduct);

                    if (fetchedProduct?.variants && fetchedProduct.variants.length > 0) {
                        const first = fetchedProduct.variants[0];
                        setSelectedSize(first.size);
                        setSelectedFlavor(first.flavor || '');
                        setSelectedVariant(first);
                    }
                }
                const { products: relatedProducts } = await fetchProducts({ sort: 'newest', limit: 4 });
                setInitialProducts(relatedProducts);
            } catch (err) {
                console.error(err);
            } finally {
                setFetching(false);
            }
        };
        found();
    }, [id]);

    useEffect(() => {
        if (product && selectedSize) {
            const variantsOfSize = product.variants.filter(v => v.size === selectedSize);
            if (variantsOfSize.length > 0) {
                const match = variantsOfSize.find(v => v.flavor === selectedFlavor) || variantsOfSize[0];

                if (match.id !== selectedVariant?.id) {
                    setSelectedVariant(match);
                }

                if (match.flavor !== selectedFlavor) {
                    setSelectedFlavor(match.flavor || '');
                }
            }
        }
    }, [selectedSize, selectedFlavor, product]);

    const uniqueSizes = Array.from(new Set(product?.variants?.map(v => v.size) || []));
    const availableFlavors = Array.from(new Set(product?.variants?.filter(v => v.size === selectedSize).map(v => v.flavor).filter(Boolean) || []));

    if (fetching) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <NuvelifeLoader />
        </div>
    );

    if (!product) return null;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (product.variants && product.variants.length > 0 && !selectedVariant) {
            toast.error("Please select a product variant");
            return;
        }
        if (!localStorage.getItem("token")) {
            toast.error("Login required");
            return;
        }
        if (loading) return;
        try {
            setLoading(true);
            await addToCart(product, quantity, selectedVariant?.id);
        } finally {
            setLoading(false);
        }
    };

    const handleBuyNow = (e: React.MouseEvent) => {
        e.preventDefault();
        if (product.variants && product.variants.length > 0 && !selectedVariant) {
            toast.error("Please select a product variant");
            return;
        }
        if (!localStorage.getItem("token")) {
            toast.error("Login required");
            return;
        }
        navigate('/checkout', { state: { singleItem: { product, quantity, variant: selectedVariant, variantId: selectedVariant?.id } } });
    };

    return (
        <div className="min-h-screen font-sans text-black pb-20 selection:bg-[#FF6B00] selection:text-white bg-[#F5F0E8]">
            <div className="max-w-[1300px] mx-auto px-6 pt-10">

                {/* BREADCRUMB NAVIGATION */}
                <nav className="mb-8 text-sm font-syne font-bold uppercase tracking-wider text-black">
                    <ol className="flex items-center gap-3">
                        <li><button onClick={() => navigate('/')} className="hover:text-[#FF6B00] border-b-[2px] border-transparent hover:border-[#FF6B00] transition-colors">Home</button></li>
                        <li className="text-black/50">/</li>
                        <li><button onClick={() => navigate('/products')} className="hover:text-[#FF6B00] border-b-[2px] border-transparent hover:border-[#FF6B00] transition-colors">{product.category}</button></li>
                        <li className="text-black/50">/</li>
                        <li className="text-[#179149] p-1 bg-white border-[2px] border-black shadow-[2px_2px_0_#000]">{product.name}</li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                    {/* LEFT: PRODUCT GALLERY */}
                    <div className="lg:col-span-4 flex flex-col gap-4">

                        {/* Main Image */}
                        <div className="relative bg-white border-[3px] border-black shadow-[6px_6px_0_#000] overflow-hidden">
                            {/* Texture background */}
                            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }}></div>
                            
                            <div className="aspect-square relative overflow-hidden group p-6 flex items-center justify-center">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={activeImageIdx}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.05 }}
                                        transition={{ duration: 0.4 }}
                                        src={product.images[activeImageIdx]}
                                        alt={product.name}
                                        className="w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-105"
                                    />
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Thumbnails Row */}
                        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                            {product.images && product.images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImageIdx(i)}
                                    className={`w-16 h-16 shrink-0 border-[2px] border-black transition-all bg-white relative overflow-hidden hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0_#000] active:translate-y-0 active:translate-x-0 active:shadow-none ${activeImageIdx === i
                                        ? 'shadow-[4px_4px_0_#000] border-t-[3px] border-l-[3px]'
                                        : 'shadow-none'
                                        }`}
                                >
                                    <img
                                        src={img}
                                        alt={`Product view ${i + 1}`}
                                        className="w-full h-full object-contain p-2"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: PRODUCT INFO */}
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8 sticky top-6">
                        <div className="space-y-6">
                            {/* Product Header */}
                            <div className="space-y-3">
                                <span className="bg-[#179149] text-white px-2 py-0.5 text-xs font-syne font-black border-[2px] border-black shadow-[2px_2px_0_#000] inline-block uppercase tracking-wider">
                                    {product.category}
                                </span>
                                
                                <h1 className="text-3xl lg:text-4xl font-syne font-black text-black uppercase leading-tight tracking-tighter">
                                    {product.name}
                                </h1>

                                {/* Rating */}
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 bg-white border-[2px] border-black px-2 py-0.5 shadow-[2px_2px_0_#000]">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-3 h-3 ${i < Math.floor(product.rating || 0) ? 'fill-[#FF6B00] text-[#FF6B00]' : 'text-black/20'}`}
                                                strokeWidth={2}
                                            />
                                        ))}
                                        <span className="ml-1 font-syne font-bold text-xs">{product.rating || 4.5}</span>
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#179149]">({product.reviews?.length || 0} REVIEWS)</span>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-3 p-4 bg-white border-[3px] border-black shadow-[4px_4px_0_#000]">
                                <span className="text-3xl font-syne font-black text-black tracking-tighter">
                                    Rs.{(selectedVariant ? (selectedVariant.discountPrice || selectedVariant.price) : (product.discountPrice || product.price)).toLocaleString()}
                                </span>
                                {((selectedVariant?.discountPrice && selectedVariant.discountPrice < selectedVariant.price) || (product.discountPrice && product.discountPrice < product.price)) && (
                                    <span className="text-lg text-black/50 line-through font-bold">
                                        Rs.{(selectedVariant?.price || product.price).toLocaleString()}
                                    </span>
                                )}
                            </div>

                            {/* Desc Snippet */}
                            <p className="text-sm font-medium text-black/70 leading-relaxed border-l-[3px] border-[#FF6B00] pl-4 italic">
                                {product.description?.slice(0, 150)}...
                            </p>

                            {/* Shipping Info Simplified */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-2 p-2 bg-white border-[2px] border-black shadow-[2px_2px_0_#000]">
                                    <ShieldCheck className="w-4 h-4 text-[#179149]" strokeWidth={2.5} />
                                    <span className="text-[10px] font-syne font-black uppercase">SECURE</span>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-white border-[2px] border-black shadow-[2px_2px_0_#000]">
                                    <Zap className="w-4 h-4 text-[#FF6B00]" strokeWidth={2.5} />
                                    <span className="text-[10px] font-syne font-black uppercase">EXPRESS</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Size Selector */}
                            {uniqueSizes.length > 0 && (
                                <div className="space-y-3 flex flex-col p-4 bg-white border-[3px] border-black shadow-[4px_4px_0_#000]">
                                    <span className="text-[10px] font-syne font-black uppercase tracking-widest">SIZE: <span className="text-[#FF6B00]">{selectedSize}</span></span>
                                    <div className="flex flex-wrap gap-2">
                                        {uniqueSizes.map((sz: any) => (
                                            <button
                                                key={sz}
                                                onClick={() => setSelectedSize(sz)}
                                                className={`px-3 py-2 text-xs font-syne font-bold uppercase transition-all ${selectedSize === sz
                                                    ? 'bg-[#179149] text-white border-[2px] border-black shadow-[2px_2px_0_#000] -translate-y-0.5 -translate-x-0.5'
                                                    : 'bg-[#F5F0E8] text-black border-[2px] border-black shadow-none hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[2px_2px_0_#000]'
                                                    }`}
                                            >
                                                {sz}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Flavor Selector */}
                            {availableFlavors.length > 0 && (
                                <div className="space-y-3 flex flex-col p-4 bg-white border-[3px] border-black shadow-[4px_4px_0_#000]">
                                    <span className="text-[10px] font-syne font-black uppercase tracking-widest">FLAVOR: <span className="text-[#FF6B00]">{selectedFlavor}</span></span>
                                    <div className="flex flex-wrap gap-2">
                                        {availableFlavors.map((fl: any) => (
                                            <button
                                                key={fl}
                                                onClick={() => setSelectedFlavor(fl)}
                                                className={`px-3 py-2 text-xs font-syne font-bold uppercase transition-all ${selectedFlavor === fl
                                                    ? 'bg-[#FF6B00] text-white border-[2px] border-black shadow-[2px_2px_0_#000] -translate-y-0.5 -translate-x-0.5'
                                                    : 'bg-[#F5F0E8] text-black border-[2px] border-black shadow-none hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[2px_2px_0_#000]'
                                                    }`}
                                            >
                                                {fl}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 bg-white border-[2px] border-black shadow-[2px_2px_0_#000] p-2 w-fit">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-6 h-6 flex items-center justify-center bg-[#F5F0E8] border-black border hover:bg-[#FF6B00] hover:text-white transition-colors">
                                        <Minus size={12} strokeWidth={3} />
                                    </button>
                                    <span className="font-syne font-black text-base w-6 text-center">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="w-6 h-6 flex items-center justify-center bg-[#F5F0E8] border-black border hover:bg-[#179149] hover:text-white transition-colors">
                                        <Plus size={12} strokeWidth={3} />
                                    </button>
                                </div>

                                <button className="w-10 h-10 bg-white border-[2px] border-black shadow-[2px_2px_0_#000] flex items-center justify-center hover:bg-[#FF6B00] hover:text-white transition-colors hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[4px_4px_0_#000]">
                                    <Heart className="w-5 h-5" strokeWidth={2.5} />
                                </button>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3 pt-2">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={loading}
                                    className="w-full h-12 bg-[#179149] text-white font-syne font-black text-base uppercase tracking-widest border-[3px] border-black shadow-[4px_4px_0_#000] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0_#000] active:translate-y-0 active:translate-x-0 active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ShoppingBag className="w-5 h-5" strokeWidth={2.5} /> ADD TO CART</>}
                                </button>

                                <button
                                    onClick={handleBuyNow}
                                    className="w-full h-12 bg-black text-white font-syne font-black text-base uppercase tracking-widest border-[3px] border-black shadow-[4px_4px_0_#000] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0_#000] active:translate-y-0 active:translate-x-0 active:shadow-none transition-all"
                                >
                                    BUY NOW
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TABS SECTION */}
                <div className="mt-20 max-w-5xl mx-auto">
                    <div className="flex flex-wrap gap-4 border-b-[4px] border-black pb-4 mb-8">
                        {[
                            { id: 'details', label: 'DESCRIPTION' },
                            { id: 'warnings', label: 'SAFETY PROTOCOLS' },
                            { id: 'reviews', label: 'REVIEWS' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-6 py-3 font-syne font-black text-sm uppercase tracking-widest transition-all border-[3px] border-black shadow-[4px_4px_0_#000] ${activeTab === tab.id
                                    ? 'bg-[#179149] text-white -translate-y-1 -translate-x-1'
                                    : 'bg-white text-black hover:bg-[#F5F0E8]'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="mb-16">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white border-[3px] border-black shadow-[8px_8px_0_#000] p-8 md:p-12 text-black"
                            >
                                {activeTab === 'details' && (
                                    <div className="space-y-8">
                                        <h3 className="text-2xl font-syne font-black uppercase tracking-tight inline-block border-b-[4px] border-[#FF6B00] pb-2">Protocol Overview</h3>
                                        <p className="text-lg leading-relaxed font-medium">
                                            {product.description || "A precision-engineered supplement protocol designed for elite physiological optimization. Formulated with high-purity ingredients to support your peak path."}
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#F5F0E8] p-6 border-[3px] border-black">
                                            <div>
                                                <span className="block text-xs font-syne font-black text-black/50 uppercase tracking-widest mb-1">Category</span>
                                                <span className="text-lg font-bold">{product.category}</span>
                                            </div>
                                            <div>
                                                <span className="block text-xs font-syne font-black text-black/50 uppercase tracking-widest mb-1">SKU</span>
                                                <span className="text-lg font-bold">{product.id.slice(-8).toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'warnings' && (
                                    <div className="space-y-8">
                                        <h3 className="text-2xl font-syne font-black uppercase tracking-tight inline-block border-b-[4px] border-[#FF6B00] pb-2 flex items-center gap-3 w-fit">
                                            <AlertTriangle className="w-8 h-8 text-[#FF6B00]" strokeWidth={2.5} />
                                            Safety & Care
                                        </h3>
                                        <ul className="space-y-4">
                                            {(product.warnings && product.warnings.length > 0 ? product.warnings : [
                                                "Consult with a qualified healthcare professional before use.",
                                                "Store in a cool, dry place away from direct sunlight.",
                                                "Keep out of reach of children.",
                                                "Do not use if safety seal is broken or missing."
                                            ]).map((warning, idx) => (
                                                <li key={idx} className="flex gap-4 items-start text-lg bg-[#F5F0E8] p-4 border-[3px] border-black">
                                                    <div className="w-3 h-3 bg-[#FF6B00] border-[2px] border-black mt-1.5 shrink-0"></div>
                                                    <span className="font-bold">{warning}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {activeTab === 'reviews' && (
                                    <div className="space-y-10">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-[3px] border-black pb-8">
                                            <div>
                                                <h3 className="text-3xl font-syne font-black uppercase tracking-tighter">Customer Intelligence</h3>
                                                <div className="flex items-center gap-3 mt-4">
                                                    <div className="flex bg-[#179149] p-2 border-[2px] border-black">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating || 0) ? 'fill-[#FF6B00] text-[#FF6B00]' : 'text-white/30'}`} strokeWidth={2} />
                                                        ))}
                                                    </div>
                                                    <span className="text-sm font-bold uppercase tracking-widest bg-white border-[2px] border-black px-3 py-1 shadow-[2px_2px_0_#000]">Based on {product.reviews?.length || 0} reviews</span>
                                                </div>
                                            </div>
                                            {!showReviewForm && (
                                                <button
                                                    onClick={() => {
                                                        if (!isAuthenticated) {
                                                            toast.error("Please login to write a review");
                                                            navigate('/login');
                                                            return;
                                                        }
                                                        setShowReviewForm(true);
                                                    }}
                                                    className="px-6 py-4 bg-[#FF6B00] text-white font-syne font-black uppercase tracking-widest border-[3px] border-black shadow-[4px_4px_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_#000] active:translate-y-0 active:translate-x-0 active:shadow-none transition-all text-sm"
                                                >
                                                    Submit Review
                                                </button>
                                            )}
                                        </div>

                                        {showReviewForm && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="bg-[#F5F0E8] p-8 border-[3px] border-black shadow-[4px_4px_0_#000] space-y-6"
                                            >
                                                <div className="flex justify-between items-center border-b-[3px] border-black pb-4 mb-4">
                                                    <h4 className="font-syne font-black text-xl uppercase tracking-wider">Write Your Review</h4>
                                                    <button
                                                        onClick={() => setShowReviewForm(false)}
                                                        className="w-10 h-10 bg-white border-[3px] border-black shadow-[2px_2px_0_#000] flex items-center justify-center hover:bg-[#FF6B00] hover:text-white transition-colors"
                                                    >
                                                        <Plus className="w-6 h-6 rotate-45" strokeWidth={3} />
                                                    </button>
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-sm font-syne font-black uppercase tracking-widest">Rating</label>
                                                    <div className="flex gap-2 bg-white border-[3px] border-black p-3 w-fit">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                onClick={() => setReviewRating(star)}
                                                                className="hover:scale-110 transition-transform active:scale-95"
                                                            >
                                                                <Star className={`w-8 h-8 ${star <= reviewRating ? 'fill-[#FF6B00] text-[#FF6B00]' : 'text-black/20'}`} strokeWidth={2} />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-sm font-syne font-black uppercase tracking-widest">Your Review</label>
                                                    <textarea
                                                        value={reviewComment}
                                                        onChange={(e) => setReviewComment(e.target.value)}
                                                        rows={4}
                                                        className="w-full bg-white border-[3px] border-black p-4 text-base font-bold focus:shadow-[4px_4px_0_#000] focus:outline-none focus:-translate-y-1 focus:-translate-x-1 transition-all resize-none"
                                                        placeholder="Share your raw thoughts..."
                                                    />
                                                </div>

                                                <button
                                                    onClick={async () => {
                                                        if (reviewRating === 0) {
                                                            toast.error("Please select a rating");
                                                            return;
                                                        }
                                                        setSubmittingReview(true);
                                                        try {
                                                            await api.post('/givereview', {
                                                                productId: product.id,
                                                                rating: reviewRating,
                                                                comment: reviewComment
                                                            });
                                                            toast.success("Review posted successfully!");
                                                            setShowReviewForm(false);
                                                            setReviewRating(0);
                                                            setReviewComment('');
                                                            await refreshProduct();
                                                        } catch (err: any) {
                                                            toast.error(err.response?.data?.message || "Failed to submit review");
                                                        } finally {
                                                            setSubmittingReview(false);
                                                        }
                                                    }}
                                                    disabled={submittingReview}
                                                    className="w-full h-14 bg-[#179149] text-white font-syne font-black text-lg uppercase tracking-widest border-[3px] border-black shadow-[4px_4px_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_#000] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                                >
                                                    {submittingReview ? <Loader2 className="w-5 h-5 animate-spin" /> : 'SUBMIT REVIEW'}
                                                </button>
                                            </motion.div>
                                        )}

                                        <div className="space-y-6">
                                            {product.reviews && product.reviews.length > 0 ? (
                                                product.reviews.map((review: any, i: number) => (
                                                    <div key={i} className="bg-white border-[3px] border-black shadow-[4px_4px_0_#000] p-6 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_#000] transition-all space-y-4">
                                                        <div className="flex items-center justify-between border-b-[2px] border-black/10 pb-4">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 bg-[#FF6B00] border-[2px] border-black text-white flex items-center justify-center font-syne font-black text-xl shadow-[2px_2px_0_#000]">
                                                                    {(review.user?.name || 'V').charAt(0).toUpperCase()}
                                                                </div>
                                                                <span className="font-syne font-black uppercase text-lg">{review.user?.name || 'Verified Buyer'}</span>
                                                            </div>
                                                            <span className="text-sm font-bold text-black/50 uppercase tracking-widest bg-[#F5F0E8] border-[2px] border-black px-3 py-1">
                                                                {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recent'}
                                                            </span>
                                                        </div>
                                                        <div className="flex bg-[#F5F0E8] border-[2px] border-black p-2 w-fit">
                                                            {[...Array(5)].map((_, stars) => (
                                                                <Star key={stars} className={`w-4 h-4 ${stars < review.rating ? 'fill-[#179149] text-[#179149]' : 'text-black/20'}`} strokeWidth={2} />
                                                            ))}
                                                        </div>
                                                        <p className="text-lg font-medium leading-relaxed">"{review.comment}"</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-16 bg-[#F5F0E8] border-[3px] border-black border-dashed">
                                                    <p className="font-syne font-black text-2xl uppercase tracking-tighter text-black/30">No reviews yet. Claim the first spot.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* RELATED PRODUCTS */}
                <div className="mt-24 max-w-7xl mx-auto">
                    <h3 className="text-3xl md:text-4xl font-syne font-black text-black uppercase tracking-tighter mb-10 inline-block border-b-[4px] border-[#179149] pb-2">Load up Your Arsenal</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {initialProducts.filter(p => p.id !== product.id).slice(0, 4).map(p => (
                            <div
                                key={p.id}
                                onClick={() => { navigate(`/product/${p.id}`); window.scrollTo(0, 0); }}
                                className="group cursor-pointer bg-white border-[3px] border-black shadow-brutal hover:-translate-y-2 hover:-translate-x-2 hover:shadow-brutal-hover transition-all duration-300 flex flex-col h-full"
                            >
                                <div className="aspect-[4/5] bg-[#F5F0E8] border-b-[3px] border-black overflow-hidden flex items-center justify-center p-8 relative">
                                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }}></div>
                                    <img
                                        src={p.image || p.images?.[0]}
                                        alt={p.name}
                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 relative z-10"
                                    />
                                    <div className="absolute top-4 left-4 z-20">
                                        <span className="bg-[#179149] text-white border-[2px] border-black shadow-[2px_2px_0_#000] px-3 py-1 font-syne font-bold uppercase tracking-widest text-[10px]">
                                            {p.category.split(/[- ]/)[0]}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5 md:p-6 flex flex-col flex-1">
                                    <h4 className="text-xl font-syne font-black text-black uppercase tracking-tight line-clamp-2 mb-4 group-hover:text-[#FF6B00] transition-colors">{p.name}</h4>
                                    <div className="mt-auto flex items-center justify-between border-t-[3px] border-black pt-4">
                                        <span className="text-2xl font-syne font-black text-black tracking-tighter">Rs.{p.price.toLocaleString()}</span>
                                        <div className="w-10 h-10 bg-[#FF6B00] border-[2px] border-black flex items-center justify-center group-hover:-translate-y-1 group-hover:-translate-x-1 group-hover:shadow-[4px_4px_0_#000] transition-all">
                                            <ArrowLeft className="w-5 h-5 text-white rotate-180" strokeWidth={3} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;