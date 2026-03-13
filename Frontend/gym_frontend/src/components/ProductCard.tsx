// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Loader2 } from 'lucide-react';
// import { useCart } from '../contexts/CartContext.tsx';
// import { toast } from 'sonner';
// import { Product } from '@/types.ts';
// import QuickViewModal from './QuickViewModal.tsx';
// import { useWishlist } from '../contexts/WishlistContext.tsx';

// interface ProductCardProps {
//   product: Product;
//   variant?: any;
//   mode?: 'default' | 'buyNow';
// }

// const ProductCard: React.FC<ProductCardProps> = ({ product, variant, mode = 'default' }) => {
//   const [isWishlisted, setIsWishlisted] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const { addToCart } = useCart();
//   const { addToWishlist, removeFromWishlist, checkIfWishlisted } = useWishlist();
//   const navigate = useNavigate();

//   // Check wishlist status on mount
//   React.useEffect(() => {
//     const check = async () => {
//       const exists = await checkIfWishlisted(product.id);
//       setIsWishlisted(exists);
//     };
//     check();
//   }, [product.id, checkIfWishlisted]);

//   const toggleWishlist = async () => {
//     if (!localStorage.getItem("token")) {
//       toast.error("Login required");
//       return;
//     }

//     try {
//       if (isWishlisted) {
//         await removeFromWishlist(product.id);
//         setIsWishlisted(false);
//       } else {
//         await addToWishlist(product.id);
//         setIsWishlisted(true);
//       }
//     } catch {
//       // Error handled in context
//     }
//   };

//   const openModal = () => {
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   const displayPrice = variant ? (variant.discountPrice || variant.price) : (product.discountPrice || product.price);
//   const originalPrice = variant ? (variant.discountPrice ? variant.price : null) : (product.discountPrice ? product.price : null);

//   const booleanIsNew = (() => {
//     const now = new Date();
//     const createdAt = new Date(product.createdAt);
//     const diffInDays = (now.getTime() - createdAt.getTime()) / (1000 * 3600 * 24);
//     return diffInDays <= 30;
//   })();

//   const handleAddToCart = async (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (!localStorage.getItem("token")) {
//       toast.error("Login required");
//       return;
//     }

//     if (loading) return;

//     try {
//       setLoading(true);
//       await addToCart(product, 1);
//       toast.success("Added to cart");
//     } catch {
//       toast.error("Failed to add to cart");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBuyNow = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (!localStorage.getItem("token")) {
//       toast.error("Login required");
//       return;
//     }

//     navigate('/checkout', { state: { singleItem: { product, quantity: 1, variant, variantId: variant?.id } } });
//   };

//   const productName = product.name;
//   const price = displayPrice;
//   const originalPriceValue = originalPrice || price * 1.2;
//   const imageUrl = product.images?.[0] || 'https://images.unsplash.com/photo-1593095191850-2a0bf3a772bf?auto=format&fit=crop&q=80&w=800';
//   const brandName = "Nuve";

//   return (
//     <>
//       {/* Product Card */}
//       <div className="group relative w-full max-w-[340px] mx-auto h-[450px] bg-[#232323] rounded-[20px] overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.5)]">
//         {/* Green Circle Background */}
//         <div className="absolute top-0 left-0 w-full h-full bg-[#9bdc28] 
//           [clip-path:circle(150px_at_80%_20%)] 
//           group-hover:[clip-path:circle(300px_at_80%-20%)] 
//           transition-all duration-500 ease-in-out"
//         />

//         {/* Brand Watermark */}
//         <div className="absolute top-[30%] -left-[20%] text-[12rem] font-extrabold italic text-white/[0.04] pointer-events-none">
//           {brandName}
//         </div>

//         {/* Action Buttons */}
//         <div className="absolute top-5 right-5 flex flex-col gap-2.5 z-[10001]">
//           {/* Wishlist Button */}
//           <button
//             onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(); }}
//             className="w-10 h-10 bg-white/90 rounded-full flex justify-center items-center 
//               cursor-pointer transition-all duration-300 opacity-0 translate-x-[50px] 
//               group-hover:opacity-100 group-hover:translate-x-0 
//               group-hover:delay-[300ms] hover:bg-[#9bdc28] hover:scale-110"
//           >
//             <svg
//               viewBox="0 0 24 24"
//               className={`w-5 h-5 transition-colors ${isWishlisted ? 'fill-[#e91e63]' : 'fill-[#333]'}`}
//             >
//               <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
//             </svg>
//           </button>

