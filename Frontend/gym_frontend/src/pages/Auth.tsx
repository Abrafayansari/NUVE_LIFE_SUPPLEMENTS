import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.tsx';

interface AuthProps {
    mode: 'login' | 'signup' | 'admin-login';
}

const Auth: React.FC<AuthProps> = ({ mode }) => {
    const { login, signup, user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role] = useState<'ADMIN' | 'CUSTOMER'>(
        mode === 'admin-login' ? 'ADMIN' : 'CUSTOMER'
    );

    useEffect(() => {
        if (user) {
            if (user.role === 'ADMIN') navigate('/admin');
            else navigate('/');
        }
    }, [user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (mode === 'signup') {
                await signup(name, email, password, role);
            } else {
                await login(email, password);
            }
        } catch (error: any) {
            console.error('Authentication error:', error);
        } finally {
            setLoading(false);
        }
    };

    const title = mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Admin Area';
    const subtitle = mode === 'login'
        ? 'Sign in to access your vault'
        : mode === 'signup'
            ? 'Start your journey with us'
            : 'Access the administrative system';

    return (
        <div className="min-h-screen bg-[#F5F0E8] flex flex-col lg:flex-row font-sans overflow-x-hidden relative">
            {/* Background Texture */}
             <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }}></div>

            {/* Left Side: Brand & Features */}
            <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between relative bg-black border-r-[4px] border-black z-10 text-white shadow-[8px_0_0_rgba(23,145,73,1)]">
                <Link to="/" className="flex items-center gap-4 relative z-10 group w-fit">
                    <div className="w-14 h-14 bg-[#FF6B00] flex items-center justify-center border-[3px] border-white shadow-[4px_4px_0_#179149] group-hover:-translate-y-1 group-hover:-translate-x-1 group-hover:shadow-[6px_6px_0_#179149] transition-all">
                        <ShoppingCart className="w-6 h-6 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-3xl font-syne font-black tracking-widest uppercase">NUVELIFE</span>
                </Link>

                <div className="relative z-10 max-w-xl my-auto">
                    <h2 className="text-6xl xl:text-8xl font-syne font-black leading-[0.9] tracking-tighter mb-8 uppercase drop-shadow-[4px_4px_0_#FF6B00]">
                        Fuel Your <br />
                        <span className="text-[#179149]">Lifestyle</span>
                    </h2>
                    <div className="space-y-6">
                        {[
                            { title: "Premium Quality", desc: "Highest grade supplements for your daily needs.", color: "bg-[#FF6B00]" },
                            { title: "Trusted Brand", desc: "Rigorously tested products for total safety.", color: "bg-[#179149]" },
                            { title: "Better Results", desc: "Formulas optimized for your personal goals.", color: "bg-white" }
                        ].map((feature, i) => (
                            <div key={i} className="flex gap-4 group items-start bg-[#111] p-4 border-[3px] border-white/20 hover:border-[#FF6B00] hover:-translate-y-1 hover:shadow-[4px_4px_0_#FF6B00] transition-all cursor-crosshair">
                                <div className={`w-6 h-6 shrink-0 border-[2px] border-black shadow-[2px_2px_0_rgba(255,255,255,0.5)] ${feature.color}`}>
                                </div>
                                <div>
                                    <h4 className="font-syne font-black uppercase text-sm tracking-widest mb-1 text-white">{feature.title}</h4>
                                    <p className="text-white/60 text-xs font-bold uppercase leading-relaxed max-w-xs">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-[10px] font-syne font-black text-white/50 uppercase tracking-[0.4em] relative z-10">
                    © {new Date().getFullYear()} NUVELIFE · PREMIUM E-COMMERCE
                </div>
            </div>

            {/* Right Side: Auth Form */}
            <div className="flex-grow flex items-center justify-center p-6 md:p-12 lg:p-16 relative z-10">
               
                <div className="w-full max-w-[480px] bg-white p-8 md:p-12 border-[4px] border-black shadow-[8px_8px_0_#000]">
                    <div className="text-center lg:text-left mb-10 border-b-[4px] border-black pb-6">
                        <h1 className="text-4xl lg:text-5xl font-syne font-black text-black uppercase tracking-tighter mb-2">
                            {title}
                        </h1>
                        <p className="text-[#FF6B00] text-sm font-syne font-black uppercase tracking-widest bg-[#F5F0E8] px-3 py-1 inline-block border-[2px] border-black shadow-[2px_2px_0_#000] rotate-1">{subtitle}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {mode === 'signup' && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-syne font-black text-black uppercase tracking-widest">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="YOUR NAME"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-[#F5F0E8] border-[3px] border-black p-4 text-black text-sm font-syne font-bold uppercase tracking-widest outline-none focus:-translate-y-1 focus:-translate-x-1 focus:shadow-[4px_4px_0_#000] transition-all"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-syne font-black text-black uppercase tracking-widest">Email Address</label>
                            <input
                                required
                                type="email"
                                placeholder="YOUR@EMAIL.COM"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#F5F0E8] border-[3px] border-black p-4 text-black text-sm font-syne font-bold uppercase tracking-widest outline-none focus:-translate-y-1 focus:-translate-x-1 focus:shadow-[4px_4px_0_#000] transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-syne font-black text-black uppercase tracking-widest">Password</label>
                                {mode !== 'signup' && (
                                    <Link to="/forgot-password" size="sm" className="text-[10px] font-syne font-black text-[#179149] hover:text-[#FF6B00] transition-colors uppercase tracking-widest border-b-2 border-transparent hover:border-[#FF6B00]">
                                        Forgot Password?
                                    </Link>
                                )}
                            </div>
                            <div className="relative">
                                <input
                                    required
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#F5F0E8] border-[3px] border-black p-4 pr-20 text-black text-sm font-syne font-bold tracking-widest outline-none focus:-translate-y-1 focus:-translate-x-1 focus:shadow-[4px_4px_0_#000] transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-syne font-black bg-black text-white px-2 py-1 uppercase tracking-widest hover:bg-[#FF6B00]"
                                >
                                    {showPassword ? 'HIDE' : 'SHOW'}
                                </button>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#179149] hover:bg-[#FF6B00] text-white py-5 font-syne font-black text-sm uppercase tracking-widest border-[3px] border-black shadow-[4px_4px_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_#000] active:translate-y-0 active:translate-x-0 active:shadow-none transition-all disabled:opacity-50 disabled:transform-none disabled:shadow-none flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <span className="animate-pulse">PROCESSING...</span>
                                ) : (
                                    <>
                                        {mode === 'signup' ? 'INITIALIZE ACCOUNT' : 'ENTER SYSTEM'}
                                        <ArrowRight className="w-5 h-5" strokeWidth={3} />
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="text-center pt-8 border-t-[3px] border-black mt-8">
                            <div className="text-[10px] font-syne font-black text-black uppercase tracking-widest">
                                {mode === 'login' || mode === 'admin-login' ? (
                                    <>
                                        Don't have an account?{" "}
                                        <Link to="/signup" className="text-[#FF6B00] hover:text-[#179149] underline decoration-2 underline-offset-4 transition-colors">Sign Up</Link>
                                    </>
                                ) : (
                                    <>
                                        Already have an account?{" "}
                                        <Link to="/login" className="text-[#FF6B00] hover:text-[#179149] underline decoration-2 underline-offset-4 transition-colors">Sign In</Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {mode === 'login' && (
                            <div className="mt-8 bg-[#F5F0E8] border-[3px] border-black p-4 relative shadow-[4px_4px_0_#000]">
                                <div className="absolute -top-3 -right-3 bg-[#FF6B00] text-white text-[10px] font-syne font-black px-2 py-1 uppercase tracking-widest border-[2px] border-black rotate-3">Demo Build</div>
                                <p className="text-[10px] font-syne font-black text-black uppercase mb-2 tracking-widest underline decoration-wavy decoration-[#179149]">TEST ACCESS</p>
                                <div className="flex flex-col gap-1 text-[10px] text-black font-syne font-bold uppercase tracking-widest">
                                    <span>EMAIL: test@gmail.com</span>
                                    <span>PASS: test4321</span>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
            
             <Link to="/" className="absolute top-4 right-4 z-[100] bg-white border-[3px] border-black px-4 py-2 font-syne font-black text-black text-[10px] uppercase shadow-[2px_2px_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0_#000] active:translate-y-0 active:translate-x-0 active:shadow-none transition-all">
                EXIT PORTAL
             </Link>
        </div>
    );
};

export default Auth;
