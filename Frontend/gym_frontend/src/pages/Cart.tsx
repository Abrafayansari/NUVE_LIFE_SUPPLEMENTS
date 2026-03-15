import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext.tsx';
import ProductCard from '../components/ProductCard.tsx';
import NuvelifeLoader from '../components/NuvelifeLoader.tsx';

const Cart: React.FC = () => {
  const { items, showCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        await showCart();
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <NuvelifeLoader />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center relative">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}></div>
        
        <div className="bg-white p-12 md:p-16 border-[4px] border-black shadow-[8px_8px_0_#000] text-center max-w-2xl w-full relative z-10">
          <div className="w-24 h-24 bg-[#FF6B00] border-[3px] border-black shadow-[4px_4px_0_#000] flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="w-12 h-12 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-syne font-black text-black mb-4 uppercase tracking-tighter">Your vault is empty</h1>
          <p className="text-black/60 font-bold mb-10 max-w-md mx-auto uppercase tracking-widest text-sm">No protocols selected yet.</p>
          <Link to="/products" className="inline-flex items-center justify-center gap-3 bg-[#179149] text-white px-8 py-4 font-syne font-black text-sm uppercase tracking-widest border-[3px] border-black shadow-[4px_4px_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_#000] active:translate-y-0 active:translate-x-0 active:shadow-none transition-all">
            BROWSE ARSENAL <ArrowRight className="w-5 h-5" strokeWidth={3} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}></div>
      
      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6 bg-white p-8 border-[4px] border-black shadow-[8px_8px_0_#000]">
          <div>
            <h1 className="text-4xl md:text-5xl font-syne font-black text-black uppercase tracking-tighter">YOUR <span className="text-[#FF6B00]">VAULT</span></h1>
            <p className="text-black/50 font-bold uppercase tracking-widest text-xs mt-2 bg-[#F5F0E8] px-3 py-1 border-[2px] border-black inline-block shadow-[2px_2px_0_#000] rotate-1">Pending Protocols</p>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="bg-black text-white px-8 py-4 text-sm font-syne font-black uppercase tracking-widest border-[3px] border-black shadow-[4px_4px_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_#000] hover:bg-[#FF6B00] active:translate-y-0 active:translate-x-0 active:shadow-none transition-all flex items-center gap-3"
          >
            INITIATE CHECKOUT <ArrowRight className="w-5 h-5" strokeWidth={3} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-12">
          {items.map(item => (
            <div key={item.id} className="group">
              <ProductCard
                product={item.product}
                variant={item.variant}
                mode="buyNow"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cart;
