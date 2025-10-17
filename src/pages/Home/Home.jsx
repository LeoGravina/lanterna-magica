import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import { motion } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

const SkeletonCard = () => (
    <div className={styles.skeletonCard}>
        <div className={`${styles.skeleton} ${styles.skeletonImg}`}></div>
    </div>
);

function Home() {
    const [filmes, setFilmes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        async function loadGenres() {
            try {
                const response = await api.get("/genre/movie/list", {
                    params: { api_key: import.meta.env.VITE_API_KEY, language: "pt-BR" }
                });
                setGenres(response.data.genres);
            } catch (error) {
                console.error("Falha ao buscar gêneros", error);
            }
        }
        loadGenres();
    }, []);

    useEffect(() => {
        async function loadFilmes() {
            if (page > 1) {
                setLoadingMore(true);
            } else {
                setLoading(true); 
            }
            
            const params = { api_key: import.meta.env.VITE_API_KEY, language: "pt-BR", page };
            if (selectedGenre) {
                params.with_genres = selectedGenre.id;
            }
            
            const endpoint = selectedGenre ? "discover/movie" : "movie/now_playing";

            const response = await api.get(endpoint, { params });

            setFilmes(prevFilmes => page === 1 ? response.data.results : [...prevFilmes, ...response.data.results]);
            setHasMore(response.data.page < response.data.total_pages);
            setLoading(false);
            setLoadingMore(false);
        }
        loadFilmes();
    }, [selectedGenre, page]);

    useEffect(() => {
        setPage(1);
        setFilmes([]);
    }, [selectedGenre]);

    const handleGenreSelect = (genre) => {
        setSelectedGenre(genre);
        setIsGenreDropdownOpen(false);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className={`container ${styles.homeContainer}`}>
                <div className={styles.titleAndFilter}>
                    <h1 className={styles.sectionTitle}>{selectedGenre ? selectedGenre.name : "Em Cartaz"}</h1>
                    
                    <div className={styles.filterContainer}>
                        <button className={styles.filterButton} onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}>
                            Gêneros <FaChevronDown size={14} />
                        </button>
                        {isGenreDropdownOpen && (
                            <div className={styles.genreDropdown}>
                                <button onClick={() => handleGenreSelect(null)}>Todos</button>
                                {genres.map((genre) => (
                                    <button key={genre.id} onClick={() => handleGenreSelect(genre)}>
                                        {genre.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className={styles.listaFilmes}>
                        {Array.from({ length: 12 }).map((_, index) => (
                            <SkeletonCard key={index} />
                        ))}
                    </div>
                ) : (
                    <>
                        <div className={styles.listaFilmes}>
                            {filmes.map((filme) => (
                                <Link to={`/filme/${filme.id}`} key={filme.id} className={styles.filmeCard}>
                                    <img src={`https://image.tmdb.org/t/p/w500/${filme.poster_path}`} alt={filme.title} />
                                    <div className={styles.filmeInfo}><strong>{filme.title}</strong></div>
                                </Link>
                            ))}
                        </div>
                        {hasMore && (
                            <div className={styles.loadMoreContainer}>
                                <button onClick={() => setPage(prevPage => prevPage + 1)} className={styles.loadMoreButton} disabled={loadingMore}>
                                    {loadingMore ? 'Carregando...' : 'Carregar Mais'}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </motion.div>
    );
}

export default Home;