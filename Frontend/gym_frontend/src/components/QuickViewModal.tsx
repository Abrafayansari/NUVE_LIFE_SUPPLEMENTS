import React, { useState } from 'react';
import { X, ShoppingCart, Minus, Plus, ExternalLink, Star, ShieldCheck, Zap, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/types';
import { useCart } from '../contexts/CartContext.tsx';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from './ui/dialog.tsx';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { motion } from 'framer-motion';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuickViewModal = ({ product, isOpen, onClose }: QuickViewModalProps) => {
  const [selectedVariant, setSelectedVariant] = useState<any>(product?.variants?.[0] || null);
  const [selectedSize, setSelectedSize] = useState<string>(product?.variants?.[0]?.size || '');
  const [selectedFlavor, setSelectedFlavor] = useState<string>(product?.variants?.[0]?.flavor || '');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const uniqueSizes = Array.from(new Set(product?.variants?.map((v: any) => v.size) || []));
  const availableFlavors = Array.from(new Set(product?.variants?.filter((v: any) => v.size === selectedSize).map((v: any) => v.flavor).filter(Boolean) || []));

  React.useEffect(() => {
    if (product?.variants?.length) {
      const matches = product.variants.filter((v: any) => v.size === selectedSize && (v.flavor === selectedFlavor || !v.flavor));
      if (matches.length > 0) {
        if (selectedFlavor && !matches.some((m: any) => m.flavor === selectedFlavor)) {
          setSelectedFlavor(matches[0].flavor || '');
          setSelectedVariant(matches[0]);
        } else {
          setSelectedVariant(matches.find((m: any) => m.flavor === selectedFlavor) || matches[0]);
        }
      }
    }
  }, [selectedSize, selectedFlavor, product]);

  if (!product) return null;

  const handleAddToCart = async () => {
    if (loading) return;
    if (!localStorage.getItem("token")) {
      toast.error("Login required");
      return;
    }

    try {
      setLoading(true);
      await addToCart(product, quantity, selectedVariant?.id);
      setQuantity(1);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const navigateToDetails = () => {
    onClose();
    navigate(`/product/${product.id}`);
  };

  const mainImage = product.images?.[0] || 'https://via.placeholder.com/400';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-transparent border-none shadow-none rounded-none rounded-sm">
        <VisuallyHidden>
          <DialogTitle>{product.name} - Quick View</DialogTitle>
        </VisuallyHidden>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full bg-[#F5F0E8] border-[4px] border-black shadow-[8px_8px_0_#000] overflow-hidden grid lg:grid-cols-2 mt-4 ml-4 lg:-ml-4 z-50"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 w-10 h-10 bg-[#FF6B00] text-white border-[2px] border-black shadow-[2px_2px_0_#000] flex items-center justify-center hover:bg-black transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={3} />
          </button>

          {/* Left Side: Image */}
          <div className="relative h-[300px] sm:h-[400px] lg:h-full bg-white flex items-center justify-center p-8 overflow-hidden group border-b-[4px] lg:border-b-0 lg:border-r-[4px] border-black">
            {/* Background Texture */}
             <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }}></div>

            <motion.img
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              src={mainImage}
              alt={product.name}
              className="relative z-10 w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
              {product.stock < 10 && product.stock > 0 && (
                <span className="px-3 py-1 bg-[#FF6B00] text-white border-[2px] border-black shadow-[2px_2px_0_#000] text-[10px] font-syne font-black uppercase tracking-widest">
                  Low Stock
                </span>
              )}
              {product.brand && (
                <span className="px-3 py-1 bg-[#179149] text-white border-[2px] border-black shadow-[2px_2px_0_#000] text-[10px] font-syne font-black uppercase tracking-widest">
                  {product.brand}
                </span>
              )}
            </div>
          </div>

          {/* Right Side: Details */}
          <div className="p-6 md:p-8 flex flex-col relative bg-[#F5F0E8]">

            <div className="mb-auto space-y-6">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 mb-3 bg-white border-[2px] border-black p-1 shadow-[2px_2px_0_#000] w-fit"
                >
                  <div className="flex bg-[#179149] p-1 border-[2px] border-black">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(product.rating || 5) ? 'fill-[#FF6B00] text-[#FF6B00]' : 'text-white/20'}`}
                        strokeWidth={2}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] pr-2 font-syne font-black uppercase tracking-widest text-black">({product.reviewCount || 0} REVIEWS)</span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl md:text-3xl font-syne font-black text-black uppercase tracking-tighter leading-none mb-2"
                >
                  {product.name}
                </motion.h2>

                <p className="text-xs font-syne font-black text-[#179149] uppercase tracking-widest mb-4 inline-block border-b-[2px] border-black pb-0.5">
                  {product.category}
                </p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3 flex-wrap p-4 bg-white border-[3px] border-black shadow-[4px_4px_0_#000]"
                >
                  <span className="text-2xl font-syne font-black text-black tracking-tighter">
                    Rs. {(selectedVariant ? (selectedVariant.discountPrice || selectedVariant.price) : (product.discountPrice || product.price)).toLocaleString()}
                  </span>
                  {(selectedVariant?.discountPrice || product.discountPrice) && (
                    <span className="text-sm text-black/50 line-through font-bold">
                      Rs. {(selectedVariant ? selectedVariant.price : product.price).toLocaleString()}
                    </span>
                  )}
                  {selectedVariant && (
                    <span className="text-xs font-syne font-black bg-[#FF6B00] text-white px-2 py-1 border-[2px] border-black ml-auto">
                       {selectedVariant.size} {selectedVariant.flavor && ` / ${selectedVariant.flavor}`}
                    </span>
                  )}
                </motion.div>
              </div>

              {/* Variant Selection */}
              {product.variants && product.variants.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4"
                >
                  {/* Primary Attribute */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-syne font-black uppercase tracking-widest text-[#FF6B00]">Select {product.variantType || 'Size'}</h4>
                    <div className="flex flex-wrap gap-2">
                      {uniqueSizes.map((sz: any) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`px-4 py-2 text-xs font-syne font-black uppercase tracking-widest transition-all ${selectedSize === sz
                              ? 'bg-[#179149] text-white border-[3px] border-black shadow-[4px_4px_0_#000] -translate-y-1 -translate-x-1'
                              : 'bg-white text-black border-[3px] border-black hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0_#000]'
                            }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Secondary Attribute (Flavor) */}
                  {availableFlavors.length > 0 && (
                    <div className="space-y-2 animate-in fade-in duration-300">
                      <h4 className="text-xs font-syne font-black uppercase tracking-widest text-[#FF6B00]">Select Flavor</h4>
                      <div className="flex flex-wrap gap-2">
                        {availableFlavors.map((fl: any) => (
                          <button
                            key={fl}
                            onClick={() => setSelectedFlavor(fl)}
                            className={`px-4 py-2 text-xs font-syne font-black uppercase tracking-widest transition-all ${selectedFlavor === fl
                                ? 'bg-[#FF6B00] text-white border-[3px] border-black shadow-[4px_4px_0_#000] -translate-y-1 -translate-x-1'
                                : 'bg-white text-black border-[3px] border-black hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0_#000]'
                              }`}
                          >
                            {fl}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Quantity */}
               <div className="flex items-center gap-3">
                  <span className="text-xs font-syne font-black uppercase tracking-widest text-[#FF6B00]">QTY</span>
                  <div className="flex items-center bg-white border-[3px] border-black w-fit shadow-[2px_2px_0_#000]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-[#FF6B00] hover:text-white transition-colors"
                    >
                      <Minus className="w-4 h-4" strokeWidth={3} />
                    </button>
                    <span className="w-10 text-center text-black font-syne font-black text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(selectedVariant ? selectedVariant.stock : product.stock, quantity + 1))}
                      className="p-2 hover:bg-[#179149] hover:text-white transition-colors"
                    >
                      <Plus className="w-4 h-4" strokeWidth={3} />
                    </button>
                  </div>
                </div>

            </div>

            {/* Actions */}
            <div className="mt-8 space-y-4">
               <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || loading}
                  className="w-full bg-[#179149] text-white font-syne font-black uppercase tracking-widest text-sm py-4 border-[3px] border-black shadow-[4px_4px_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_#000] active:translate-y-0 active:translate-x-0 active:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'} <ShoppingCart className="w-5 h-5" strokeWidth={2.5}/>
                    </>
                  )}
                </button>

              <button
                onClick={navigateToDetails}
                className="w-full py-4 bg-white text-black font-syne font-black uppercase tracking-widest text-sm border-[3px] border-black shadow-[4px_4px_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_#000] hover:bg-[#FF6B00] hover:text-white active:translate-y-0 active:translate-x-0 active:shadow-none transition-all flex items-center justify-center gap-2"
              >
                VIEW FULL BIO <ExternalLink className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;
