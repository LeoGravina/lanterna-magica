// src/pages/Search/Search.jsx (Final e Corrigido)
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../services/api';
import styles from './Search.module.css';
import { motion } from 'framer-motion';
import ScrollArrow from '../../components/ScrollArrow/ScrollArrow.jsx';

const SkeletonCard = () => (
    <div className={styles.skeletonCard}>
        <div className={`${styles.skeleton} ${styles.skeletonImg}`}></div>
    </div>
);

function Search() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q");
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadSearchedMovies() {
            if (!query) return;
            setLoading(true);
            const response = await api.get("search/movie", {
                params: {
                    api_key: import.meta.env.VITE_API_KEY,
                    language: "pt-BR",
                    query,
                    page: 1,
                }
            });
            setMovies(response.data.results);
            setLoading(false);
        }
        loadSearchedMovies();
    }, [query]);

    return (
       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3, ease: "easeInOut" }} >
            <div className={`container ${styles.searchContainer}`}>
                
                {/* === TÍTULO ATUALIZADO AQUI === */}
                <h1 className={styles.sectionTitle}>
                    Resultados para: <span className={styles.queryText}>{query}</span>
                </h1>
                
                {loading ? (
                    <div className={styles.listaFilmes}>
                        {Array.from({ length: 12 }).map((_, index) => <SkeletonCard key={index} />)}
                    </div>
                ) : movies.length === 0 ? (
                    <p className={styles.emptyMessage}>Nenhum filme encontrado com este termo.</p>
                ) : (
                    <div className={styles.listaFilmes}>
                        {movies.map((filme) => (
                            <Link to={`/filme/${filme.id}`} key={filme.id} className={styles.filmeCard}>
                                <img src={`https://image.tmdb.org/t/p/w500/${filme.poster_path}`} alt={filme.title} />
                                <div className={styles.filmeInfo}>
                                    <strong>{filme.title}</strong>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
            {!loading && <ScrollArrow />}
        </motion.div>
    );
}

export default Search;