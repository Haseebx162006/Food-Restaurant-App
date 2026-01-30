import React, { useState, useEffect, useRef } from 'react';
import adminService from '@/services/adminService';
import menuService from '@/services/menuService';
import ProtectedRoute from '@/components/ProtectedRoute';
import Spinner from '@/components/common/Spinner';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2, Upload, Check, X, Image as ImageIcon } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AdminMenu() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Fast Food',
        availability: true,
        preparationTime: ''
    });

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        setIsLoading(true);
        try {
            const response = await menuService.fetchAllMenuItems();
            if (response.success) setItems(response.data);
        } catch (err) {
            toast.error('Failed to load menu');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name,
                description: item.description,
                price: item.price,
                category: item.category,
                availability: item.availability,
                preparationTime: item.preparationTime || ''
            });
            // Set image preview for existing item
            if (item.image) {
                const imageUrl = item.image.startsWith('http')
                    ? item.image
                    : `${API_URL}${item.image}`;
                setImagePreview(imageUrl);
            } else {
                setImagePreview('');
            }
        } else {
            setEditingItem(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                category: 'Fast Food',
                availability: true,
                preparationTime: ''
            });
            setImagePreview('');
        }
        setImageFile(null);
        setIsModalOpen(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                toast.error('Invalid file type. Only JPEG, PNG, GIF and WebP are allowed.');
                return;
            }
            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size must be less than 5MB');
                return;
            }

            setImageFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Create FormData for file upload
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('description', formData.description);
            submitData.append('price', formData.price);
            submitData.append('category', formData.category);
            submitData.append('availability', formData.availability);
            if (formData.preparationTime) {
                submitData.append('preparationTime', formData.preparationTime);
            }

            // Add image file if selected
            if (imageFile) {
                submitData.append('image', imageFile);
            }

            let response;
            if (editingItem) {
                response = await adminService.updateMenuItem(editingItem._id, submitData);
            } else {
                response = await adminService.createMenuItem(submitData);
            }

            if (response.success) {
                toast.success(`Item ${editingItem ? 'updated' : 'created'} successfully`);
                setIsModalOpen(false);
                setImageFile(null);
                setImagePreview('');
                fetchMenu();
            }
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Action failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            const response = await adminService.deleteMenuItem(id);
            if (response.success) {
                toast.success('Item deleted');
                fetchMenu();
            }
        } catch (err) {
            toast.error('Delete failed');
        }
    };

    const toggleAvailability = async (item) => {
        try {
            const response = await adminService.toggleMenuAvailability(item._id, !item.availability);
            if (response.success) {
                setItems(items.map(i => i._id === item._id ? { ...i, availability: !i.availability } : i));
                toast.success('Availability updated');
            }
        } catch (err) {
            toast.error('Toggle failed');
        }
    };

    // Helper to get full image URL
    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/images/food-placeholder.jpg';
        if (imagePath.startsWith('http')) return imagePath;
        const baseUrl = API_URL.endsWith('/api') ? API_URL.slice(0, -4) : API_URL;
        return `${baseUrl}${imagePath}`;
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="large" /></div>;

    return (
        <ProtectedRoute requiredRole="admin">
            <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h1 className="text-3xl font-heading font-bold text-dark">Menu Management</h1>
                            <p className="text-gray-400">Add, edit, or remove items from your menu.</p>
                        </div>
                        <Button onClick={() => handleOpenModal()}>
                            <Plus size={20} className="mr-2" />
                            Add New Item
                        </Button>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 bg-gray-50/50">
                                    <th className="px-6 py-4">Item</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {items.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <img
                                                    src={getImageUrl(item.image)}
                                                    alt=""
                                                    className="h-10 w-10 rounded-lg object-cover mr-3"
                                                    onError={(e) => { e.target.src = '/images/food-placeholder.jpg'; }}
                                                />
                                                <div>
                                                    <p className="text-sm font-bold text-dark">{item.name}</p>
                                                    <p className="text-xs text-gray-400 line-clamp-1">{item.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold text-secondary bg-gray-100 px-2 py-1 rounded-md">{item.category}</span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-primary">Rs. {item.price}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleAvailability(item)}
                                                className={`flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full transition-all ${item.availability ? 'bg-success text-white' : 'bg-gray-100 text-gray-400'
                                                    }`}
                                            >
                                                {item.availability ? <Check size={12} /> : <X size={12} />}
                                                <span>{item.availability ? 'In Stock' : 'Out of Stock'}</span>
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center space-x-2">
                                                <button onClick={() => handleOpenModal(item)} className="p-2 text-gray-300 hover:text-secondary hover:bg-white rounded-lg transition-all">
                                                    <Edit2 size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(item._id)} className="p-2 text-gray-300 hover:text-error hover:bg-white rounded-lg transition-all">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {items.length === 0 && (
                            <div className="py-20 text-center text-gray-400">
                                <ImageIcon size={48} className="mx-auto mb-4 opacity-20" />
                                <p>No menu items found. Add your first item!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-dark/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-2xl font-heading font-bold text-dark">{editingItem ? 'Edit Menu Item' : 'New Menu Item'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-dark">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8">
                            {/* Image Upload Section */}
                            <div className="mb-8">
                                <label className="block text-sm font-medium text-dark mb-3">Item Image</label>
                                <div className="flex items-start space-x-6">
                                    {/* Preview */}
                                    <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon size={32} className="text-gray-300" />
                                        )}
                                    </div>

                                    {/* Upload Button */}
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageChange}
                                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex items-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-gray-500 hover:text-primary"
                                        >
                                            <Upload size={20} />
                                            <span className="font-medium">Upload Image</span>
                                        </button>
                                        <p className="text-xs text-gray-400 mt-2">
                                            JPEG, PNG, GIF or WebP. Max 5MB.
                                        </p>
                                        {imageFile && (
                                            <p className="text-xs text-success mt-1 flex items-center">
                                                <Check size={14} className="mr-1" />
                                                {imageFile.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <Input
                                    label="Item Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Price (Rs.)"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-dark mb-1 ml-1">Description</label>
                                    <textarea
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary outline-none text-sm"
                                        rows="3"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-dark mb-1 ml-1">Category</label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary outline-none text-sm bg-white"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {['Fast Food', 'Main Course', 'Drinks', 'Desserts', 'Snacks'].map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <Input
                                    label="Prep Time (mins)"
                                    type="number"
                                    value={formData.preparationTime}
                                    onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                                />

                                {/* Availability Toggle */}
                                <div className="md:col-span-2">
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <div
                                            className={`relative w-12 h-6 rounded-full transition-colors ${formData.availability ? 'bg-success' : 'bg-gray-300'}`}
                                            onClick={() => setFormData({ ...formData, availability: !formData.availability })}
                                        >
                                            <div
                                                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.availability ? 'translate-x-6' : ''}`}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium text-dark">
                                            {formData.availability ? 'Available' : 'Not Available'}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4">
                                <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button type="submit">Save Changes</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </ProtectedRoute>
    );
}
