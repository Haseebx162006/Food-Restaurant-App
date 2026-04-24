import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ChevronLeft, ChevronRight, ArrowRight, Star, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import menuService from "@/services/menuService";
import MenuCard from "@/components/customer/MenuCard";
import { useCart } from "@/context/CartContext";
import { toast } from "react-toastify";

const slides = [
    { 
        image: "/hero/hero1.png",
        title: "Taste the Extraordinary",
        subtitle: "Experience gourmet flavors crafted with passion and fresh ingredients.",
        cta: "Explore Menu"
    },
    { 
        image: "/hero/hero2.png",
        title: "Authentic & Delicious",
        subtitle: "From classic favorites to modern twists, every bite is a celebration.",
        cta: "Order Now"
    },
    { 
        image: "/hero/hero3.png",
        title: "Sweet Moments",
        subtitle: "Indulge in our decadent collection of desserts and treats.",
        cta: "View Desserts"
    }
];

export default function Home() {
    const { addToCart } = useCart();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [menuItems, setMenuItems] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleAddToCart = (e, item) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(item);
        toast.success(`${item.name} added to bucket!`, {
            position: "bottom-right",
            autoClose: 2000,
            theme: "dark"
        });
    };

    const nextHeroSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, []);

    const prevHeroSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    useEffect(() => {
        const timer = setInterval(nextHeroSlide, 8000);
        return () => clearInterval(timer);
    }, [nextHeroSlide]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await menuService.fetchAllMenuItems();
                setMenuItems(response.data || []);
            } catch (error) {
                console.error("Failed to fetch menu items", error);
            }
        };
        fetchItems();
    }, []);

    const nextMenu = () => {
        if (currentIndex < Math.max(0, menuItems.length - 5)) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prevMenu = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <div className="bg-[#fcfcfc] overflow-x-hidden">
            <section className="relative h-[85vh] min-h-[600px] w-[95%] max-w-[1500px] mx-auto mt-[120px] rounded-[40px] overflow-hidden shadow-2xl">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0"
                    >
                        <Image 
                            src={slides[currentSlide].image} 
                            alt="Hero" 
                            fill
                            priority
                            className="object-cover scale-105"
                        />
                        <Image 
                            src={slides[currentSlide].image} 
                            alt="Hero" 
                            fill
                            priority
                            className="object-cover scale-105"
                        />
                    </motion.div>
                </AnimatePresence>
                <div className="absolute bottom-10 right-10 flex gap-4 z-10">
                    <button 
                        onClick={prevHeroSlide} 
                        className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-primary transition-all active:scale-90"
                    >
                        <ChevronLeft size={28} />
                    </button>
                    <button 
                        onClick={nextHeroSlide} 
                        className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-primary transition-all active:scale-90"
                    >
                        <ChevronRight size={28} />
                    </button>
                </div>

            </section>

            <section className="section-container relative">
                <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10"></div>
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 text-center md:text-left gap-6"
                >
                    <div className="relative">
                        <motion.span 
                            initial={{ x: -20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-2 block"
                        >
                            Our Special Selection
                        </motion.span>
                        <h2 className="text-5xl md:text-7xl font-black text-dark mb-2 tracking-tighter italic">EXPLORE <span className="text-primary">MENU</span></h2>
                        <div className="w-full h-2 bg-dark rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ x: '-100%' }}
                                whileInView={{ x: 0 }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="w-1/3 h-full bg-primary"
                            />
                        </div>
                    </div>
                    <Link href="/menu" className="group flex items-center gap-3 bg-dark text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-primary transition-all shadow-xl hover:shadow-primary/40 active:scale-95">
                        View Full Menu <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </motion.div>

                <div className="relative px-4">
                    <motion.div 
                        className="overflow-visible py-10 cursor-grab active:cursor-grabbing"
                    >
                        <motion.div 
                            className="flex gap-6"
                            drag="x"
                            dragConstraints={{
                                left: -(menuItems.length * (100 / 5) * (currentIndex + 1)), // Rough estimate, will refine
                                right: 0
                            }}
                            animate={{ x: `-${currentIndex * 20}%` }}
                            transition={{ type: "spring", stiffness: 200, damping: 30 }}
                            style={{ 
                                width: `${Math.max(100, (menuItems.length / 5) * 100)}%`,
                                display: 'flex'
                            }}
                        >
                            {menuItems.map((item, idx) => (
                                <motion.div 
                                    key={item._id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.05 }}
                                    style={{ width: 'calc(20% - 19.2px)' }}
                                    className="flex-shrink-0"
                                >
                                    <Link href={`/menu/${item._id}`} className="block group">
                                        <motion.div 
                                            whileHover={{ y: -15, rotateY: 5 }}
                                            className={`relative p-6 rounded-[40px] text-center transition-all duration-500 overflow-hidden shadow-lg ${
                                                idx % 2 === 0 
                                                ? 'bg-primary text-white group-hover:bg-dark' 
                                                : 'bg-white text-dark border border-gray-100 group-hover:bg-primary group-hover:text-white group-hover:border-transparent'
                                            }`}
                                        >
                                            <div className="relative w-full aspect-square mb-4 z-10 flex items-center justify-center">
                                                <motion.img 
                                                    whileHover={{ scale: 1.1 }}
                                                    src={item.image ? (item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`) : '/images/food-placeholder.jpg'} 
                                                    alt={item.name} 
                                                    className="w-4/5 h-4/5 object-contain drop-shadow-xl"
                                                />
                                            </div>
                                            
                                            <h3 className={`text-lg font-black mb-2 truncate transition-colors ${
                                                idx % 2 === 0 ? 'text-white group-hover:text-primary' : 'text-dark group-hover:text-white'
                                            }`}>{item.name}</h3>
                                            
                                            <div className={`mt-2 text-[10px] font-black uppercase tracking-widest opacity-60`}>
                                                Explore
                                            </div>
                                        </motion.div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    <div className="flex justify-center gap-4 mt-8">
                        <button 
                            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                            disabled={currentIndex === 0}
                            className="w-12 h-12 rounded-full bg-white border border-gray-100 shadow-lg flex items-center justify-center text-dark hover:bg-primary hover:text-white transition-all disabled:opacity-20"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button 
                            onClick={() => setCurrentIndex(Math.min(Math.max(0, menuItems.length - 5), currentIndex + 1))}
                            disabled={currentIndex >= Math.max(0, menuItems.length - 5)}
                            className="w-12 h-12 rounded-full bg-white border border-gray-100 shadow-lg flex items-center justify-center text-dark hover:bg-primary hover:text-white transition-all disabled:opacity-20"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            </section>

            <section className="bg-dark py-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

                <div className="max-w-[1500px] mx-auto px-8">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="mb-20"
                    >
                        <span className="text-primary font-black uppercase tracking-[0.4em] text-xs mb-4 block">Most Wanted</span>
                        <h2 className="text-6xl md:text-8xl font-black text-white mb-2 uppercase italic tracking-tighter">Best <span className="text-primary">Sellers</span></h2>
                        <div className="flex gap-2">
                            {[1,2,3,4].map(i => <div key={i} className="w-12 h-2 bg-primary"></div>)}
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {menuItems.slice(0, 4).map((item, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                key={item._id}
                                className="relative pb-10"
                            >
                                <Link href={`/menu/${item._id}`} className="block group">
                                    <div className={`relative p-10 rounded-[50px] transition-all duration-500 overflow-hidden shadow-2xl group-hover:-translate-y-4 ${
                                        idx % 2 === 0 
                                        ? 'bg-primary text-white' 
                                        : 'bg-white text-dark'
                                    }`}>
                                        <div className="absolute top-8 right-8 glass-dark px-4 py-2 rounded-full flex items-center gap-1.5 border border-white/10 shadow-lg z-20">
                                            <Star size={18} fill="#FFD700" className="text-[#FFD700]" />
                                            <span className={`font-black text-sm ${idx % 2 === 0 ? 'text-white' : 'text-dark'}`}>4.9</span>
                                        </div>

                                        <div className="w-full aspect-square mb-10 p-4 relative z-10">
                                            <img 
                                                src={item.image ? (item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`) : '/images/food-placeholder.jpg'} 
                                                alt={item.name} 
                                                className={`w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 ${
                                                    idx % 2 === 0 
                                                    ? 'drop-shadow-[0_25px_50px_rgba(0,0,0,0.3)]' 
                                                    : 'drop-shadow-[0_25px_50px_rgba(255,49,49,0.2)]'
                                                }`}
                                            />
                                        </div>

                                        <div className="space-y-4 relative z-10 pb-6 text-center">
                                            <h3 className="text-3xl font-black italic tracking-tighter line-clamp-1 truncate">{item.name}</h3>
                                            <span className={`text-4xl font-black block ${idx % 2 === 0 ? 'text-white' : 'text-primary'}`}>
                                                Rs {item.price}
                                            </span>
                                        </div>
                                    </div>
                                </Link>

                                <motion.button
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => handleAddToCart(e, item)}
                                    className="absolute bottom-4 left-1/2 -translate-x-1/2 px-8 py-4 rounded-full bg-dark text-white font-black uppercase tracking-widest text-[10px] shadow-2xl z-30 border-4 border-dark hover:bg-primary transition-all group-hover:border-primary whitespace-nowrap"
                                >
                                    Add to Bucket
                                </motion.button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section-container relative overflow-hidden">
                <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 text-center md:text-left gap-6"
                >
                    <div className="relative">
                        <motion.span 
                            initial={{ x: -20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-2 block"
                        >
                            Limited Time Offers
                        </motion.span>
                        <h2 className="text-5xl md:text-7xl font-black text-dark mb-2 tracking-tighter italic uppercase">Top <span className="text-primary">Deals</span></h2>
                        <div className="w-20 h-2 bg-dark rounded-full"></div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                    {menuItems.slice(4, 12).map((item, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            key={item._id}
                            className="relative pb-12"
                        >
                            <Link href={`/menu/${item._id}`} className="block group">
                                <div className={`relative p-8 rounded-[40px] transition-all duration-500 overflow-hidden shadow-xl group-hover:-translate-y-3 ${
                                    idx % 2 !== 0 
                                    ? 'bg-primary text-white' 
                                    : 'bg-white text-dark border border-gray-100'
                                }`}>
                                    <div className="absolute top-6 right-6 glass-dark px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10 z-20">
                                        <Star size={14} fill="#FFD700" className="text-[#FFD700]" />
                                        <span className={`font-black text-xs ${idx % 2 !== 0 ? 'text-white' : 'text-dark'}`}>4.8</span>
                                    </div>

                                    <div className="w-full aspect-square mb-6 p-2 relative z-10">
                                        <img 
                                            src={item.image ? (item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`) : '/images/food-placeholder.jpg'} 
                                            alt={item.name} 
                                            className={`w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 ${
                                                idx % 2 !== 0 
                                                ? 'drop-shadow-[0_15px_30px_rgba(0,0,0,0.2)]' 
                                                : 'drop-shadow-[0_15px_30px_rgba(255,49,49,0.15)]'
                                            }`}
                                        />
                                    </div>

                                    <div className="space-y-2 relative z-10 pb-4 text-center">
                                        <h3 className="text-xl font-black italic tracking-tighter line-clamp-1 truncate">{item.name}</h3>
                                        <span className={`text-2xl font-black block ${idx % 2 !== 0 ? 'text-white' : 'text-primary'}`}>
                                            Rs {item.price}
                                        </span>
                                    </div>
                                </div>
                            </Link>

                            <motion.button
                                whileHover={{ scale: 1.05, y: -3 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => handleAddToCart(e, item)}
                                className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-dark text-white font-black uppercase tracking-widest text-[9px] shadow-2xl z-30 border-2 border-dark hover:bg-primary transition-all group-hover:border-primary whitespace-nowrap"
                            >
                                Add to Bucket
                            </motion.button>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className="py-32 bg-primary relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none select-none overflow-hidden">
                    <div className="absolute top-10 left-10 text-white/10 text-9xl font-black rotate-12">FAST</div>
                    <div className="absolute top-40 right-20 text-white/10 text-[12rem] font-black -rotate-6">SHEHWAR</div>
                    <div className="absolute bottom-20 left-1/4 text-white/5 text-[15rem] font-black rotate-45">FAST</div>
                    <div className="absolute bottom-40 right-10 text-white/10 text-9xl font-black -rotate-12">SHEHWAR</div>
                </div>

                <div className="max-w-[1500px] mx-auto px-8 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter italic uppercase">Our <span className="text-dark">Specials</span></h2>
                        <div className="w-40 h-2 bg-white mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            '/banners/pickup.png',
                            '/banners/value-bucket.png',
                            '/banners/app.png',
                            '/banners/explore.png'
                        ].map((banner, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="relative rounded-[30px] overflow-hidden shadow-2xl group cursor-pointer"
                            >
                                <img 
                                    src={banner} 
                                    alt={`Banner ${idx + 1}`} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-32 bg-white relative overflow-hidden">
                <div className="max-w-[1500px] mx-auto px-8 relative z-10">
                    <div className="text-center mb-24">
                        <motion.span 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-primary font-black uppercase tracking-[0.5em] text-sm mb-4 block"
                        >
                            The Shehwar Advantage
                        </motion.span>
                        <h2 className="text-6xl md:text-8xl font-black text-dark mb-6 tracking-tighter italic uppercase">What Sets Us <span className="text-primary">Apart</span></h2>
                        <div className="w-40 h-2 bg-primary mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                        {[
                            { title: 'Fast Delivery', desc: 'Hot & fresh delivery right to your doorstep in minutes.', img: '/features/fast-delivery.png' },
                            { title: 'Light to Wallet', desc: 'Gourmet taste at prices that wont break the bank.', img: '/features/light-to-wallet.png' },
                            { title: 'Open 24 Hours', desc: 'Cravings have no schedule. We are here day and night.', img: '/features/open-24.png' },
                            { title: 'Perfect Ambience', desc: 'Premium dining or cozy delivery - we master both.', img: '/features/ambience.png' }
                        ].map((feature, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group"
                            >
                                <div className="bg-[#fcfcfc] rounded-[50px] overflow-hidden shadow-xl border border-gray-100 transition-all duration-500 group-hover:-translate-y-4 group-hover:shadow-2xl">
                                    <div className="relative h-64 overflow-hidden">
                                        <img 
                                            src={feature.img} 
                                            alt={feature.title} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-40"></div>
                                    </div>
                                    <div className="p-8 text-center">
                                        <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-4 text-dark group-hover:text-primary transition-colors">{feature.title}</h3>
                                        <p className="text-gray-500 font-bold leading-relaxed">{feature.desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