//           {/* Quick View Button */}
//           <button
//             onClick={(e) => { e.preventDefault(); e.stopPropagation(); openModal(); }}
//             className="w-10 h-10 bg-white/90 rounded-full flex justify-center items-center 
//               cursor-pointer transition-all duration-300 opacity-0 translate-x-[50px] 
//               group-hover:opacity-100 group-hover:translate-x-0 
//               group-hover:delay-[400ms] hover:bg-[#9bdc28] hover:scale-110"
//           >
//             <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#333]">
//               <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
//             </svg>
//           </button>
//         </div>

//         {/* Product Image */}
//         <div className="absolute top-1/2 -translate-y-1/2 z-[10000] w-full h-[220px] px-6
//           transition-all duration-500 group-hover:top-4 group-hover:translate-y-0">
//           <img
//             src={imageUrl}
//             alt={productName}
//             className="w-full h-full object-contain transition-transform duration-500"
//             referrerPolicy="no-referrer"
//           />
//         </div>

//         {/* Content */}
//         <div className="absolute bottom-0 w-full h-[100px] text-center 
//           transition-all duration-1000 z-10 group-hover:h-[180px]">
//           <h2 className="relative font-semibold tracking-wide text-white">
//             {productName}
//           </h2>

//           {/* Price */}
//           <div className="flex justify-center items-center px-5 py-2.5 
//             transition-all duration-500 opacity-0 invisible translate-y-[50px]
//             group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 
//             group-hover:delay-[500ms]">
//             <h3 className="text-[#9bdc28] font-bold text-2xl tracking-wide">
//               Rs. {price.toLocaleString()}
//             </h3>
//             <span className="text-[#888] font-normal text-base line-through ml-2.5">
//               Rs. {Math.round(originalPriceValue).toLocaleString()}
//             </span>
//           </div>

//           {/* Buy Now Button */}
//           {mode === 'default' ? (
//             <button
//               onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(e); }}
//               disabled={loading}
//               className="inline-block px-8 py-2.5 bg-white rounded text-[#111] 
//                 font-semibold no-underline transition-all duration-500 
//                 opacity-0 translate-y-[50px] mt-0
//                 group-hover:opacity-100 group-hover:translate-y-0 
//                 group-hover:delay-[600ms] hover:bg-[#9bdc28] disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? (
//                 <Loader2 className="w-5 h-5 animate-spin mx-auto" />
//               ) : (
//                 "Add to Cart"
//               )}
//             </button>
//           ) : (
//             <button
//               onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleBuyNow(e); }}
//               className="inline-block px-8 py-2.5 bg-white rounded text-[#111] 
//                 font-semibold no-underline transition-all duration-500 
//                 opacity-0 translate-y-[50px] mt-0
//                 group-hover:opacity-100 group-hover:translate-y-0 
//                 group-hover:delay-[600ms] hover:bg-[#9bdc28]"
//             >
//               Buy Now
//             </button>
//           )}
//         </div>

//         {/* Badges */}
//         <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
//           {booleanIsNew && (
//             <span className="px-3 py-1 bg-[#9bdc28] text-white text-[8px] font-black uppercase tracking-widest rounded-full">
//               NEW
//             </span>
//           )}
//           {originalPrice && (
//             <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest rounded-full border border-white/10">
//               {Math.round(((originalPriceValue - price) / originalPriceValue) * 100)}% OFF
//             </span>
//           )}
//         </div>

//         {/* Category Tag */}
//         <div className="absolute bottom-5 left-5 z-20">
//           <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest rounded-full border border-white/10">
//             {product.category.split(/[- ]/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
//           </span>
//         </div>
//       </div>

//       {/* Quick View Modal */}
//       {isModalOpen && (
//         <div
//           className="fixed inset-0 bg-black/80 z-[100000] flex justify-center items-center"
//           onClick={closeModal}
//         >
//           <div
//             className="bg-[#232323] p-10 rounded-[20px] max-w-[500px] w-[90%] 
//               text-center relative"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={closeModal}
//               className="absolute top-4 right-5 text-3xl text-white hover:text-[#9bdc28] 
//                 transition-colors"
//             >
//               &times;
//             </button>
//             <h2 className="text-white text-2xl font-semibold mb-5">{productName}</h2>
//             <img
//               src={imageUrl}
//               alt={productName}
//               className="w-[300px] my-5 mx-auto"
//               referrerPolicy="no-referrer"
//             />
//             <p className="text-[#ccc] leading-relaxed mb-5">
//               {product.description || `Experience ultimate comfort with the ${productName}. Premium quality supplement designed for peak performance and results.`}
//             </p>
//             <div className="text-[#9bdc28] text-[28px] font-bold">
//               Rs. {price.toLocaleString()}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default ProductCard;
















