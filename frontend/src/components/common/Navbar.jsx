import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useAuth from '../../hooks/useAuth';
import { User, X, ShoppingBag, Instagram, Facebook, Twitter, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 30);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isSidebarOpen]);

    const sidebarLinks = [
        { name: 'About Us', href: '/about' },
        { name: 'Terms & Conditions', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Careers', href: '/careers' },
    ];

    const CustomBurger = () => (
        <div className="flex flex-col gap-1.5 group cursor-pointer">
            <div className={`h-[3px] bg-current transition-all duration-300 rounded-full ${isScrolled ? 'w-8' : 'w-10 group-hover:w-8'}`}></div>
            <div className={`h-[3px] bg-current transition-all duration-300 rounded-full ${isScrolled ? 'w-5' : 'w-7 group-hover:w-10'}`}></div>
            <div className={`h-[3px] bg-current transition-all duration-300 rounded-full ${isScrolled ? 'w-8' : 'w-9 group-hover:w-6'}`}></div>
        </div>
    );

    return (
        <>
            <nav 
                className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
                    isScrolled 
                    ? 'bg-white/95 backdrop-blur-xl shadow-lg py-4' 
                    : 'bg-white/40 backdrop-blur-md py-6'
                }`}
            >
                <div className="max-w-[1500px] mx-auto px-8 flex items-center justify-between">
                    {/* LEFT SECTION */}
                    <div className="flex items-center gap-12">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="hover:scale-110 transition-transform active:scale-95 text-dark"
                        >
                            <CustomBurger />
                        </button>

                        <Link href="/" className="flex items-center h-12">
                            <img 
                                src="/logo.jpg" 
                                alt="Shehwar Broast" 
                                className="h-full w-auto object-contain transition-all duration-500" 
                            />
                        </Link>
                        
                        <div className="hidden lg:flex items-center gap-10 border-l border-dark/10 pl-10 text-dark">
                            <Link href="/" className="text-[11px] font-black uppercase tracking-[0.3em] hover:text-primary transition-colors">Home</Link>
                            <Link href="/menu" className="text-[11px] font-black uppercase tracking-[0.3em] hover:text-primary transition-colors">Menu</Link>
                        </div>
                    </div>

                    {/* RIGHT SECTION */}
                    <div className="flex items-center gap-5">
                        <Link 
                            href="/cart" 
                            className="flex items-center gap-3 px-7 py-3.5 rounded-full transition-all group relative overflow-hidden bg-primary text-white shadow-xl"
                        >
                            <ShoppingBag size={18} strokeWidth={3} />
                            <span className="text-[11px] font-black uppercase tracking-widest hidden sm:block">Bucket</span>
                            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black bg-white text-primary">0</div>
                        </Link>

                        <Link 
                            href={isAuthenticated ? "/profile" : "/login"}
                            className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 border bg-dark/5 border-dark/10 text-dark"
                        >
                            <User size={20} />
                        </Link>
                    </div>
                </div>

                {/* SCROLL PROGRESS BAR */}
                <motion.div 
                    className="absolute bottom-0 left-0 h-[3px] bg-primary origin-left w-full z-10"
                    style={{ scaleX }}
                />
            </nav>

            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-dark/90 backdrop-blur-sm z-[200]"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed top-0 left-0 h-full w-full max-w-[500px] bg-white z-[210] shadow-[50px_0_100px_rgba(0,0,0,0.2)] flex flex-col overflow-y-auto"
                        >
                            <div className="p-12 h-full flex flex-col">
                                <div className="flex justify-between items-center mb-24">
                                    <img src="/logo.jpg" alt="Logo" className="h-14 w-auto" />
                                    <button 
                                        onClick={() => setIsSidebarOpen(false)}
                                        className="w-14 h-14 rounded-2xl bg-gray-50 text-dark flex items-center justify-center hover:bg-primary hover:text-white transition-all hover:rotate-90 duration-500"
                                    >
                                        <X size={28} />
                                    </button>
                                </div>

                                <div className="flex flex-col gap-6">
                                    <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">Quick Links</span>
                                    {sidebarLinks.map((link, idx) => (
                                        <motion.div
                                            initial={{ opacity: 0, x: -30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            key={link.name}
                                        >
                                            <Link
                                                href={link.href}
                                                onClick={() => setIsSidebarOpen(false)}
                                                className="group flex items-center justify-between text-4xl font-black text-dark hover:text-primary transition-all uppercase italic tracking-tighter"
                                            >
                                                {link.name}
                                                <ArrowRight className="opacity-0 -translate-x-10 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" size={32} />
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="mt-auto pt-16 border-t border-gray-100">
                                    <div className="grid grid-cols-2 gap-8 mb-12">
                                        <div>
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Location</h4>
                                            <p className="text-sm font-bold text-dark leading-relaxed">Phase 7, Bahria Town,<br/>Rawalpindi, Pakistan</p>
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Support</h4>
                                            <p className="text-sm font-bold text-dark leading-relaxed">+92 123 456 7890<br/>info@shehwar.com</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-4">
                                            {[Instagram, Facebook, Twitter].map((Icon, i) => (
                                                <div key={i} className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer">
                                                    <Icon size={18} />
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">© 2026 SHEHWAR</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;




