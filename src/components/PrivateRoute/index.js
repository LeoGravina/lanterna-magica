import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { auth } from '../../firebase/firebase.js'; 
import { onAuthStateChanged } from 'firebase/auth';

export function PrivateRoute() {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
            setLoading(false); 
        });

        return () => unsubscribe(); 
    }, []);

    if (loading) {
        return null; 
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}