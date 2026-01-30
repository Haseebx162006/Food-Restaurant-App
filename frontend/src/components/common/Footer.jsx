import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-dark text-white py-8 mt-auto print:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">FoodExpress</h3>
                        <p className="text-gray-400 text-sm">
                            Delicious food delivered to your doorstep. Fresh, fast, and reliable.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4 text-primary">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="/menu" className="hover:text-white transition-colors">Menu</a></li>
                            <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4 text-primary">Contact Us</h4>
                        <p className="text-gray-400 text-sm">
                            123 Food Street, Tasty City<br />
                            Email: info@foodexpress.com<br />
                            Phone: +1 234 567 890
                        </p>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs text-gray-500">
                    &copy; {new Date().getFullYear()} FoodExpress Restaurant. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
