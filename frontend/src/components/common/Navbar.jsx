import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useAuth from '../../hooks/useAuth';
import { ShoppingCart, User, LogOut, Menu as MenuIcon, X } from 'lucide-react';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = isAuthenticated
        ? user?.role === 'admin'
            ? [
                { name: 'Dashboard', href: '/admin/dashboard' },
                { name: 'Orders', href: '/admin/orders' },
                { name: 'Menu Mgmt', href: '/admin/menu' },
                { name: 'Stats', href: '/admin/stats' },
            ]
            : [
                { name: 'Menu', href: '/menu' },
                { name: 'My Orders', href: '/orders' },
                { name: 'Invoices', href: '/invoices' },
                { name: 'Cart', href: '/cart' },
            ]
        : [
            { name: 'Menu', href: '/menu' },
            { name: 'Login', href: '/login' },
            { name: 'Sign Up', href: '/signup' },
        ];

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-heading font-bold text-primary">Food<span className="text-secondary">Express</span></span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-medium transition-colors hover:text-primary ${router.pathname === link.href ? 'text-primary' : 'text-dark'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {isAuthenticated && (
                            <div className="flex items-center space-x-4 border-l pl-4">
                                <Link href="/profile" className="text-dark hover:text-primary transition-colors">
                                    <User size={20} />
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-dark hover:text-error transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-dark hover:text-primary focus:outline-none"
                        >
                            {isMobileMenuOpen ? <X size={28} /> : <MenuIcon size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${router.pathname === link.href
                                    ? 'bg-red-50 text-primary'
                                    : 'text-dark hover:bg-gray-100'
                                    }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        {isAuthenticated && (
                            <>
                                <Link
                                    href="/profile"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-dark hover:bg-gray-100"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-error hover:bg-red-50"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
