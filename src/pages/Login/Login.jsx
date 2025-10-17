import { useState } from 'react';
import styles from './Login.module.css';
import { auth } from '../../firebase/firebase.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    updateProfile 
} from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 

function Login() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); 
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();

    async function handleAuth(e) {
        e.preventDefault();

        if (isRegistering) {
            if (name === '') {
                toast.warn("Por favor, preencha seu nome.");
                return;
            }
            await createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                await updateProfile(userCredential.user, {
                    displayName: name
                });
                toast.success("Conta criada com sucesso!");
                navigate('/');
            })
            .catch((error) => {
                console.error("Erro ao criar conta:", error);
                if (error.code === 'auth/email-already-in-use') {
                    toast.error("Este e-mail já está em uso.");
                } else if (error.code === 'auth/weak-password') {
                    toast.error("A senha precisa ter no mínimo 6 caracteres.");
                } else {
                    toast.error("Erro ao criar conta.");
                }
            });
        } else {
            await signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                toast.success("Login efetuado com sucesso!");
                navigate('/');
            })
            .catch((error) => {
                console.error("Erro ao fazer login:", error);
                toast.error("E-mail ou senha incorretos.");
            });
        }
    }

    return (
        <div className={styles.loginContainer}>
            <div className={styles.logoContainer}>
                <Link to="/" className={styles.logoText}>LANTERNA MÁGICA</Link>
            </div>

            <div className={styles.loginCard}>
                <h1 className={styles.title}>{isRegistering ? 'Crie sua conta' : 'Acesse sua conta'}</h1>
                <span className={styles.subtitle}>Salve e gerencie seus filmes favoritos em qualquer lugar.</span>

                <form className={styles.form} onSubmit={handleAuth}>
                    {isRegistering && (
                        <input 
                            type="text" 
                            placeholder="Seu nome completo..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required 
                        />
                    )}
                    <input 
                        type="email" 
                        placeholder="Digite seu e-mail..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <div className={styles.passwordWrapper}>
                        <input 
                            type={showPassword ? 'text' : 'password'} 
                            placeholder="Sua senha..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button 
                            type="button" 
                            className={styles.eyeIcon} 
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />} 
                        </button>
                    </div>
                    <button type="submit">
                        {isRegistering ? 'Cadastrar' : 'Acessar'}
                    </button>
                </form>

                <button className={styles.toggleButton} onClick={() => setIsRegistering(!isRegistering)}>
                    {isRegistering ? 'Já tenho uma conta' : 'Não possui uma conta? Cadastre-se'}
                </button>
            </div>

            <Link to="/" className={styles.backLink}>
                Voltar ao site
            </Link>
        </div>
    );
}

export default Login;