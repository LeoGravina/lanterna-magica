import { useState, useEffect, useContext } from 'react';
import styles from './Perfil.module.css';
import { auth, storage } from '../../firebase/firebase.js';
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaUserCircle, FaCamera, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/auth.jsx';
import { motion } from 'framer-motion'; // 1. Importa o motion

function Perfil() {
    const { user, updateUserContext } = useContext(AuthContext);
    const [loading, setLoading] = useState(!user);


    // States para edição
    const [avatarUrl, setAvatarUrl] = useState(user?.photoURL);
    const [imageAvatar, setImageAvatar] = useState(null);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(user?.displayName || '');
    const [uploading, setUploading] = useState(false);
    
    // States para senha
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        // Atualiza os campos se o usuário do contexto mudar
        if(user){
            setNewName(user.displayName);
            setAvatarUrl(user.photoURL);
            setLoading(false);
        }
    }, [user]);

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

    const handleImageUpload = async () => {
        if (!imageAvatar) return;
        setUploading(true);
        const imageRef = ref(storage, `profilePictures/${user.uid}`);
        try {
            await uploadBytes(imageRef, imageAvatar);
            const url = await getDownloadURL(imageRef);
            await updateProfile(auth.currentUser, { photoURL: url });
            updateUserContext({ photoURL: url }); // 4. Avisa o contexto sobre a nova foto
            toast.success("Foto de perfil atualizada!");
        } catch (error) {
            toast.error("Erro ao enviar a imagem.");
        }
        setUploading(false);
        setImageAvatar(null);
    };

    const handleNameUpdate = async (e) => {
        e.preventDefault();
        if (newName.trim() === '' || newName === user.displayName) {
            setIsEditingName(false);
            return;
        }
        try {
            await updateProfile(auth.currentUser, { displayName: newName });
            updateUserContext({ displayName: newName }); // 5. Avisa o contexto sobre o novo nome
            toast.success("Nome atualizado com sucesso!");
        } catch (error) {
            toast.error("Erro ao atualizar o nome.");
        }
        setIsEditingName(false);
    };

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

        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        try {
            await reauthenticateWithCredential(auth.currentUser, credential);
            await updatePassword(auth.currentUser, newPassword);
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3, ease: "easeInOut" }} >
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

                    <div className={styles.infoSection}>
                        {!isEditingName ? (
                            <div className={styles.infoDisplay}>
                                <h2>{user.displayName || 'Sem nome'}</h2>
                                <button type="button" onClick={() => setIsEditingName(true)}>Alterar nome</button>
                            </div>
                        ) : (
                            <form onSubmit={handleNameUpdate} className={styles.editForm}>
                                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} autoFocus />
                                <div className={styles.editFormButtons}>
                                    <button type="submit">Salvar</button>
                                    <button type="button" onClick={() => setIsEditingName(false)}>Cancelar</button>
                                </div>
                            </form>
                        )}
                        
                        <div className={styles.inputWrapper}>
                            <input type="email" value={user.email} disabled={true} />
                            <FaLock className={styles.lockIcon} />
                        </div>
                    </div>

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
        </motion.div>
    );
}

export default Perfil;