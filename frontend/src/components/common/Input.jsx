import React from 'react';
import { twMerge } from 'tailwind-merge';

const Input = ({
    label,
    error,
    className,
    id,
    ...props
}) => {
    return (
        <div className="w-full mb-4">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-dark mb-1 ml-1">
                    {label}
                </label>
            )}
            <input
                id={id}
                className={twMerge(
                    "input-field",
                    error ? "border-error focus:ring-error" : "border-gray-300 focus:ring-primary",
                    className
                )}
                {...props}
            />
            {error && (
                <p className="mt-1 text-xs text-error ml-1 font-medium">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
