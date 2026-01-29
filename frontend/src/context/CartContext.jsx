import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [totals, setTotals] = useState({
        totalItems: 0,
        subtotal: 0,
        taxAmount: 0,
        deliveryAmount: 50,
        grandTotal: 0
    });

    useEffect(() => {
        // Load cart from localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, []);

    useEffect(() => {
        // Save cart to localStorage and calculate totals
        localStorage.setItem('cart', JSON.stringify(cartItems));
        calculateTotals();
    }, [cartItems]);

    const calculateTotals = () => {
        const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
        const taxAmount = Math.round(subtotal * 0.05); // 5% tax
        const deliveryAmount = subtotal > 0 ? 50 : 0;
        const grandTotal = subtotal + taxAmount + deliveryAmount;

        setTotals({
            totalItems,
            subtotal,
            taxAmount,
            deliveryAmount,
            grandTotal
        });
    };

    const addToCart = (item, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(i => i._id === item._id);
            if (existingItem) {
                return prevItems.map(i =>
                    i._id === item._id ? { ...i, quantity: i.quantity + quantity } : i
                );
            }
            return [...prevItems, { ...item, quantity }];
        });
    };

    const removeFromCart = (itemId) => {
        setCartItems(prevItems => prevItems.filter(item => item._id !== itemId));
    };

    const updateQuantity = (itemId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(itemId);
            return;
        }
        setCartItems(prevItems =>
            prevItems.map(item =>
                item._id === itemId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                ...totals,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
