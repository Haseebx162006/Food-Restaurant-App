import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#0a0a0a] text-white py-24 px-8 border-t border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black italic">
                                SB
                            </div>
                            <div className="font-black text-2xl italic tracking-tighter">
                                SHEHWAR<span className="text-primary">BROAST</span>
                            </div>
                        </div>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            Crafting culinary excellence since 2010. We serve the most authentic and delicious broast in the city, delivered fresh to your doorstep.
                        </p>
                        <div className="flex gap-4">
                            {[Instagram, Facebook, Twitter].map((Icon, idx) => (
                                <a key={idx} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-black uppercase tracking-widest mb-8 italic">Quick Links</h4>
                        <ul className="space-y-4">
                            {['Menu', 'About Us', 'Our Story', 'Careers'].map((item) => (
                                <li key={item}>
                                    <Link href="/menu" className="text-gray-500 hover:text-primary transition-colors font-bold uppercase text-sm tracking-wider">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-black uppercase tracking-widest mb-8 italic">Support</h4>
                        <ul className="space-y-4">
                            {['Help Center', 'Safety Information', 'Terms of Service', 'Privacy Policy'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-gray-500 hover:text-primary transition-colors font-bold uppercase text-sm tracking-wider">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-black uppercase tracking-widest mb-8 italic">Contact</h4>
                        <ul className="space-y-6">
                            <li className="flex gap-4 text-gray-500">
                                <MapPin className="text-primary flex-shrink-0" size={20} />
                                <span className="text-sm font-bold uppercase tracking-wider">123 Food Street, Karachi, Pakistan</span>
                            </li>
                            <li className="flex gap-4 text-gray-500">
                                <Phone className="text-primary flex-shrink-0" size={20} />
                                <span className="text-sm font-bold uppercase tracking-wider">+92 345 678 901</span>
                            </li>
                            <li className="flex gap-4 text-gray-500">
                                <Mail className="text-primary flex-shrink-0" size={20} />
                                <span className="text-sm font-bold uppercase tracking-wider">hello@shehwarbroast.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-gray-600 text-xs font-black uppercase tracking-[0.2em]">
                        © 2026 SHEHWAR BROAST. CRAFTED WITH PASSION.
                    </p>
                    <div className="flex gap-8 text-gray-600 text-xs font-black uppercase tracking-[0.2em]">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

