// src/pages/Favoritos/Favoritos.jsx (Versão Final Completa com Ícones e Filtro)
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebase/firebase.js';
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from 'react-toastify';
import styles from './Favoritos.module.css';
import { motion } from 'framer-motion';
import { FaFilm, FaEllipsisV, FaStar, FaCheckCircle, FaRegClock, FaGem } from 'react-icons/fa'; // Importa todos os ícones necessários

// Objeto de configuração para os status, agora com ícones
const STATUS_OPTIONS = {
    'Favorito': { icon: <FaStar />, className: styles.statusFavorito },
    'Assistido': { icon: <FaCheckCircle />, className: styles.statusAssistido },
    'Na Fila': { icon: <FaRegClock />, className: styles.statusNaFila },
    'Jóia Rara': { icon: <FaGem />, className: styles.statusJoiaRara },
};
const statusNames = Object.keys(STATUS_OPTIONS); // Array com os nomes: ['Favorito', 'Assistido', ...]

function Favoritos() {
    const [filmes, setFilmes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [activeFilter, setActiveFilter] = useState('Todos');
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
            querySnapshot.forEach((doc) => savedMovies.push(doc.data()));
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

    async function updateMovieStatus(movieId, newStatus) {
        if (!user) return;
        const movieRef = doc(db, "users", user.uid, "movies", movieId.toString());
        await updateDoc(movieRef, { status: newStatus });
        setFilmes(filmes.map(filme => 
            filme.id === movieId ? { ...filme, status: newStatus } : filme
        ));
        setOpenDropdown(null);
    }

    if (loading) {
        return <div className={styles.loading}><h1>Carregando filmes salvos...</h1></div>;
    }

    const filteredFilmes = activeFilter === 'Todos' 
        ? filmes 
        : filmes.filter(filme => filme.status === activeFilter);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className={`container ${styles.favoritosContainer}`}>
                <h1 className={styles.sectionTitle}>Meus Filmes Salvos</h1>

                <div className={styles.filterBar}>
                    <button 
                        onClick={() => setActiveFilter('Todos')}
                        className={activeFilter === 'Todos' ? styles.active : ''}
                    >
                        Todos
                    </button>
                    {statusNames.map(status => (
                        <button 
                            key={status}
                            onClick={() => setActiveFilter(status)}
                            className={activeFilter === status ? styles.active : ''}
                        >
                            {STATUS_OPTIONS[status].icon} {status}
                        </button>
                    ))}
                </div>

                {filteredFilmes.length === 0 ? (
                    <div className={styles.emptyContainer}>
                        <FaFilm size={60} className={styles.emptyIcon} />
                        <h2>{activeFilter === 'Todos' ? 'Sua lista está vazia' : `Nenhum filme marcado como "${activeFilter}"`}</h2>
                        <p>Explore o catálogo e comece sua coleção!</p>
                        <Link to="/" className={styles.exploreButton}>Explorar Filmes</Link>
                    </div>
                ) : (
                    <div className={styles.listaFilmes}>
                        {filteredFilmes.map((filme) => (
                            <div key={filme.id} className={styles.filmeCard}>
                                {filme.status && (
                                    <div className={`${styles.statusBadge} ${STATUS_OPTIONS[filme.status]?.className || ''}`}>
                                        {STATUS_OPTIONS[filme.status]?.icon}
                                        <span>{filme.status}</span>
                                    </div>
                                )}
                                
                                <img src={`https://image.tmdb.org/t/p/w500/${filme.poster_path}`} alt={filme.title} />
                                
                                <div className={styles.overlay}>
                                    <strong>{filme.title}</strong>
                                    <div className={styles.actions}>
                                        <Link to={`/filme/${filme.id}`} className={styles.btn}>Ver detalhes</Link>
                                        <button onClick={() => excluirFilme(filme.id)} className={`${styles.btn} ${styles.btnExclude}`}>Excluir</button>
                                    </div>
                                </div>

                                <div className={styles.statusContainer}>
                                    <button className={styles.statusButton} onClick={() => setOpenDropdown(openDropdown === filme.id ? null : filme.id)}>
                                        <FaEllipsisV />
                                    </button>
                                    {openDropdown === filme.id && (
                                        <div className={styles.statusDropdown}>
                                            {statusNames.map(status => (
                                                <button key={status} onClick={() => updateMovieStatus(filme.id, status)}>
                                                    {STATUS_OPTIONS[status].icon} Marcar como "{status}"
                                                </button>
                                            ))}
                                        </div>
                                    )}
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