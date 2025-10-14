import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../services/api';
import styles from './Search.module.css';
import { motion } from 'framer-motion';

function Search() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q"); // Pega o "?q=valor" da URL
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
    }, [query]); // Roda o efeito sempre que a query de busca mudar

    if (loading) {
        return <div className={styles.loading}><h2>Carregando...</h2></div>;
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className={`container ${styles.searchContainer}`}>
                <h1 className={styles.sectionTitle}>
                    Resultados para: <span className={styles.queryText}>{query}</span>
                </h1>
                {movies.length === 0 && <p>Nenhum filme encontrado com este termo.</p>}
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
            </div>
        </motion.div>
    );
}

export default Search;