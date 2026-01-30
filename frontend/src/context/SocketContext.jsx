import React, { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import useAuth from '../hooks/useAuth';

const SocketContext = createContext();

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
    const { token, isAuthenticated } = useAuth();
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (isAuthenticated && token) {
            const newSocket = io(SOCKET_URL, {
                auth: { token },
                transports: ['websocket'],
            });

            newSocket.on('connect', () => {
                console.log('Socket connected');
                setIsConnected(true);
            });

            newSocket.on('disconnect', () => {
                console.log('Socket disconnected');
                setIsConnected(false);
            });

            setSocket(newSocket);

            return () => {
                newSocket.close();
            };
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
                setIsConnected(false);
            }
        }
    }, [isAuthenticated, token]);

    const emit = React.useCallback((eventName, data) => {
        if (socket) socket.emit(eventName, data);
    }, [socket]);

    const on = React.useCallback((eventName, callback) => {
        if (socket) socket.on(eventName, callback);
    }, [socket]);

    const off = React.useCallback((eventName) => {
        if (socket) socket.off(eventName);
    }, [socket]);

    return (
        <SocketContext.Provider value={{ socket, isConnected, emit, on, off }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};
