import React, { useEffect, useState } from 'react';
import { User, Package, LogOut, ChevronRight, Calendar, Shield, Loader2, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { toast } from 'sonner';
import NuvelifeLoader from '../components/NuvelifeLoader';

const Profile: React.FC = () => {
  const { user, logout, token, updateProfile } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'security'>('profile');

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await api.get('/orders');
      setOrders(res.data.orders);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await updateProfile(name, email);
    } catch (err: any) {
      console.error('Update profile error:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F5F0E8] pt-32 pb-20 relative">
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }}></div>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 items-start">
          
          <aside className="lg:col-span-1 space-y-8">
            <div className="bg-[#FF6B00] border-[4px] border-black p-8 text-center space-y-6 shadow-[8px_8px_0_#000]">
              <div className="w-24 h-24 bg-white text-black mx-auto flex items-center justify-center text-5xl font-syne font-black border-[4px] border-black shadow-[4px_4px_0_#000]">
                {user.name ? user.name.charAt(0) : '?'}
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-syne font-black text-black uppercase tracking-tighter bg-white inline-block px-3 border-[2px] border-black rotate-1">{user.name}</h2>
                <p className="text-black text-xs font-syne font-black uppercase tracking-widest bg-[#179149] text-white inline-block px-4 py-1 border-[2px] border-black mx-auto block w-fit shadow-[2px_2px_0_#000]">{user.role}</p>
              </div>
            </div>

            <nav className="bg-white border-[4px] border-black shadow-[8px_8px_0_#000]">
              {[
                { id: 'profile', icon: <User className="w-5 h-5" strokeWidth={3}/>, label: 'FILE' },
                { id: 'orders', icon: <Package className="w-5 h-5" strokeWidth={3}/>, label: 'LOGISTICS' },
                { id: 'security', icon: <Shield className="w-5 h-5" strokeWidth={3}/>, label: 'SECURITY' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-6 py-5 text-sm font-syne font-black uppercase tracking-widest border-b-[3px] border-black last:border-b-0 hover:bg-[#F5F0E8] transition-colors ${activeTab === item.id ? 'bg-[#179149] text-white hover:bg-[#179149]' : 'text-black'}`}
                >
                  <div className="flex items-center gap-4">
                    {item.icon} {item.label}
                  </div>
                  {activeTab !== item.id && <ChevronRight className="w-5 h-5" strokeWidth={3} />}
                </button>
              ))}
              <button
                onClick={logout}
                className="w-full flex items-center gap-4 px-6 py-5 text-sm font-syne font-black uppercase tracking-widest text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white transition-colors border-t-[4px] border-black bg-[#F5F0E8]"
              >
                <LogOut className="w-5 h-5" strokeWidth={3} /> TERMINATE
              </button>
            </nav>
          </aside>

          <div className="lg:col-span-3 space-y-12">
            {activeTab === 'profile' && (
              <div className="animate-in fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  {[
                    { icon: <Calendar className="w-6 h-6 text-white" strokeWidth={2.5} />, label: 'AUTHORIZED', value: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'OCT 2023', color: 'bg-[#FF6B00]' },
                    { icon: <Package className="w-6 h-6 text-white" strokeWidth={2.5}/>, label: 'CARGO', value: orders.length.toString(), color: 'bg-black' },
                    { icon: <Zap className="w-6 h-6 text-white" strokeWidth={2.5}/>, label: 'STATUS', value: 'ACTIVE', color: 'bg-[#179149]' },
                  ].map((stat, i) => (
                    <div key={i} className={`bg-white p-6 border-[3px] border-black flex items-center gap-4 shadow-[4px_4px_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_#000] transition-all`}>
                      <div className={`w-14 h-14 ${stat.color} flex items-center justify-center shrink-0 border-[2px] border-black shadow-[2px_2px_0_#000]`}>
                        {stat.icon}
                      </div>
                      <div>
                        <p className="text-[10px] font-syne font-black text-black/50 uppercase tracking-widest">{stat.label}</p>
                        <p className="text-xl font-syne font-black text-black tracking-tighter">{stat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <section className="bg-white p-8 md:p-12 border-[4px] border-black shadow-[8px_8px_0_#000] space-y-10">
                  <div className="border-b-[4px] border-black pb-4 inline-block">
                    <h3 className="text-4xl md:text-5xl font-syne font-black text-black uppercase tracking-tighter inline-block relative z-10">USER FILE</h3>
                  </div>
                  
                  <form onSubmit={handleUpdateProfile} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-xs font-syne font-black text-[#FF6B00] uppercase tracking-widest">Full Name</label>
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-[#F5F0E8] border-[3px] border-black p-4 text-sm font-syne font-bold uppercase tracking-widest outline-none focus:-translate-y-1 focus:-translate-x-1 focus:shadow-[4px_4px_0_#000] transition-all text-black"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-syne font-black text-[#FF6B00] uppercase tracking-widest">Email Address</label>
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-[#F5F0E8] border-[3px] border-black p-4 text-sm font-syne font-bold uppercase tracking-widest outline-none focus:-translate-y-1 focus:-translate-x-1 focus:shadow-[4px_4px_0_#000] transition-all text-black"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={updating}
                      className="bg-black text-white px-8 py-5 text-sm font-syne font-black uppercase tracking-widest border-[3px] border-black shadow-[4px_4px_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_#000] hover:bg-[#179149] active:translate-y-0 active:translate-x-0 active:shadow-none transition-all flex items-center gap-3 disabled:opacity-50 disabled:transform-none"
                    >
                      {updating && <Loader2 className="w-5 h-5 animate-spin" strokeWidth={3} />}
                      OVERWRITE DATA
                    </button>
                  </form>
                </section>
              </div>
            )}

            {activeTab === 'orders' && (
              <section className="space-y-8 animate-in fade-in duration-300">
                <div className="border-b-[4px] border-black pb-4 inline-block mb-4 bg-white p-4 shadow-[4px_4px_0_#000]">
                    <h3 className="text-4xl md:text-5xl font-syne font-black text-black uppercase tracking-tighter relative z-10 m-0 leading-none">Manifests</h3>
                </div>

                <div className="space-y-8">
                  {loadingOrders ? (
                    <div className="p-20 text-center flex justify-center bg-white border-[4px] border-black shadow-[8px_8px_0_#000]">
                      <NuvelifeLoader />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="p-20 text-center bg-white border-[4px] border-black shadow-[8px_8px_0_#000]">
                      <p className="text-2xl font-syne font-black uppercase tracking-widest text-[#FF6B00]">NO CARGO FOUND</p>
                    </div>
                  ) : (
                    orders.map(order => (
                      <div key={order.id} className="bg-white border-[4px] border-black flex flex-col hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0_#000] transition-all group shadow-[4px_4px_0_#000]">
                        <div className="p-8 md:p-10 flex flex-col md:flex-row justify-between gap-8">
                          <div className="space-y-6">
                            <div className="flex flex-wrap items-center gap-4">
                              <span className="text-3xl font-syne font-black text-black tracking-tighter">ORD-{order.id.slice(0, 8)}</span>
                              <span className={`px-4 py-2 text-xs font-syne font-black uppercase tracking-widest border-[2px] border-black shadow-[2px_2px_0_#000] ${
                                order.status === 'DELIVERED' ? 'bg-[#179149] text-white' : order.status === 'SHIPPED' ? 'bg-[#FF6B00] text-white' : 'bg-[#F5F0E8] text-black'
                                }`}>
                                {order.status}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-6 text-xs font-syne font-black uppercase tracking-widest text-black/60">
                              <div className="flex items-center gap-2 bg-[#F5F0E8] p-2 border-[2px] border-black"><Calendar className="w-4 h-4 text-black" strokeWidth={3}/> {new Date(order.createdAt).toLocaleDateString()}</div>
                              <div className="flex items-center gap-2 bg-[#F5F0E8] p-2 border-[2px] border-black"><Package className="w-4 h-4 text-black" strokeWidth={3}/> {order.items?.length || 0} ITEMS</div>
                            </div>
                          </div>
                          <div className="flex md:flex-col items-end justify-between border-t-[4px] md:border-t-0 md:border-l-[4px] border-black pt-6 md:pt-0 md:pl-8">
                            <p className="text-4xl font-syne font-black text-black tracking-tighter">Rs.{order.total}</p>
                            <button className="text-white bg-black font-syne font-black uppercase text-[10px] tracking-widest px-4 py-2 border-[2px] border-black hover:bg-[#FF6B00] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[2px_2px_0_#000] transition-all mt-4">VIEW DOSSIER</button>
                          </div>
                        </div>

                        {/* Tracking Visualizer */}
                        <div className="px-8 md:px-10 pb-8 md:pb-10 border-t-[4px] border-black pt-8 md:pt-10 bg-[#F5F0E8]">
                          <p className="text-sm font-syne font-black text-black uppercase tracking-widest mb-8 flex items-center gap-3">
                            <Shield className="w-5 h-5 text-[#179149]" strokeWidth={3}/> ROUTING STATUS
                          </p>
                          <div className="relative">
                            <div className="absolute top-1/2 left-0 w-full h-[4px] bg-black -translate-y-1/2"></div>
                            
                            {/* Progress Fill */}
                            <div className="absolute top-1/2 left-0 h-[4px] bg-[#179149] -translate-y-1/2 transition-all duration-1000" style={{ width: order.status === 'SHIPPED' ? '66%' : order.status === 'DELIVERED' ? '100%' : '33%' }}></div>

                            <div className="relative flex justify-between">
                              {[
                                { label: 'CLEARED', completed: true },
                                { label: 'TRANSIT', completed: order.status === 'SHIPPED' || order.status === 'DELIVERED' },
                                { label: 'SECURED', completed: order.status === 'DELIVERED' }
                              ].map((step, idx) => (
                                <div key={idx} className="flex flex-col items-center gap-3">
                                  <div className={`w-8 h-8 rounded-none border-[3px] border-black flex items-center justify-center transition-all ${step.completed ? 'bg-[#179149] shadow-[2px_2px_0_#000]' : 'bg-white'}`}>
                                      {step.completed && <div className="w-3 h-3 bg-black"></div>}
                                  </div>
                                  <span className={`text-[10px] font-syne font-black uppercase tracking-widest bg-white px-2 py-1 border-[2px] border-black ${step.completed ? 'text-black' : 'text-black/50'} rotate-${idx === 1 ? '1' : idx === 2 ? '-1' : '0'}`}>{step.label}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            )}

            {activeTab === 'security' && (
              <section className="bg-white p-8 md:p-12 border-[4px] border-black shadow-[8px_8px_0_#000] space-y-8 animate-in fade-in duration-300">
                <div className="border-b-[4px] border-black pb-4 inline-block">
                    <h3 className="text-4xl md:text-5xl font-syne font-black text-black uppercase tracking-tighter">PROTOCOLS</h3>
                </div>
                <div className="bg-[#F5F0E8] border-[3px] border-black p-6 shadow-[4px_4px_0_#000]">
                    <p className="text-sm font-syne font-black uppercase tracking-widest text-[#FF6B00] mb-2">SYSTEM ALERT</p>
                    <p className="text-xs font-syne font-bold uppercase tracking-widest text-black/60">Advanced security configurations are currently restricted.</p>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
