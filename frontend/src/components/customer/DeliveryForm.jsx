import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { User, Phone, MapPin, MessageSquare } from 'lucide-react';

const DeliveryForm = ({ onSubmit, isLoading, initialData }) => {
    const [formData, setFormData] = useState({
        customerName: initialData?.name || '',
        customerPhone: initialData?.phone || '',
        deliveryAddress: initialData?.address || '',
        notes: ''
    });
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!formData.customerName || formData.customerName.length < 3) {
            newErrors.customerName = 'Name must be at least 3 characters';
        }
        if (!formData.customerPhone || !/^\d{10,11}$/.test(formData.customerPhone)) {
            newErrors.customerPhone = 'Enter a valid 10-11 digit phone number';
        }
        if (!formData.deliveryAddress || formData.deliveryAddress.length < 10) {
            newErrors.deliveryAddress = 'Address must be at least 10 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    return (
        <form id="delivery-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-heading font-bold text-dark mb-6 flex items-center">
                    <MapPin className="mr-3 text-primary" size={24} />
                    Delivery Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <User className="absolute left-4 top-[38px] text-gray-400" size={18} />
                        <Input
                            id="customerName"
                            name="customerName"
                            label="Recipient Name"
                            placeholder="Full Name"
                            className="pl-11"
                            value={formData.customerName}
                            onChange={handleChange}
                            error={errors.customerName}
                        />
                    </div>
                    <div className="relative">
                        <Phone className="absolute left-4 top-[38px] text-gray-400" size={18} />
                        <Input
                            id="customerPhone"
                            name="customerPhone"
                            label="Phone Number"
                            placeholder="03XXXXXXXXX"
                            className="pl-11"
                            value={formData.customerPhone}
                            onChange={handleChange}
                            error={errors.customerPhone}
                        />
                    </div>
                </div>

                <div className="relative mt-2">
                    <MapPin className="absolute left-4 top-[38px] text-gray-400" size={18} />
                    <Input
                        id="deliveryAddress"
                        name="deliveryAddress"
                        label="Delivery Address"
                        placeholder="House #, Street, Area, City"
                        className="pl-11"
                        value={formData.deliveryAddress}
                        onChange={handleChange}
                        error={errors.deliveryAddress}
                    />
                </div>

                <div className="relative mt-2">
                    <MessageSquare className="absolute left-4 top-[38px] text-gray-400" size={18} />
                    <div className="w-full mb-4">
                        <label htmlFor="notes" className="block text-sm font-medium text-dark mb-1 ml-1">
                            Special Instructions (Optional)
                        </label>
                        <textarea
                            id="notes"
                            name="notes"
                            rows="3"
                            className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                            placeholder="E.g., No onions, call upon arrival, etc."
                            value={formData.notes}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default DeliveryForm;
