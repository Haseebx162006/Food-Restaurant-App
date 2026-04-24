import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ChevronLeft, ChevronRight, ArrowRight, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import menuService from "@/services/menuService";
import MenuCard from "@/components/customer/MenuCard";

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
    const [currentSlide, setCurrentSlide] = useState(0);
    const [menuItems, setMenuItems] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

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
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
                        
                        <div className="absolute inset-0 flex items-center px-12 md:px-24">
                            <div className="max-w-2xl">
                                <motion.h1 
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.8 }}
                                    className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight"
                                >
                                    {slides[currentSlide].title}
                                </motion.h1>
                                <motion.p 
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5, duration: 0.8 }}
                                    className="text-xl md:text-2xl text-white/80 mb-10 font-medium"
                                >
                                    {slides[currentSlide].subtitle}
                                </motion.p>
                                <motion.div
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.7, duration: 0.8 }}
                                >
                                    <Link href="/menu" className="btn-primary inline-flex items-center gap-2 group">
                                        {slides[currentSlide].cta}
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className="absolute bottom-10 right-10 flex gap-4 z-10">
                    <button onClick={prevHeroSlide} className="w-14 h-14 rounded-full glass-dark flex items-center justify-center text-white hover:bg-primary transition-colors">
                        <ChevronLeft size={28} />
                    </button>
                    <button onClick={nextHeroSlide} className="w-14 h-14 rounded-full glass-dark flex items-center justify-center text-white hover:bg-primary transition-colors">
                        <ChevronRight size={28} />
                    </button>
                </div>

                <div className="absolute bottom-10 left-12 flex gap-3 z-10">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-2 rounded-full transition-all duration-500 ${index === currentSlide ? 'w-12 bg-primary' : 'w-3 bg-white/50'}`}
                        />
                    ))}
                </div>
            </section>

            <section className="section-container">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex justify-between items-end mb-12"
                >
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black text-dark mb-2">Explore Menu</h2>
                        <div className="w-20 h-1.5 bg-primary rounded-full"></div>
                    </div>
                    <Link href="/menu" className="group flex items-center gap-2 text-primary font-bold uppercase tracking-wider">
                        View All Menu <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

                <div className="relative group/carousel">
                    <div className="overflow-hidden">
                        <motion.div 
                            className="flex gap-6"
                            animate={{ x: `-${currentIndex * (100 / 5)}%` }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            style={{ width: `${Math.max(100, (menuItems.length / 5) * 100)}%` }}
                        >
                            {menuItems.map((item, idx) => (
                                <Link 
                                    href={`/menu/${item._id}`} 
                                    className="flex-shrink-0 w-[calc(20%-19.2px)]" 
                                    key={item._id}
                                >
                                    <motion.div 
                                        whileHover={{ y: -10 }}
                                        className={`p-8 rounded-[40px] text-center transition-all duration-500 ${
                                            idx % 3 === 0 ? 'bg-red-50' : idx % 3 === 1 ? 'bg-blue-50' : 'bg-yellow-50'
                                        }`}
                                    >
                                        <div className="relative w-full aspect-square mb-6">
                                            <img 
                                                src={item.image ? (item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`) : '/images/food-placeholder.jpg'} 
                                                alt={item.name} 
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <h3 className="text-xl font-black text-dark mb-2 truncate">{item.name}</h3>
                                        <div className={`mx-auto w-10 h-1.5 rounded-full ${
                                            idx % 3 === 0 ? 'bg-primary' : idx % 3 === 1 ? 'bg-secondary' : 'bg-accent'
                                        }`}></div>
                                    </motion.div>
                                </Link>
                            ))}
                        </motion.div>
                    </div>

                    <button 
                        onClick={prevMenu}
                        disabled={currentIndex === 0}
                        className="absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-primary disabled:opacity-0 transition-all z-10"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button 
                        onClick={nextMenu}
                        disabled={currentIndex >= Math.max(0, menuItems.length - 5)}
                        className="absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-primary disabled:opacity-0 transition-all z-10"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </section>

            <section className="bg-dark py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

                <div className="max-w-[1500px] mx-auto px-8">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <h2 className="text-5xl font-black text-white mb-2 uppercase italic tracking-tighter">Best Sellers</h2>
                        <div className="flex gap-1">
                            {[1,2,3].map(i => <div key={i} className="w-8 h-2 bg-primary"></div>)}
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {menuItems.slice(0, 4).map((item, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                key={item._id}
                            >
                                <Link href={`/menu/${item._id}`} className="block group">
                                    <div className="bg-white/5 border border-white/10 p-8 rounded-[30px] hover:bg-white/10 transition-all duration-500 relative overflow-hidden group-hover:-translate-y-4">
                                        <div className="absolute top-6 right-6 glass-dark px-4 py-2 rounded-full flex items-center gap-1 text-accent">
                                            <Star size={16} fill="currentColor" />
                                            <span className="font-bold text-sm">4.9</span>
                                        </div>
                                        <div className="w-full aspect-square mb-8 p-4">
                                            <img 
                                                src={item.image ? (item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`) : '/images/food-placeholder.jpg'} 
                                                alt={item.name} 
                                                className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(255,49,49,0.3)] group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <h3 className="text-2xl font-black text-white mb-4 line-clamp-1">{item.name}</h3>
                                        <div className="flex justify-between items-center">
                                            <span className="text-3xl font-black text-primary">Rs {item.price}</span>
                                            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-dark group-hover:bg-primary group-hover:text-white transition-colors">
                                                <ShoppingBag size={24} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section-container">
                <div className="text-center mb-20">
                    <h2 className="text-5xl md:text-7xl font-black text-dark mb-6 tracking-tighter">OUR TOP DEALS</h2>
                    <div className="w-32 h-2 bg-primary mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {menuItems.slice(4, 8).map((item, idx) => (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            key={item._id}
                        >
                            <MenuCard item={item} />
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className="py-32 bg-primary relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-10 left-10 text-white text-9xl font-black rotate-12 select-none">FAST</div>
                    <div className="absolute bottom-20 right-20 text-white text-9xl font-black -rotate-12 select-none">FRESH</div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[20rem] font-black opacity-20 select-none">FOOD</div>
                </div>

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">FEATURED CATEGORIES</h2>
                        <p className="text-white/80 text-xl font-medium max-w-2xl mx-auto">Discover our wide variety of dishes, from mouth-watering burgers to healthy alternatives.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { name: 'Fast Food', icon: ShoppingBag, color: 'text-primary' },
                            { name: 'Main Course', icon: ShoppingBag, color: 'text-secondary' },
                            { name: 'Desserts', icon: ShoppingBag, color: 'text-accent' },
                            { name: 'Drinks', icon: ShoppingBag, color: 'text-primary' }
                         ].map((cat, idx) => (
                            <Link href={`/menu?category=${cat.name}`} key={idx} className="group">
                                <div className="bg-white p-12 rounded-[50px] shadow-2xl flex flex-col items-center transition-all duration-500 group-hover:-translate-y-4 group-hover:scale-105">
                                    <div className={`p-8 rounded-3xl mb-8 bg-gray-50 ${cat.color} group-hover:bg-primary group-hover:text-white transition-all duration-300`}>
                                        <cat.icon size={48} />
                                    </div>
                                    <h3 className="text-2xl font-black text-dark group-hover:text-primary transition-colors">{cat.name}</h3>
                                    <p className="text-sm text-gray-400 mt-4 font-bold uppercase tracking-widest flex items-center gap-2 group-hover:text-dark">
                                        View items <ArrowRight size={14} />
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
}

