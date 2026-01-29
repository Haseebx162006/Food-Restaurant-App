import React from 'react';
import { CheckCircle2, Circle, Clock, ChefHat, Package, Truck, XCircle } from 'lucide-react';

const statuses = [
    { id: 'Pending', label: 'Pending', icon: Clock },
    { id: 'Preparing', label: 'Preparing', icon: ChefHat },
    { id: 'Ready', label: 'Ready', icon: Package },
    { id: 'Delivered', label: 'Delivered', icon: Truck },
];

const OrderStatusTimeline = ({ currentStatus }) => {
    const currentIndex = statuses.findIndex(s => s.id === currentStatus);
    const isCancelled = currentStatus === 'Cancelled';

    if (isCancelled) {
        return (
            <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex items-center text-error">
                <XCircle size={32} className="mr-4" />
                <div>
                    <h4 className="font-bold text-lg">Order Cancelled</h4>
                    <p className="text-sm opacity-80">This order has been cancelled and will not be processed.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8 px-4">
            <div className="relative flex justify-between items-center">
                {/* Connection Line */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 -z-10"></div>
                <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary transition-all duration-1000 ease-out -z-10"
                    style={{ width: `${(currentIndex / (statuses.length - 1)) * 100}%` }}
                ></div>

                {statuses.map((status, index) => {
                    const Icon = status.icon;
                    const isCompleted = index < currentIndex;
                    const isActive = index === currentIndex;
                    const isPending = index > currentIndex;

                    return (
                        <div key={status.id} className="flex flex-col items-center">
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm ${isCompleted ? 'bg-primary text-white' :
                                        isActive ? 'bg-white border-4 border-primary text-primary scale-125' :
                                            'bg-white border-2 border-gray-100 text-gray-300'
                                    }`}
                            >
                                {isCompleted ? <CheckCircle2 size={24} /> : <Icon size={24} />}
                            </div>
                            <span
                                className={`mt-4 text-xs font-bold uppercase tracking-wider ${isActive ? 'text-primary' : isCompleted ? 'text-dark' : 'text-gray-300'
                                    }`}
                            >
                                {status.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderStatusTimeline;
