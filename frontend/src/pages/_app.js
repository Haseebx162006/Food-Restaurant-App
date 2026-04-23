import '../styles/globals.css';
import '../styles/Navbar.css';
import '../styles/Hero.css';
import '../styles/MenuCarousel.css';
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
                    <Navbar />

                    <Component {...pageProps} />

                    <Footer />

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
