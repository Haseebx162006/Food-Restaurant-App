import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import menuService from "@/services/menuService";
import MenuCard from "@/components/customer/MenuCard";

const slides = [
    { image: "/hero/hero1.png" },
    { image: "/hero/hero2.png" },
    { image: "/hero/hero3.png" }
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
        const timer = setInterval(nextHeroSlide, 5000);
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
        <div className="bg-white">
            <section className="hero-slider">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`slide ${index === currentSlide ? 'active' : ''}`}
                    >
                        <Image 
                            src={slide.image} 
                            alt="Hero" 
                            fill
                            priority={index === 0}
                            className="slide-image"
                        />
                    </div>
                ))}

                <button className="slider-btn prev" onClick={prevHeroSlide}>
                    <ChevronLeft size={32} />
                </button>
                <button className="slider-btn next" onClick={nextHeroSlide}>
                    <ChevronRight size={32} />
                </button>

                <div className="slider-dots">
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            className={`dot ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(index)}
                        ></div>
                    ))}
                </div>
            </section>

            <section className="menu-carousel-section">
                <div className="carousel-header">
                    <h2 className="section-title">Explore Menu</h2>
                    <Link href="/menu" className="view-all">View All</Link>
                </div>

                <div className="carousel-container">
                    <button 
                        className="nav-btn prev" 
                        onClick={prevMenu}
                        disabled={currentIndex === 0}
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <div className="carousel-track-container">
                        <div 
                            className="carousel-track"
                            style={{ 
                                transform: `translateX(-${currentIndex * (100 / 5)}%)`,
                                width: `${Math.max(100, (menuItems.length / 5) * 100)}%`
                            }}
                        >
                            {menuItems.map((item) => (
                                <Link 
                                    href={`/menu/${item._id}`} 
                                    className="minimal-card-link" 
                                    key={item._id}
                                >
                                    <div className="minimal-card">
                                        <div className="minimal-image-box">
                                            <img 
                                                src={item.image ? (item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`) : '/images/food-placeholder.jpg'} 
                                                alt={item.name} 
                                                className="minimal-image"
                                            />
                                        </div>
                                        <h3 className="minimal-name">{item.name}</h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <button 
                        className="nav-btn next" 
                        onClick={nextMenu}
                        disabled={currentIndex >= Math.max(0, menuItems.length - 5)}
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </section>

            <section className="best-sellers-section">
                <div className="best-sellers-container">
                    <div className="best-sellers-header">
                        <h2 className="best-sellers-title">Best Sellers</h2>
                    </div>

                    <div className="best-sellers-grid">
                        {menuItems.slice(0, 4).map((item) => (
                            <Link 
                                href={`/menu/${item._id}`} 
                                className="best-seller-card-link" 
                                key={item._id}
                                style={{ textDecoration: 'none' }}
                            >
                                <div className="best-seller-card">
                                    <div className="kfc-stripes">
                                        <div className="stripe"></div>
                                        <div className="stripe"></div>
                                        <div className="stripe"></div>
                                    </div>
                                    <h3 className="item-name">{item.name}</h3>
                                    <div className="price-badge">
                                        <span>Rs</span>{item.price}
                                    </div>
                                    <div className="item-image-box">
                                        <img 
                                            src={item.image ? (item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`) : '/images/food-placeholder.jpg'} 
                                            alt={item.name} 
                                            className="item-image"
                                        />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="top-deals-section">
                <div className="top-deals-container">
                    <div className="top-deals-header">
                        <h2 className="top-deals-title">Top Deals</h2>
                    </div>

                    <div className="top-deals-grid">
                        {menuItems.slice(4, 8).map((item) => (
                            <Link 
                                href={`/menu/${item._id}`} 
                                key={item._id}
                                style={{ textDecoration: 'none' }}
                            >
                                <MenuCard item={item} />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-heading font-black text-dark mb-4">Our Featured Categories</h2>
                        <div className="w-24 h-2 bg-primary mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { name: 'Fast Food', color: 'bg-red-50 text-red-500 hover:bg-red-500' },
                            { name: 'Main Course', color: 'bg-blue-50 text-blue-500 hover:bg-blue-500' },
                            { name: 'Desserts', color: 'bg-yellow-50 text-yellow-500 hover:bg-yellow-500' },
                            { name: 'Drinks', color: 'bg-red-50 text-red-500 hover:bg-red-500' }
                         ].map((cat, idx) => (
                            <Link href={`/menu?category=${cat.name}`} key={idx} className="group">
                                <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 flex flex-col items-center transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-2xl group-hover:bg-dark group-hover:border-transparent">
                                    <div className={`${cat.color.split(' ')[0]} ${cat.color.split(' ')[1]} p-6 rounded-3xl mb-6 group-hover:bg-white transition-all duration-300`}>
                                        <ShoppingBag size={40} />
                                    </div>
                                    <h3 className="text-xl font-bold text-dark group-hover:text-white transition-colors">{cat.name}</h3>
                                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors mt-2 font-medium italic">Explore More</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
