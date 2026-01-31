import Link from "next/link";
import Image from "next/image";
import Button from "@/components/common/Button";
import { ShoppingBag, Star, Clock, Heart } from "lucide-react";

export default function Home() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center overflow-hidden">
                {/* Background Design */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 rounded-l-[100px] -z-10 hidden lg:block"></div>
                <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse"></div>

                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8 text-center lg:text-left">
                        <div className="inline-flex items-center space-x-2 bg-red-100 text-primary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest animate-bounce">
                            <Star size={16} fill="currentColor" />
                            <span>Best Food In Town</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-heading font-black text-dark leading-tight">
                            Delicious Food, <br />
                            Delivered To <br />
                            <span className="text-primary">Your Door</span>.
                        </h1>

                        <p className="text-gray-500 text-lg max-w-lg mx-auto lg:mx-0">
                            Satisfy your cravings with our wide range of menu items.
                            Fresh ingredients, fast delivery, and unbeatable taste.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                            <Link href="/menu">
                                <Button className="h-14 px-10 text-lg shadow-xl shadow-red-200">
                                    <ShoppingBag className="mr-2" size={20} />
                                    Order Now
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button variant="outline" className="h-14 px-10 text-lg">
                                    Join Us
                                </Button>
                            </Link>
                        </div>

                        <div className="flex items-center justify-center lg:justify-start space-x-8 pt-4">
                            <div className="text-center lg:text-left">
                                <p className="text-2xl font-black text-dark">50+</p>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Dishes</p>
                            </div>
                            <div className="h-10 w-px bg-gray-200"></div>
                            <div className="text-center lg:text-left">
                                <p className="text-2xl font-black text-dark">1k+</p>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Customers</p>
                            </div>
                            <div className="h-10 w-px bg-gray-200"></div>
                            <div className="text-center lg:text-left">
                                <p className="text-2xl font-black text-dark">20m</p>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Avg. Time</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
                        <Image
                            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800"
                            alt="Delicious Food"
                            width={800}
                            height={600}
                            className="relative rounded-[40px] shadow-2xl z-10 animate-float"
                            priority
                        />
                        {/* Info Blocks Below Image */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <div className="bg-white p-4 rounded-3xl shadow-lg border border-gray-100/50 flex items-center space-x-4 flex-1 w-full sm:w-auto animate-slide-right">
                                <div className="bg-success/20 p-2.5 rounded-2xl text-success">
                                    <Heart size={20} fill="currentColor" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-dark">Healthy Choices</p>
                                    <p className="text-xs text-gray-400 font-medium whitespace-nowrap">100% Organic Ingredients</p>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-3xl shadow-lg border border-gray-100/50 flex items-center space-x-4 flex-1 w-full sm:w-auto animate-slide-left">
                                <div className="bg-red-50 p-2.5 rounded-2xl text-primary">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-dark">Fast Delivery</p>
                                    <p className="text-xs text-gray-400 font-medium whitespace-nowrap">Delivered Under 30 mins</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Categories */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-heading font-black text-dark mb-4">Our Featured Categories</h2>
                        <div className="w-20 h-1.5 bg-primary mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {['Fast Food', 'Main Course', 'Desserts', 'Drinks'].map((cat, idx) => (
                            <Link href={`/menu?category=${cat}`} key={idx} className="group">
                                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center group-hover:bg-primary transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
                                    <div className="bg-red-50 text-primary p-5 rounded-2xl mb-6 group-hover:bg-white transition-colors">
                                        <ShoppingBag size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-dark group-hover:text-white transition-colors">{cat}</h3>
                                    <p className="text-xs text-gray-400 group-hover:text-red-100 transition-colors mt-1 font-medium italic">Explore More</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes slide-right {
          0% { opacity: 0; transform: translateX(-50px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-left {
          0% { opacity: 0; transform: translateX(50px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-slide-right {
          animation: slide-right 1s ease-out forwards;
          animation-delay: 0.5s;
          opacity: 0;
        }
        .animate-slide-left {
          animation: slide-left 1s ease-out forwards;
          animation-delay: 0.8s;
          opacity: 0;
        }
      `}</style>
        </div>
    );
}
