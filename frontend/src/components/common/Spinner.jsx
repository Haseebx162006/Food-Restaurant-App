import React from 'react';
import { twMerge } from 'tailwind-merge';

const Spinner = ({ size = 'medium', color = 'primary', className }) => {
    const sizes = {
        small: 'h-4 w-4 border-2',
        medium: 'h-8 w-8 border-3',
        large: 'h-12 w-12 border-4',
    };

    const colors = {
        primary: 'border-primary',
        secondary: 'border-secondary',
        white: 'border-white',
    };

    return (
        <div className={twMerge("flex justify-center items-center", className)}>
            <div
                className={twMerge(
                    "animate-spin rounded-full border-t-transparent",
                    sizes[size],
                    colors[color]
                )}
            ></div>
        </div>
    );
};

export default Spinner;
