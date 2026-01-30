/**
 * Next.js App Component
 * This is the root component that wraps all pages
 * Includes global providers, styles, and layout components
 */

import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { SocketProvider } from '../context/SocketContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

function MyApp({ Component, pageProps }) {
    return (
        <AuthProvider>
            <SocketProvider>
                <CartProvider>
                    {/* Navigation Bar */}
                    <Navbar />

                    {/* Main Page Content */}
                    <Component {...pageProps} />

                    {/* Footer */}
                    <Footer />

                    {/* Toast Notifications */}
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                    />
                </CartProvider>
            </SocketProvider>
        </AuthProvider>
    );
}

export default MyApp;
