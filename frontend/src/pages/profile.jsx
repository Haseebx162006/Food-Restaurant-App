import React, { useState } from 'react';
import useAuth from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { toast } from 'react-toastify';
import { User, Mail, Phone, MapPin, LogOut, LayoutDashboard, ShieldCheck, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Profile() {
    const { user, updateProfile, logout } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const result = await updateProfile(formData);
        setIsLoading(false);

        if (result.success) {
            toast.success('Profile updated successfully');
            setIsEditing(false);
        } else {
            toast.error(result.message);
        }
    };

    return (
        <ProtectedRoute>
            <div className="bg-[#fafafa] min-h-screen pt-40 pb-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white shadow-[0_40px_100px_rgba(0,0,0,0.05)] rounded-[40px] overflow-hidden border border-gray-100"
                    >
                        {/* PREMIUM HEADER */}
                        <div className="bg-dark px-12 py-16 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                                <div className="h-32 w-32 bg-primary rounded-[35px] flex items-center justify-center text-white text-5xl font-black italic shadow-2xl rotate-3">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="text-center md:text-left">
                                    <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                                        <h1 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter">
                                            {user?.name}
                                        </h1>
                                        {user?.role === 'admin' && (
                                            <ShieldCheck className="text-primary" size={28} />
                                        )}
                                    </div>
                                    <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]">
                                        {user?.role} Member • Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                                
                                <div className="md:ml-auto flex flex-col gap-4 w-full md:w-auto">
                                    {user?.role === 'admin' && (
                                        <Link 
                                            href="/admin/dashboard"
                                            className="flex items-center justify-center gap-3 bg-white text-dark px-8 py-4 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95"
                                        >
                                            <LayoutDashboard size={16} />
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <button 
                                        onClick={logout}
                                        className="flex items-center justify-center gap-3 bg-primary text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-primary transition-all shadow-xl shadow-primary/20 active:scale-95"
                                    >
                                        <LogOut size={16} />
                                        Logout Session
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-12">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 border-b border-gray-50 pb-8">
                                <div>
                                    <h2 className="text-3xl font-black text-dark italic uppercase tracking-tighter">Personal Details</h2>
                                    <p className="text-gray-400 text-sm font-medium mt-1">Manage your account information and preferences.</p>
                                </div>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${
                                        isEditing 
                                        ? 'bg-gray-100 text-dark hover:bg-dark hover:text-white' 
                                        : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                                    }`}
                                >
                                    {isEditing ? 'Discard Changes' : <><Edit3 size={16} /> Edit Profile</>}
                                </button>
                            </div>

                            {isEditing ? (
                                <motion.form 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onSubmit={handleSubmit} 
                                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                                >
                                    <Input
                                        label="Full Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="bg-gray-50/50 border-none rounded-2xl p-5"
                                    />
                                    <Input
                                        label="Email Address (Locked)"
                                        value={formData.email}
                                        disabled
                                        className="bg-gray-100 border-none rounded-2xl p-5 cursor-not-allowed opacity-60"
                                    />
                                    <Input
                                        label="Phone Number"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="bg-gray-50/50 border-none rounded-2xl p-5"
                                    />
                                    <Input
                                        label="Delivery Address"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="bg-gray-50/50 border-none rounded-2xl p-5"
                                    />
                                    <div className="md:col-span-2 pt-6">
                                        <button 
                                            type="submit" 
                                            disabled={isLoading}
                                            className="w-full bg-dark text-white py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-xs hover:bg-primary transition-all shadow-2xl shadow-dark/10 active:scale-[0.98] disabled:opacity-50"
                                        >
                                            {isLoading ? 'Updating Account...' : 'Save Updated Profile'}
                                        </button>
                                    </div>
                                </motion.form>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="flex items-start gap-6 p-8 rounded-[30px] bg-gray-50/50 border border-gray-100 group hover:border-primary/20 transition-all">
                                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                            <Mail size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Email Address</p>
                                            <p className="text-lg font-bold text-dark">{user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-6 p-8 rounded-[30px] bg-gray-50/50 border border-gray-100 group hover:border-primary/20 transition-all">
                                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                            <Phone size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Phone Number</p>
                                            <p className="text-lg font-bold text-dark">{user?.phone || 'Not provided'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-6 p-8 rounded-[30px] bg-gray-50/50 border border-gray-100 md:col-span-2 group hover:border-primary/20 transition-all">
                                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                            <MapPin size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Default Delivery Address</p>
                                            <p className="text-lg font-bold text-dark leading-relaxed">{user?.address || 'Please set a delivery address to checkout faster.'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

