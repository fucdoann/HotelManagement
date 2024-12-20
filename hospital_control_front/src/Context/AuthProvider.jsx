import { useState, useEffect, createContext, useContext } from 'react';
import { axios } from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (data) => {
        try {
            const response = await axios.post('/login', data);
            setUser(response.data.user);
            localStorage.setItem('token', response.data.access_token);
            return response;
        }
        catch(error){
            console.error(error);
        }
   };

    const logout = async () => {
        try {
            const response = await axios.post('/logout', null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setUser(null);
            localStorage.removeItem('token');
            return response;
        } catch (error) {
            console.error("Logout failed:", error);
            alert("Logout failed. Please try again."); // Optional, for user feedback
        }
    };

    const fetchUser = async () => {
        try {
            const response = await axios.get('/user');
            setUser(response.data);
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
            setLoading(false); // Ensure this always runs
        };

        initAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => useContext(AuthContext)


