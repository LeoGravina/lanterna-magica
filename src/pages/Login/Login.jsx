// src/pages/Login/Login.jsx (Versão Final com Olho na Senha e Card)
import { useState } from 'react';
import styles from './Login.module.css';
import { auth } from '../../firebase/firebase.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    updateProfile // Importar para atualizar o nome do usuário
} from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importa os ícones de olho

function Login() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Novo state para o olho
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();

    async function handleAuth(e) {
        e.preventDefault();

        if (isRegistering) {
            if (name === '') {
                toast.warn("Por favor, preencha seu nome.");
                return;
            }
            // Lógica de cadastro
            await createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                // Atualiza o perfil do usuário com o nome
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
            // Lógica de login
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
            {/* Div para a sua logo */}
            <div className={styles.logoContainer}>
                {/* Você pode adicionar sua logo aqui. Por exemplo: */}
                {/* <img src="/caminho/para/sua/logo.png" alt="Lanterna Mágica Logo" className={styles.appLogo} /> */}
                <Link to="/" className={styles.logoText}>LANTERNA MÁGICA</Link>
            </div>

            {/* O "card" que envolve tudo */}
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
                            required // Campo de nome obrigatório para cadastro
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
                            type={showPassword ? 'text' : 'password'} // Alterna o tipo do input
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
                            {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Altera o ícone */}
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
        </div>
    );
}

export default Login;