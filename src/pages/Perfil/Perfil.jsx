// src/pages/Perfil/Perfil.jsx
import { useState, useEffect } from 'react';
import styles from './Perfil.module.css';
import { auth } from '../../firebase/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { FaUserCircle } from 'react-icons/fa';

function Perfil() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser({
                    displayName: currentUser.displayName,
                    email: currentUser.email
                });
            }
        });
        return () => unsubscribe();
    }, []);

    if (!user) {
        return <div className={styles.loading}>Carregando perfil...</div>;
    }

    return (
        <div className={`container ${styles.profileContainer}`}>
            <h1 className={styles.sectionTitle}>Meu Perfil</h1>
            <div className={styles.profileCard}>
                <FaUserCircle size={100} className={styles.avatarIcon} />
                <h2 className={styles.userName}>{user.displayName}</h2>
                <p className={styles.userEmail}>{user.email}</p>
            </div>
        </div>
    );
}

export default Perfil;