import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext.tsx';
import { toast } from 'sonner';
import { Product } from '@/types.ts';
import QuickViewModal from './QuickViewModal.tsx';
import { useWishlist } from '../contexts/WishlistContext.tsx';

interface ProductCardProps {
  product: Product;
  variant?: any;
  mode?: 'default' | 'buyNow';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, variant, mode = 'default' }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, checkIfWishlisted } = useWishlist();
  const navigate = useNavigate();

  React.useEffect(() => {
    const check = async () => {
      const exists = await checkIfWishlisted(product.id);
      setIsWishlisted(exists);
    };
    check();
  }, [product.id, checkIfWishlisted]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!localStorage.getItem("token")) {
      toast.error("Login required");
      return;
    }

    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id);
        setIsWishlisted(false);
      } else {
        await addToWishlist(product.id);
        setIsWishlisted(true);
      }
    } catch { }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!localStorage.getItem("token")) {
      toast.error("Login required");
      return;
    }
    if (loading) return;
    try {
      setLoading(true);
      await addToCart(product, 1);
      toast.success("Added to cart");
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  const displayPrice = variant ? (variant.discountPrice || variant.price) : (product.discountPrice || product.price);
  const originalPrice = variant ? (variant.discountPrice ? variant.price : null) : (product.discountPrice ? product.price : null);
  const imageUrl = product.images?.[0] || 'https://images.unsplash.com/photo-1593095191850-2a0bf3a772bf?auto=format&fit=crop&q=80&w=800';

  const getCategoryColor = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('protein')) return 'bg-[#EEE8F5]'; // Soft Purple
    if (cat.includes('pre-workout')) return 'bg-[#F5E8E8]'; // Soft Red/Coral
    if (cat.includes('vitamins')) return 'bg-[#E8F5EE]'; // Soft Green/Mint
    if (cat.includes('fat burner')) return 'bg-[#F5F0E8]'; // Soft Gold/Yellow
    return 'bg-[#F7F7F7]'; // Default Light Grey
  };

  const categoryColor = getCategoryColor(product.category);

  return (
    <>
      <div
        onClick={() => navigate(`/product/${product.id}`)}
        className="group cursor-pointer bg-white overflow-hidden transition-all duration-700 hover:-translate-y-2"
      >
        {/* IMAGE CONTAINER */}
        <div className={`relative aspect-[4/5] ${categoryColor} rounded-2xl overflow-hidden mb-6 flex items-center justify-center p-8 transition-colors group-hover:opacity-90`}>
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-110"
          />

          {/* OVERLAYS */}
          <button
            onClick={toggleWishlist}
            className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-white"
          >
            <svg viewBox="0 0 24 24" className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-current'}`}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          <div className="absolute inset-x-4 bottom-4 flex gap-2 translate-y-12 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] py-3 rounded-xl hover:bg-brand-matte transition-colors"
            >
              {loading ? '...' : 'Add to Bag'}
            </button>
            <button
              onClick={handleQuickView}
              className="p-3 bg-white text-black rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </div>

        {/* INFO BELOW */}
        <div className="space-y-3 px-1">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-black text-brand-matte uppercase tracking-tighter leading-none group-hover:text-brand transition-colors line-clamp-1">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[10px] font-bold text-gray-900">{product.rating || '5.0'}</span>
              <svg className="w-2.5 h-2.5 fill-brand-gold" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          </div>

          <p className="text-[10px] font-bold text-brand-matte/40 uppercase tracking-[0.2em]">
            {product.category} Protocols — {product.subCategory}
          </p>

          <div className="flex items-center gap-3 pt-1 border-t border-gray-100 mt-2">
            <span className="text-xl font-serif text-brand italic tracking-tighter">
              Rs.{displayPrice.toFixed(0)}
            </span>
            {originalPrice && (
              <span className="text-xs text-brand-matte/20 line-through font-bold">
                Rs.{originalPrice.toFixed(0)}
              </span>
            )}
          </div>
        </div>
      </div>

      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
};

export default ProductCard;




