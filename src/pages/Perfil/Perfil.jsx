// src/pages/Perfil/Perfil.jsx (Final e Interativo)
import { useState, useEffect } from 'react';
import styles from './Perfil.module.css';
import { auth, storage } from '../../firebase/firebase.js';
import { onAuthStateChanged, updateProfile, updatePassword } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaUserCircle, FaCamera } from 'react-icons/fa';
import { toast } from 'react-toastify';

function Perfil() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // States para edição
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState('');
    const [imageUpload, setImageUpload] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser({
                    uid: currentUser.uid,
                    displayName: currentUser.displayName,
                    email: currentUser.email,
                    photoURL: currentUser.photoURL
                });
                setNewName(currentUser.displayName || '');
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleImageUpload = async () => {
        if (!imageUpload) return;
        setUploading(true);
        const imageRef = ref(storage, `profilePictures/${user.uid}`);
        try {
            await uploadBytes(imageRef, imageUpload);
            const url = await getDownloadURL(imageRef);
            await updateProfile(auth.currentUser, { photoURL: url });
            setUser(prev => ({ ...prev, photoURL: url }));
            toast.success("Foto de perfil atualizada!");
        } catch (error) {
            toast.error("Erro ao enviar a imagem.");
        }
        setUploading(false);
        setImageUpload(null);
    };

    const handleNameUpdate = async (e) => {
        e.preventDefault();
        if (newName.trim() === '' || newName === user.displayName) {
            setIsEditingName(false);
            return;
        }
        try {
            await updateProfile(auth.currentUser, { displayName: newName });
            setUser(prev => ({ ...prev, displayName: newName }));
            toast.success("Nome atualizado com sucesso!");
        } catch (error) {
            toast.error("Erro ao atualizar o nome.");
        }
        setIsEditingName(false);
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (newPassword === '' || newPassword !== confirmPassword) {
            toast.warn("As senhas não conferem ou estão vazias.");
            return;
        }
        try {
            await updatePassword(auth.currentUser, newPassword);
            toast.success("Senha alterada com sucesso!");
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            toast.error("Erro ao alterar a senha. Faça login novamente para continuar.");
        }
    };

    if (loading) {
        return <div className={styles.loading}>Carregando perfil...</div>;
    }

    return (
        <div className={`container ${styles.profileContainer}`}>
            <h1 className={styles.sectionTitle}>Meu Perfil</h1>
            <div className={styles.profileCard}>
                <div className={styles.avatarWrapper}>
                    {user.photoURL ? (
                        <img src={user.photoURL} alt="Foto de Perfil" className={styles.profileAvatar} />
                    ) : (
                        <FaUserCircle size={120} className={styles.avatarIcon} />
                    )}
                    <label htmlFor="file-upload" className={styles.uploadLabel}>
                        <FaCamera />
                    </label>
                    <input id="file-upload" type="file" className={styles.uploadInput} onChange={(e) => setImageUpload(e.target.files[0])} />
                </div>
                {imageUpload && (
                    <button className={styles.uploadButton} onClick={handleImageUpload} disabled={uploading}>
                        {uploading ? 'Enviando...' : 'Enviar Nova Foto'}
                    </button>
                )}

                <div className={styles.infoSection}>
                    {!isEditingName ? (
                        <div className={styles.infoDisplay}>
                            <h2>{user.displayName}</h2>
                            <button onClick={() => setIsEditingName(true)}>Alterar nome</button>
                        </div>
                    ) : (
                        <form onSubmit={handleNameUpdate} className={styles.editForm}>
                            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} />
                            <button type="submit">Salvar</button>
                            <button type="button" onClick={() => setIsEditingName(false)}>Cancelar</button>
                        </form>
                    )}
                    <p className={styles.userEmail}>{user.email}</p>
                </div>

                <div className={styles.passwordSection}>
                    <h3>Alterar Senha</h3>
                    <form onSubmit={handlePasswordUpdate}>
                        <input type="password" placeholder="Nova senha" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        <input type="password" placeholder="Confirmar nova senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        <button type="submit">Alterar Senha</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Perfil;