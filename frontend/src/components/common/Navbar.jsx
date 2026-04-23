import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useAuth from '../../hooks/useAuth';
import { ShoppingCart, User, LogOut, Menu as MenuIcon, X } from 'lucide-react';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
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
        <>
            <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
                <div className="nav-container">
                    <Link href="/" className="nav-logo">
                        <img src="/images/logo.jpg" alt="Logo" className="logo-img" />
                        <div className="brand-name">
                            SHEHWAR <span>BROAST</span>
                        </div>
                    </Link>

                    <div className="nav-links">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`nav-link ${router.pathname === link.href ? 'active' : ''}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="nav-actions">
                        {isAuthenticated && (
                            <>
                                <Link href="/profile" className="icon-btn" title="Profile">
                                    <User size={20} />
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="icon-btn"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </button>
                            </>
                        )}
                        
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="icon-btn mobile-menu-btn"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            <div className={`mobile-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
                <div className="mobile-links-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                    {navLinks.map((link, i) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="mobile-nav-link"
                            style={{ '--i': i }}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    {isAuthenticated && (
                        <>
                            <Link
                                href="/profile"
                                className="mobile-nav-link"
                                style={{ '--i': navLinks.length }}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="mobile-nav-link"
                                style={{ '--i': navLinks.length + 1, color: 'var(--error)' }}
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Navbar;
