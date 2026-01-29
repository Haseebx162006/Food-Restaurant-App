import React, { useState } from 'react';
import useAuth from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { toast } from 'react-toastify';
import { User, Mail, Phone, MapPin } from 'lucide-react';

export default function Profile() {
    const { user, updateProfile } = useAuth();
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
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                    <div className="bg-primary px-8 py-12">
                        <div className="flex items-center space-x-6">
                            <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center text-primary text-4xl font-bold shadow-lg">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-3xl font-heading font-bold text-white">{user?.name}</h1>
                                <p className="text-red-100 flex items-center mt-1">
                                    <span className="capitalize px-2 py-0.5 bg-red-600/30 rounded text-xs font-medium mr-2">
                                        {user?.role}
                                    </span>
                                    Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-heading font-bold text-dark">Personal Information</h2>
                            <Button
                                variant={isEditing ? 'ghost' : 'outline'}
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                {isEditing ? 'Cancel' : 'Edit Profile'}
                            </Button>
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Full Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                                <Input
                                    label="Email Address"
                                    value={formData.email}
                                    disabled
                                />
                                <Input
                                    label="Phone Number"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                                <Input
                                    label="Delivery Address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                                <div className="md:col-span-2 pt-4">
                                    <Button type="submit" isLoading={isLoading} className="w-full md:w-auto">
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
                                    <Mail className="text-primary mt-1" size={20} />
                                    <div>
                                        <p className="text-xs text-secondary font-bold uppercase tracking-wider mb-1">Email</p>
                                        <p className="text-dark font-medium">{user?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
                                    <Phone className="text-primary mt-1" size={20} />
                                    <div>
                                        <p className="text-xs text-secondary font-bold uppercase tracking-wider mb-1">Phone</p>
                                        <p className="text-dark font-medium">{user?.phone || 'Not provided'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 border border-gray-100 md:col-span-2">
                                    <MapPin className="text-primary mt-1" size={20} />
                                    <div>
                                        <p className="text-xs text-secondary font-bold uppercase tracking-wider mb-1">Delivery Address</p>
                                        <p className="text-dark font-medium">{user?.address || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
