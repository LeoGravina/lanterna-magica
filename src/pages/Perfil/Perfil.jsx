// src/pages/Perfil/Perfil.jsx (Versão Final "MUITO FODA")
import { useState, useEffect } from 'react';
import styles from './Perfil.module.css';
import { auth, storage } from '../../firebase/firebase.js';
import { onAuthStateChanged, updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaUserCircle, FaCamera, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';

function Perfil() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [avatarUrl, setAvatarUrl] = useState(null);
    const [imageAvatar, setImageAvatar] = useState(null);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState('');
    const [uploading, setUploading] = useState(false);
    
    // States para visibilidade da senha
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [currentPassword, setCurrentPassword] = useState('');
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
                setAvatarUrl(currentUser.photoURL);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Função para pré-visualizar a imagem
    function handleFile(e) {
        if (e.target.files[0]) {
            const image = e.target.files[0];
            if (image.type === 'image/jpeg' || image.type === 'image/png') {
                setImageAvatar(image);
                setAvatarUrl(URL.createObjectURL(image));
            } else {
                toast.warn("Envie uma imagem do tipo PNG ou JPEG.");
                setImageAvatar(null);
            }
        }
    }

    // Função para enviar a nova foto
    const handleImageUpload = async () => {
        if (!imageAvatar) return;
        setUploading(true);
        const imageRef = ref(storage, `profilePictures/${user.uid}`);
        try {
            await uploadBytes(imageRef, imageAvatar);
            const url = await getDownloadURL(imageRef);
            await updateProfile(auth.currentUser, { photoURL: url });
            setUser(prev => ({ ...prev, photoURL: url }));
            toast.success("Foto de perfil atualizada!");
        } catch (error) {
            toast.error("Erro ao enviar a imagem.");
        }
        setUploading(false);
        setImageAvatar(null); // Limpa a seleção após o envio
    };

    // Função para atualizar o nome
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

    // Função para atualizar a senha com reautenticação
    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (currentPassword === '' || newPassword === '' || confirmPassword === '') {
            toast.warn("Por favor, preencha todos os campos de senha.");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("A nova senha e a confirmação não conferem.");
            return;
        }

        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(user.email, currentPassword);

        try {
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
            toast.success("Senha alterada com sucesso!");
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            if (error.code === 'auth/wrong-password') {
                toast.error("A senha atual está incorreta.");
            } else {
                toast.error("Erro ao alterar a senha. Tente novamente.");
            }
        }
    };


    if (loading) {
        return <div className={styles.loading}>Carregando perfil...</div>;
    }

    return (
        <div className={`container ${styles.profileContainer}`}>
            <h1 className={styles.sectionTitle}>Meu Perfil</h1>
            
            <div className={styles.profileCard}>
                <label className={styles.avatarWrapper}>
                    {avatarUrl ? (
                        <img src={avatarUrl} alt="Foto de Perfil" className={styles.profileAvatar} />
                    ) : (
                        <FaUserCircle size={120} className={styles.avatarIcon} />
                    )}
                    <span className={styles.uploadLabel}><FaCamera /></span>
                    <input type="file" accept="image/*" className={styles.uploadInput} onChange={handleFile} />
                </label>

                {imageAvatar && (
                    <button className={styles.uploadButton} onClick={handleImageUpload} disabled={uploading}>
                        {uploading ? 'Enviando...' : `Confirmar nova foto`}
                    </button>
                )}

                <form className={styles.infoSection} onSubmit={handleNameUpdate}>
                    {!isEditingName ? (
                        <div className={styles.infoDisplay}>
                            <h2>{user.displayName || 'Sem nome'}</h2>
                            <button type="button" onClick={() => setIsEditingName(true)}>Alterar nome</button>
                        </div>
                    ) : (
                        <div className={styles.editForm}>
                            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} autoFocus />
                            <div className={styles.editFormButtons}>
                                <button type="submit">Salvar</button>
                                <button type="button" onClick={() => setIsEditingName(false)}>Cancelar</button>
                            </div>
                        </div>
                    )}
                    
                    <div className={styles.inputWrapper}>
                        <input type="email" value={user.email} disabled={true} />
                        <FaLock className={styles.lockIcon} />
                    </div>
                </form>

                <form className={styles.passwordSection} onSubmit={handlePasswordUpdate}>
                    <h3>Alterar Senha</h3>
                    <div className={styles.inputGroup}>
                        <div className={styles.inputWrapper}>
                            <input type={showCurrentPassword ? 'text' : 'password'} placeholder="Digite sua senha atual" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                            <button type="button" className={styles.eyeIcon} onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        <div className={styles.inputWrapper}>
                            <input type={showNewPassword ? 'text' : 'password'} placeholder="Mínimo de 6 caracteres" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                            <button type="button" className={styles.eyeIcon} onClick={() => setShowNewPassword(!showNewPassword)}>
                                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        <div className={styles.inputWrapper}>
                            <input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirme sua nova senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            <button type="button" className={styles.eyeIcon} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className={styles.saveButton}>Alterar Senha</button>
                </form>
            </div>
        </div>
    );
}

export default Perfil;