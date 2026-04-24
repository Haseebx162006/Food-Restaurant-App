import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useAuth from '../../hooks/useAuth';
import { ShoppingCart, User, LogOut, Menu as MenuIcon, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = isAuthenticated
        ? user?.role === 'admin'
            ? [
                { name: 'Dashboard', href: '/admin/dashboard' },
                { name: 'Orders', href: '/admin/orders' },
                { name: 'Menu Mgmt', href: '/admin/menu' },
            ]
            : [
                { name: 'Menu', href: '/menu' },
                { name: 'Orders', href: '/orders' },
                { name: 'Cart', href: '/cart' },
            ]
        : [
            { name: 'Menu', href: '/menu' },
            { name: 'Login', href: '/login' },
        ];

    return (
        <>
            <nav 
                className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 px-6 py-4 ${
                    isScrolled ? 'md:px-12 md:py-6' : 'md:px-24 md:py-8'
                }`}
            >
                <div 
                    className={`max-w-7xl mx-auto flex items-center justify-between px-8 py-4 rounded-full transition-all duration-500 ${
                        isScrolled 
                        ? 'bg-white/80 backdrop-blur-xl shadow-2xl border border-white/20' 
                        : 'bg-white/10 backdrop-blur-md border border-white/10 shadow-lg'
                    }`}
                >
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black italic group-hover:rotate-12 transition-transform">
                            SB
                        </div>
                        <div className={`font-black text-xl italic tracking-tighter ${isScrolled ? 'text-dark' : 'text-white'}`}>
                            SHEHWAR<span className="text-primary">BROAST</span>
                        </div>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-black uppercase tracking-widest transition-all hover:text-primary ${
                                    router.pathname === link.href 
                                    ? 'text-primary' 
                                    : isScrolled ? 'text-dark/70' : 'text-white/70'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-2">
                                <Link 
                                    href="/profile" 
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                                        isScrolled ? 'bg-dark/5 text-dark hover:bg-primary hover:text-white' : 'bg-white/10 text-white hover:bg-primary'
                                    }`}
                                >
                                    <User size={18} />
                                </Link>
                                <button
                                    onClick={logout}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                                        isScrolled ? 'bg-dark/5 text-dark hover:bg-error hover:text-white' : 'bg-white/10 text-white hover:bg-error'
                                    }`}
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <Link 
                                href="/signup" 
                                className="hidden md:block btn-primary px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest"
                            >
                                Get Started
                            </Link>
                        )}
                        
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className={`md:hidden w-10 h-10 rounded-full flex items-center justify-center ${
                                isScrolled ? 'bg-dark/5 text-dark' : 'bg-white/10 text-white'
                            }`}
                        >
                            <MenuIcon size={20} />
                        </button>
                    </div>
                </div>
            </nav>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[200] bg-dark flex flex-col p-8"
                    >
                        <div className="flex justify-between items-center mb-12">
                            <div className="font-black text-2xl text-white italic">
                                SHEHWAR<span className="text-primary">BROAST</span>
                            </div>
                            <button 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-6">
                            {navLinks.map((link, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    key={link.name}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-4xl font-black text-white hover:text-primary transition-colors italic uppercase"
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-auto pt-12 border-t border-white/10">
                            {isAuthenticated ? (
                                <button 
                                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                                    className="text-primary font-black uppercase tracking-widest text-lg"
                                >
                                    Logout
                                </button>
                            ) : (
                                <Link 
                                    href="/login" 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-primary font-black uppercase tracking-widest text-lg"
                                >
                                    Login to your account
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;

