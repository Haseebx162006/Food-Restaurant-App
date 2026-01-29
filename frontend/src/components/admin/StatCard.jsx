import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, color = 'primary' }) => {
    const colorStyles = {
        primary: 'bg-red-50 text-primary',
        secondary: 'bg-gray-100 text-secondary',
        success: 'bg-green-50 text-success',
        error: 'bg-red-50 text-error',
    };

    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${colorStyles[color]}`}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <div className={`flex items-center text-xs font-bold ${trend > 0 ? 'text-success' : 'text-error'}`}>
                        {trend > 0 ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
            <p className="text-2xl font-bold text-dark">{value}</p>
        </div>
    );
};

export default StatCard;
