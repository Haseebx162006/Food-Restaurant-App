import React, { useState, useEffect } from 'react';
import adminService from '@/services/adminService';
import menuService from '@/services/menuService';
import ProtectedRoute from '@/components/ProtectedRoute';
import Spinner from '@/components/common/Spinner';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2, Image as ImageIcon, Check, X } from 'lucide-react';

export default function AdminMenu() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Fast Food',
        availability: true,
        image: '',
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
                image: item.image || '',
                preparationTime: item.preparationTime || ''
            });
        } else {
            setEditingItem(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                category: 'Fast Food',
                availability: true,
                image: '',
                preparationTime: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = { ...formData, price: Number(formData.price), preparationTime: Number(formData.preparationTime) };
            let response;
            if (editingItem) {
                response = await adminService.updateMenuItem(editingItem._id, data);
            } else {
                response = await adminService.createMenuItem(data);
            }

            if (response.success) {
                toast.success(`Item ${editingItem ? 'updated' : 'created'} successfully`);
                setIsModalOpen(false);
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
                                                <img src={item.image || '/images/food-placeholder.jpg'} alt="" className="h-10 w-10 rounded-lg object-cover mr-3" />
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
                    </div>
                </div>
            </div>

            {/* Modal - Simplified */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-dark/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-2xl font-heading font-bold text-dark">{editingItem ? 'Edit Menu Item' : 'New Menu Item'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-dark">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <Input label="Item Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                <Input label="Price (Rs.)" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-dark mb-1 ml-1">Description</label>
                                    <textarea
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary outline-none text-sm"
                                        rows="3"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                                <Input label="Prep Time (mins)" type="number" value={formData.preparationTime} onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })} />
                                <Input label="Image URL" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
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
