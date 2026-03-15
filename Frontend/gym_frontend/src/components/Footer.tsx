
import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Zap } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-matte border-t border-white/5 text-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="space-y-8">
            <div className="flex items-center gap-3 text-white">
              <img src="/logo.png" alt="Nuvelife Logo" className="h-12 w-auto object-contain" />
              <div className="flex flex-col">
                <span className="text-3xl font-black tracking-tighter uppercase leading-none">
                  NUVE<span className="text-brand-red">LIFE</span>
                </span>
                <span className="text-[8px] tracking-[0.3em] font-bold opacity-60">Nutrition Value Life</span>
              </div>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
              Designed for results. 100% verified protocols for peak human performance. High quality. Zero compromise.
            </p>
            <div className="flex space-x-6">
              <Instagram className="w-5 h-5 hover:text-brand-red cursor-pointer transition-all" />
              <Youtube className="w-5 h-5 hover:text-brand-red cursor-pointer transition-all" />
              <Twitter className="w-5 h-5 hover:text-brand-red cursor-pointer transition-all" />
            </div>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-[0.4em] text-[10px] mb-10">Products</h4>
            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-[0.2em]">
              <li><a href="/products" className="hover:text-brand-red transition-all">All Products</a></li>
              <li><a href="/bundles" className="hover:text-brand-teal transition-all">Performance Bundles</a></li>
              <li><a href="/plans" className="hover:text-brand-red transition-all">Nutrition Plans</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-[0.4em] text-[10px] mb-10">Information</h4>
            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-[0.2em]">
              <li><a href="#" className="hover:text-white transition-all">Shipping & returns</a></li>
              <li><a href="#" className="hover:text-white transition-all">Lab Reports</a></li>
              <li><a href="/contact" className="hover:text-white transition-all">Contact Us</a></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-white font-black uppercase tracking-[0.4em] text-[10px] mb-10">Our Location</h4>
            <ul className="space-y-6 text-[10px] font-bold uppercase tracking-[0.2em]">
              <li className="flex items-center gap-4">
                <MapPin className="w-4 h-4 text-brand-red" />
                <span>nuvelife Performance Lab, Karachi</span>
              </li>
              <li className="flex items-center gap-4 text-brand-teal">
                <Zap className="w-4 h-4" />
                <span>800-ELITE-PROTO</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-24 pt-10 flex flex-col md:flex-row justify-between items-center text-[9px] font-black uppercase tracking-[0.3em]">
          <p>© 2024 NUVELIFE SUPPLEMENTS. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-10 mt-6 md:mt-0">
            <a href="#" className="hover:text-white transition-all">PRIVACY POLICY</a>
            <a href="#" className="hover:text-white transition-all">TERMS OF SERVICE</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;



