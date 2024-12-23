import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import Pusher from 'pusher-js';
import { axios } from '../api/axios';
import { useContext } from 'react';

// Create the context
export const NotificationContext = createContext();

// Context provider
export const NotificationProvider = ({ role, children }) => {
    const [notifications, setNotifications] = useState([]);
    const [admin_id, setAdminId] = useState(null); // Manage admin_id state

    const fetchUser = async () => {
        try {
            const response = await axios.get('/user');
            setAdminId(response.data.id);
        }
        catch (error) {
            console.error(error)
        }
        //    setLoading(false)
    };
    useEffect(() => {
        const initAuth = async () => {
            if (localStorage.getItem('token')) {
                await fetchUser();
            }
        };
        initAuth();
    }, []);
    useEffect(() => {
        // Initialize Pusher
        if (admin_id) {
            const pusher = new Pusher('46ad969e35fb64ef4e0c', {
                cluster: 'ap1',
            });

            // Subscribe to the correct channel based on role
            const channel = pusher.subscribe(`admin.${admin_id}`);
            // Listen for the 'booking-confirmed' event
            channel.bind('booking-created', (data) => {
                console.log(data.booking);
                setNotifications((prev) => [...prev, { ...data.booking, read: false, created_at: new Date() },]);
            });

            pusher.connection.bind('disconnected', () => {
                console.log('Disconnected from Pusher. Reconnecting...');
                pusher.connect();  // Reconnect manually if needed
            });

            pusher.connection.bind('state_change', (states) => {
                console.log('Pusher connection state:', states);
            });
            // Cleanup
            return () => {
                if (channel) {
                    channel.unbind_all(); // Removes all event listeners
                    channel.unsubscribe(); // Unsubscribes from the channel
                }
                if (pusher) {
                    pusher.disconnect(); // Disconnects the WebSocket connection
                }
            };
        }
    }, [admin_id]);
    const markAsRead = (id) => {
        setNotifications((prev) =>
            prev.map((notification) =>
                notification.booking_id === id ? { ...notification, read: true } : notification
            )
        );
    };

    return (
        <NotificationContext.Provider value={{ notifications,setNotifications, markAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};
export const useNotify = () => useContext(NotificationContext);
