import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
    {
        image: "/hero/hero1.png",
    },
    {
        image: "/hero/hero2.png",
    },
    {
        image: "/hero/hero3.png",
    }
];

export default function Home() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, []);

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [nextSlide]);

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

                <button className="slider-btn prev" onClick={prevSlide}>
                    <ChevronLeft size={32} />
                </button>
                <button className="slider-btn next" onClick={nextSlide}>
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

            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-heading font-black text-dark mb-4">Our Featured Categories</h2>
                        <div className="w-24 h-2 bg-primary mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {['Fast Food', 'Main Course', 'Desserts', 'Drinks'].map((cat, idx) => (
                            <Link href={`/menu?category=${cat}`} key={idx} className="group">
                                <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 flex flex-col items-center group-hover:bg-primary transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-2xl">
                                    <div className="bg-red-50 text-primary p-6 rounded-3xl mb-6 group-hover:bg-white transition-colors">
                                        <ShoppingBag size={40} />
                                    </div>
                                    <h3 className="text-xl font-bold text-dark group-hover:text-white transition-colors">{cat}</h3>
                                    <p className="text-sm text-gray-400 group-hover:text-red-100 transition-colors mt-2 font-medium italic">Explore More</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
