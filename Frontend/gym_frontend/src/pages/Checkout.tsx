import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Truck, ShieldCheck, CheckCircle, ArrowLeft, Lock, Loader2, Banknote, QrCode, UploadCloud, ChevronRight, PlusCircle, MapPin, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { Product } from '@/types';
import { toast } from 'sonner';

const PAKISTAN_PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Azad Jammu & Kashmir',
  'Gilgit-Baltistan'
];

interface LocationState {
  singleItem?: {
    product: Product;
    quantity: number;
    variant?: any;
    variantId?: string;
  }
}

const Checkout: React.FC = () => {
  const { items: cartItems, clearCart, totalPrice: cartTotalPrice } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [isOrdered, setIsOrdered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<'shipping' | 'payment'>('shipping');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'ONLINE'>('COD');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const isSingleItem = !!state?.singleItem;
  const itemsToProcess = isSingleItem ? [state.singleItem!] : cartItems;

  const subtotal = isSingleItem
    ? (state.singleItem?.variant
      ? (state.singleItem.variant.discountPrice || state.singleItem.variant.price)
      : (state.singleItem!.product.discountPrice || state.singleItem!.product.price)) * state.singleItem!.quantity
    : cartTotalPrice;

  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 300;
  const total = subtotal + shipping;

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: PAKISTAN_PROVINCES[0],
    zipCode: '',
    country: 'Pakistan'
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await api.get('/addresses');
        setAddresses(res.data.addresses);
        if (res.data.addresses.length > 0) {
          setSelectedAddressId(res.data.addresses[0].id);
          setShowNewAddressForm(false);
        } else {
          setShowNewAddressForm(true);
        }
      } catch (err) {
        console.error("Failed to fetch addresses:", err);
      }
    };

    if (token) {
      fetchAddresses();
    }
  }, [token]);

  useEffect(() => {
    if (selectedAddressId) {
      const addr = addresses.find(a => a.id === selectedAddressId);
      if (addr) {
        setFormData({
          fullName: addr.fullName,
          phone: addr.phone,
          street: addr.street,
          city: addr.city,
          state: addr.state,
          zipCode: addr.zipCode,
          country: addr.country
        });
      }
    }
  }, [selectedAddressId, addresses]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) {
      toast.error("You must be logged in to place an order.");
      return;
    }

    if (itemsToProcess.length === 0) {
      toast.error("Your cart is empty. Add items to checkout.");
      return;
    }

    setIsLoading(true);

    try {
      let addressId = selectedAddressId;

      if (showNewAddressForm || !addressId) {
        const addrRes = await api.post('/address', {
          ...formData,
          userId: user.id
        });
        addressId = addrRes.data.address.id;
      }

      const orderItems = itemsToProcess.map((item: any) => ({
        productId: item.product.id,
        variantId: item.variant?.id || item.variantId || null,
        quantity: item.quantity,
        price: item.variant
          ? (item.variant.discountPrice || item.variant.price)
          : (item.product.discountPrice || item.product.price)
      }));

      const formDataPayload = new FormData();
      formDataPayload.append('userId', user.id);
      formDataPayload.append('addressId', addressId);
      formDataPayload.append('paymentMethod', paymentMethod);
      formDataPayload.append('items', JSON.stringify(orderItems));
      if (receiptFile) {
        formDataPayload.append('receipt', receiptFile);
      }

      await api.post('/orders', formDataPayload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setIsOrdered(true);
      if (!isSingleItem) {
        await clearCart();
      }
      setTimeout(() => {
        navigate('/profile');
      }, 5000);

    } catch (err: any) {
      console.error("Checkout error:", err);
      toast.error("Failed to place order. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isOrdered) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] px-4 py-40 text-center flex items-center justify-center">
        <div className="bg-white p-12 md:p-16 border-[3px] border-black shadow-brutal max-w-2xl w-full">
          <div className="w-24 h-24 bg-[#179149] border-[3px] border-black shadow-[4px_4px_0_#000] flex items-center justify-center mx-auto mb-10">
            <CheckCircle className="w-12 h-12 text-white" strokeWidth={3} />
          </div>
          <h1 className="text-4xl md:text-5xl font-syne font-black text-black uppercase tracking-tighter mb-6">
            Order <span className="text-[#FF6B00]">Confirmed</span>
          </h1>
          <p className="text-black/70 text-lg mb-12 max-w-md mx-auto font-bold leading-relaxed">
            Your protocol is locked in. You can track your deployment status in your profile.
          </p>
          <div className="bg-[#F5F0E8] p-6 text-left border-[3px] border-black shadow-[4px_4px_0_#000]">
            <h3 className="text-sm font-syne font-black text-black uppercase tracking-widest mb-2 flex items-center gap-2">
              <Truck className="w-4 h-4" /> Transit Status
            </h3>
            <p className="text-sm text-black/80 font-bold">Location confirmed. ETA 2-4 business days. Redirecting to headquarters...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] pt-32 pb-20 relative">
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-6 bg-white p-8 border-[3px] border-black shadow-brutal">
              <h1 className="text-4xl md:text-5xl font-syne font-black text-black uppercase tracking-tighter">
                Secure <span className="text-[#FF6B00]">Checkout</span>
              </h1>
              <div className="flex items-center gap-4">
                <div className={`px-4 py-2 text-xs font-syne font-black uppercase tracking-widest border-[2px] border-black transition-all duration-300 ${activeStep === 'shipping' ? 'bg-[#179149] text-white shadow-[2px_2px_0_#000]' : 'bg-[#F5F0E8] text-black shadow-none'}`}>1. Details</div>
                <ChevronRight className="w-5 h-5 text-black" strokeWidth={3} />
                <div className={`px-4 py-2 text-xs font-syne font-black uppercase tracking-widest border-[2px] border-black transition-all duration-300 ${activeStep === 'payment' ? 'bg-[#FF6B00] text-white shadow-[2px_2px_0_#000]' : 'bg-[#F5F0E8] text-black shadow-none'}`}>2. Payment</div>
              </div>
            </div>

            {error && (
              <div className="bg-[#FF6B00] border-[3px] border-black p-4 text-white text-sm font-syne font-black uppercase tracking-widest shadow-brutal">
                Alert: {error}
              </div>
            )}

            {activeStep === 'shipping' ? (
              <form onSubmit={(e) => { e.preventDefault(); setActiveStep('payment'); }} className="space-y-10 animate-in slide-in-from-left duration-300 bg-white p-6 md:p-10 border-[3px] border-black shadow-brutal">
                <section className="space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-[3px] border-black pb-4">
                    <div className="flex items-center gap-3 text-lg font-syne font-black uppercase tracking-widest text-[#179149]">
                      <Truck className="w-6 h-6" strokeWidth={2.5}/> Shipping Destination
                    </div>
                    {addresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                        className="text-xs font-syne font-black bg-white border-[2px] border-black px-4 py-2 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0_#000] active:translate-y-0 active:translate-x-0 active:shadow-none transition-all uppercase tracking-widest"
                      >
                        {showNewAddressForm ? 'USE SAVED' : 'ADD NEW'}
                      </button>
                    )}
                  </div>

                  {!showNewAddressForm && addresses.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                      {addresses.map((addr) => (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`p-6 border-[3px] border-black cursor-pointer transition-all duration-300 relative group ${selectedAddressId === addr.id ? 'bg-[#F5F0E8] shadow-[4px_4px_0_#000]' : 'bg-white hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0_#000]'}`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 flex items-center justify-center border-[2px] border-black transition-all ${selectedAddressId === addr.id ? 'bg-[#179149] text-white shadow-[2px_2px_0_#000]' : 'bg-white text-black group-hover:bg-[#F5F0E8]'}`}>
                              <MapPin className="w-6 h-6" strokeWidth={2.5} />
                            </div>
                            <div className="space-y-1 pr-8">
                              <p className="text-sm font-syne font-black text-black uppercase tracking-widest">{addr.fullName}</p>
                              <p className="text-sm text-black/70 font-bold uppercase truncate">{addr.street}, {addr.city}</p>
                              <p className="text-xs text-black/50 font-black uppercase">{addr.phone}</p>
                            </div>
                          </div>
                          {selectedAddressId === addr.id && <CheckCircle className="absolute top-6 right-6 w-6 h-6 text-[#179149]" strokeWidth={3} />}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-6 animate-in fade-in duration-300">
                      <div className="space-y-2 col-span-2">
                        <label className="text-xs font-syne font-black text-black uppercase tracking-widest">Full Name</label>
                        <input required name="fullName" value={formData.fullName} onChange={handleInputChange} type="text" className="w-full bg-[#F5F0E8] border-[3px] border-black p-4 outline-none focus:-translate-y-1 focus:-translate-x-1 focus:shadow-[4px_4px_0_#000] text-black transition-all text-sm font-bold" />
                      </div>
                      <div className="space-y-2 col-span-2 sm:col-span-1">
                        <label className="text-xs font-syne font-black text-black uppercase tracking-widest">Phone</label>
                        <input required name="phone" value={formData.phone} onChange={handleInputChange} type="tel" className="w-full bg-[#F5F0E8] border-[3px] border-black p-4 outline-none focus:-translate-y-1 focus:-translate-x-1 focus:shadow-[4px_4px_0_#000] text-black transition-all text-sm font-bold" />
                      </div>
                      <div className="space-y-2 col-span-2 sm:col-span-1">
                        <label className="text-xs font-syne font-black text-black uppercase tracking-widest">Street Address</label>
                        <input required name="street" value={formData.street} onChange={handleInputChange} type="text" className="w-full bg-[#F5F0E8] border-[3px] border-black p-4 outline-none focus:-translate-y-1 focus:-translate-x-1 focus:shadow-[4px_4px_0_#000] text-black transition-all text-sm font-bold" />
                      </div>
                      <div className="space-y-2 col-span-2 sm:col-span-1">
                        <label className="text-xs font-syne font-black text-black uppercase tracking-widest">City</label>
                        <input required name="city" value={formData.city} onChange={handleInputChange} type="text" className="w-full bg-[#F5F0E8] border-[3px] border-black p-4 outline-none focus:-translate-y-1 focus:-translate-x-1 focus:shadow-[4px_4px_0_#000] text-black transition-all text-sm font-bold" />
                      </div>
                      <div className="space-y-2 col-span-2 sm:col-span-1">
                        <label className="text-xs font-syne font-black text-black uppercase tracking-widest">Province (State)</label>
                        <select
                          required
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full bg-[#F5F0E8] border-[3px] border-black p-4 outline-none focus:-translate-y-1 focus:-translate-x-1 focus:shadow-[4px_4px_0_#000] text-black transition-all text-sm font-bold cursor-pointer"
                        >
                          {PAKISTAN_PROVINCES.map(province => (
                            <option key={province} value={province}>{province}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2 col-span-2 sm:col-span-1">
                        <label className="text-xs font-syne font-black text-black uppercase tracking-widest">Zip Code</label>
                        <input required name="zipCode" value={formData.zipCode} onChange={handleInputChange} type="text" className="w-full bg-[#F5F0E8] border-[3px] border-black p-4 outline-none focus:-translate-y-1 focus:-translate-x-1 focus:shadow-[4px_4px_0_#000] text-black transition-all text-sm font-bold" />
                      </div>
                    </div>
                  )}
                </section>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-6 text-sm font-syne font-black uppercase tracking-widest border-[3px] border-black hover:bg-[#FF6B00] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-brutal-hover active:translate-y-0 active:translate-x-0 active:shadow-none transition-all flex items-center justify-center gap-3"
                >
                  PROCEED TO PAYMENT <ChevronRight className="w-5 h-5" strokeWidth={3} />
                </button>
              </form>
            ) : (
              <div className="space-y-10 animate-in slide-in-from-right duration-300 bg-white p-6 md:p-10 border-[3px] border-black shadow-brutal">
                <section className="space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-[3px] border-black pb-4">
                    <div className="flex items-center gap-3 text-lg font-syne font-black uppercase tracking-widest text-[#FF6B00]">
                      <CreditCard className="w-6 h-6" strokeWidth={2.5} /> Payment Method
                    </div>
                    <button onClick={() => setActiveStep('shipping')} className="text-xs font-syne font-black bg-white border-[2px] border-black px-4 py-2 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0_#000] active:translate-y-0 active:translate-x-0 active:shadow-none transition-all uppercase tracking-widest">Edit Shipping</button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* COD Option */}
                    <div
                      onClick={() => setPaymentMethod('COD')}
                      className={`relative p-8 border-[3px] border-black cursor-pointer transition-all duration-300 group ${paymentMethod === 'COD' ? 'bg-[#F5F0E8] shadow-[4px_4px_0_#000]' : 'bg-white hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0_#000]'}`}
                    >
                      <div className="relative z-10 space-y-4">
                        <div className={`w-14 h-14 flex items-center justify-center border-[2px] border-black transition-all duration-300 ${paymentMethod === 'COD' ? 'bg-[#179149] text-white shadow-[2px_2px_0_#000]' : 'bg-white text-black group-hover:bg-[#F5F0E8]'}`}>
                          <Banknote className="w-6 h-6" strokeWidth={2.5}/>
                        </div>
                        <div>
                          <p className="text-sm font-syne font-black text-black uppercase tracking-widest">Cash on Delivery</p>
                          <p className="text-xs text-black/60 font-bold uppercase mt-1">Pay at doorstep</p>
                        </div>
                      </div>
                      {paymentMethod === 'COD' && <CheckCircle className="absolute top-6 right-6 w-6 h-6 text-[#179149]" strokeWidth={3} />}
                    </div>

                    {/* Online Option */}
                    <div
                      onClick={() => setPaymentMethod('ONLINE')}
                      className={`relative p-8 border-[3px] border-black cursor-pointer transition-all duration-300 group ${paymentMethod === 'ONLINE' ? 'bg-[#F5F0E8] shadow-[4px_4px_0_#000]' : 'bg-white hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0_#000]'}`}
                    >
                      <div className="relative z-10 space-y-4">
                        <div className={`w-14 h-14 flex items-center justify-center border-[2px] border-black transition-all duration-300 ${paymentMethod === 'ONLINE' ? 'bg-[#FF6B00] text-white shadow-[2px_2px_0_#000]' : 'bg-white text-black group-hover:bg-[#F5F0E8]'}`}>
                          <QrCode className="w-6 h-6" strokeWidth={2.5}/>
                        </div>
                        <div>
                          <p className="text-sm font-syne font-black text-black uppercase tracking-widest">Online Details</p>
                          <p className="text-xs text-black/60 font-bold uppercase mt-1">Bank Transfer</p>
                        </div>
                      </div>
                      {paymentMethod === 'ONLINE' && <CheckCircle className="absolute top-6 right-6 w-6 h-6 text-[#FF6B00]" strokeWidth={3} />}
                    </div>
                  </div>

                  {paymentMethod === 'ONLINE' && (
                    <div className="bg-[#F5F0E8] border-[3px] border-black p-8 space-y-6 animate-in fade-in duration-300 shadow-[4px_4px_0_#000]">
                      <div className="space-y-4">
                        <h4 className="text-sm font-syne font-black text-[#FF6B00] uppercase tracking-widest">Transfer Details</h4>
                        <div className="bg-white p-6 border-[3px] border-black shadow-[2px_2px_0_#000]">
                          <p className="text-sm text-black font-syne font-black tracking-widest">IBAN: PK64 NUVE 0000 9238 4721 00</p>
                          <p className="text-xs text-black/60 mt-2 font-bold uppercase tracking-widest">Bank: NUVE Finance Elite</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <p className="text-sm font-syne font-black text-black uppercase tracking-widest">Include Receipt</p>
                        <label className="flex flex-col items-center justify-center w-full min-h-[160px] bg-white border-[3px] border-black border-dashed hover:bg-[#F5F0E8] transition-colors cursor-pointer group">
                          <div className="flex flex-col items-center justify-center py-8">
                            <UploadCloud className="w-10 h-10 text-black/30 group-hover:text-black transition-colors mb-4" strokeWidth={2} />
                            <p className="text-sm font-syne font-black text-black/50 group-hover:text-black transition-colors uppercase tracking-widest">{receiptImage ? 'RECEIPT SECURED' : 'SELECT FILE'}</p>
                          </div>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setReceiptFile(file);
                              const reader = new FileReader();
                              reader.onloadend = () => setReceiptImage(reader.result as string);
                              reader.readAsDataURL(file);
                            }
                          }} />
                        </label>
                        {receiptImage && (
                          <div className="relative w-32 h-32 border-[3px] border-black shadow-[4px_4px_0_#000]">
                            <img src={receiptImage} alt="receipt" className="w-full h-full object-cover" />
                            <button onClick={() => { setReceiptImage(null); setReceiptFile(null); }} className="absolute -top-3 -right-3 bg-[#FF6B00] text-white border-[2px] border-black w-8 h-8 flex items-center justify-center hover:bg-black transition-colors"><X className="w-4 h-4" strokeWidth={3}/></button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </section>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isLoading || (paymentMethod === 'ONLINE' && !receiptImage)}
                  className="w-full bg-[#179149] text-white py-6 text-sm md:text-base font-syne font-black uppercase tracking-widest border-[3px] border-black hover:-translate-y-1 hover:-translate-x-1 hover:shadow-brutal-hover active:translate-y-0 active:translate-x-0 active:shadow-none disabled:bg-black/20 disabled:text-black/50 disabled:border-black/20 disabled:shadow-none disabled:transform-none transition-all flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      DEPLOYING ORDER...
                    </>
                  ) : (
                    `SECURE PROTOCOL (RS. ${total.toFixed(0)})`
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 mt-6 p-4 bg-[#F5F0E8] border-[2px] border-black w-fit mx-auto shadow-[2px_2px_0_#000]">
                  <ShieldCheck className="w-5 h-5 text-[#179149]" strokeWidth={2.5}/> 
                  <span className="text-xs font-syne font-black uppercase tracking-widest text-[#179149]">SSL Encrypted</span>
                </div>
              </div>
            )}
          </div>

          <aside className="lg:col-span-5 bg-white border-[3px] border-black p-8 md:p-10 shadow-brutal sticky top-32">
            <h2 className="text-3xl font-syne font-black text-black uppercase tracking-tighter mb-8 border-b-[4px] border-black pb-4 inline-block">Manifest</h2>
            <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {itemsToProcess.map(item => (
                <div key={item.product.id} className="flex gap-4 items-center bg-[#F5F0E8] border-[3px] border-black p-4 shadow-[4px_4px_0_#000]">
                  <div className="w-20 h-20 bg-white border-[2px] border-black shrink-0 relative p-2">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-contain" />
                    <span className="absolute -top-3 -right-3 bg-black text-white text-xs font-syne font-black w-6 h-6 flex items-center justify-center border-[2px] border-black">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="text-sm font-syne font-black text-black uppercase tracking-widest line-clamp-2">{item.product.name}</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="bg-[#179149] text-white text-[9px] font-syne font-black uppercase px-2 py-0.5 border-[1px] border-black">{item.product.category.split(/[- ]/)[0]}</span>
                      {item.variant && (
                        <span className="bg-[#FF6B00] text-white text-[9px] font-syne font-black uppercase px-2 py-0.5 border-[1px] border-black">
                          {item.variant.size} 
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-syne font-black text-black tracking-tighter bg-white px-2 py-1 border-[2px] border-black shadow-[2px_2px_0_#000] rotate-1">
                    Rs.{((item.variant
                      ? (item.variant.discountPrice || item.variant.price)
                      : (item.product.discountPrice || item.product.price)) * item.quantity).toFixed(0)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-4 border-t-[3px] border-black pt-8">
              <div className="flex justify-between text-sm font-syne font-black uppercase tracking-widest text-black/70 bg-[#F5F0E8] p-3 border-[2px] border-black">
                <span>Subtotal</span>
                <span className="text-black">Rs. {subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm font-syne font-black uppercase tracking-widest text-black/70 bg-[#F5F0E8] p-3 border-[2px] border-black">
                <span>Shipping</span>
                <span className="text-[#179149]">{shipping === 0 ? 'FREE (+0)' : `Rs. ${shipping.toFixed(0)}`}</span>
              </div>
              <div className="flex items-center justify-between text-3xl md:text-4xl font-syne font-black text-black pt-6 mt-4 border-t-[3px] border-black border-dashed">
                <span className="uppercase tracking-widest">Total</span>
                <span className="text-[#FF6B00]">Rs.{total.toFixed(0)}</span>
              </div>
            </div>
            <div className="mt-8 overflow-hidden rounded-none border-[3px] border-black max-w-full">
              {/* Optional decor area if needed */}
               <div className="bg-black text-white p-3 text-center text-[10px] font-syne font-black uppercase tracking-widest">
                  ALL SALES FINAL.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
