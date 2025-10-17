import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebase/firebase.js';
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from 'react-toastify';
import styles from './Favoritos.module.css';
import { motion } from 'framer-motion';
import { FaFilm } from 'react-icons/fa';

function Favoritos() {
    const [filmes, setFilmes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                navigate('/login');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    useEffect(() => {
        async function loadSavedMovies() {
            if (!user) return; 
            setLoading(true);
            const moviesRef = collection(db, "users", user.uid, "movies");
            const querySnapshot = await getDocs(moviesRef);
            const savedMovies = [];
            querySnapshot.forEach((doc) => {
                savedMovies.push(doc.data());
            });
            setFilmes(savedMovies);
            setLoading(false);
        }
        
        if (user) {
            loadSavedMovies();
        }
    }, [user]);

    async function excluirFilme(movieId) {
        if (!user) return;
        const movieRef = doc(db, "users", user.uid, "movies", movieId.toString());
        await deleteDoc(movieRef);
        setFilmes(filmes.filter(filme => filme.id !== movieId));
        toast.success("Filme removido com sucesso!");
    }

    if (loading) {
        return <div className={styles.loading}><h1>Carregando filmes salvos...</h1></div>;
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className={`container ${styles.favoritosContainer}`}>
                <h1 className={styles.sectionTitle}>Meus Filmes Salvos</h1>

                {filmes.length === 0 ? (
                    <div className={styles.emptyContainer}>
                        <FaFilm size={60} className={styles.emptyIcon} />
                        <h2>Sua lista está vazia</h2>
                        <p>Parece que você ainda não salvou nenhum filme. Explore o catálogo e comece sua coleção!</p>
                        <Link to="/" className={styles.exploreButton}>Explorar Filmes</Link>
                    </div>
                ) : (
                    <div className={styles.listaFilmes}>
                        {filmes.map((filme) => (
                            <div key={filme.id} className={styles.filmeCard}>
                                <img src={`https://image.tmdb.org/t/p/w500/${filme.poster_path}`} alt={filme.title} />
                                <div className={styles.overlay}>
                                    <strong>{filme.title}</strong>
                                    <div className={styles.actions}>
                                        <Link to={`/filme/${filme.id}`} className={styles.btn}>Ver detalhes</Link>
                                        <button onClick={() => excluirFilme(filme.id)} className={`${styles.btn} ${styles.btnExclude}`}>Excluir</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export default Favoritos;