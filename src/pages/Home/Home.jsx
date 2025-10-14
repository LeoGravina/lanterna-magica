import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import { motion } from 'framer-motion';

function Home() {
    const [filmes, setFilmes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadFilmes() {
            // Usaremos Promise.all para fazer as 3 chamadas à API em paralelo
            const apiKey = import.meta.env.VITE_API_KEY;
            const language = "pt-BR";

            const [page1, page2, page3] = await Promise.all([
                api.get("movie/now_playing", { params: { api_key: apiKey, language, page: 1 } }),
                api.get("movie/now_playing", { params: { api_key: apiKey, language, page: 2 } }),
                api.get("movie/now_playing", { params: { api_key: apiKey, language, page: 3 } })
            ]);

            // Juntamos os resultados das 3 páginas em um único array
            const allMovies = [
                ...page1.data.results,
                ...page2.data.results,
                ...page3.data.results
            ];

            // Pegamos os primeiros 50 filmes da lista combinada
            setFilmes(allMovies.slice(0, 100));
            setLoading(false);
        }
        loadFilmes();
    }, []);

    if (loading) {
        return (
            <div className={styles.loading}>
                <h2>Carregando Filmes...</h2>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className={`container ${styles.homeContainer}`}>
                <h1 className={styles.sectionTitle}>Em Cartaz</h1>
                <div className={styles.listaFilmes}>
                    {filmes.map((filme) => (
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

export default Home;