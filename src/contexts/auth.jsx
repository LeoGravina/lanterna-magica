// src/contexts/auth.jsx
import { useState, createContext, useEffect } from 'react';
import { auth } from '../firebase/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';

export const AuthContext = createContext({});

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoadingAuth(false);
        });

        return () => {
            unsubscribe();
        }
    }, []);

    // A função que o Perfil.jsx vai chamar para atualizar o Header
    function updateUserContext(newUserData) {
        setUser(prevUser => ({...prevUser, ...newUserData}));
    }

    return (
        <AuthContext.Provider 
            value={{ 
                signed: !!user, 
                user,
                loadingAuth,
                updateUserContext // Disponibiliza a função de atualização
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;