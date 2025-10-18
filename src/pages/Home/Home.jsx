// src/pages/Home/Home.jsx (Versão Final Completa com Dropdown Moderno)
import { useEffect, useState, useRef } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import { motion } from 'framer-motion';
import { FaChevronDown, FaFilm, FaTheaterMasks, FaLaughBeam, FaBolt, FaBook, FaQuestionCircle, FaUsers, FaHatWizard, FaHistory, FaSkullCrossbones, FaSearch, FaHeart, FaRocket } from 'react-icons/fa';

// Componente para o esqueleto do Card de Filme
const SkeletonCard = () => (
    <div className={styles.skeletonCard}>
        <div className={`${styles.skeleton} ${styles.skeletonImg}`}></div>
    </div>
);

// Mapeamento de Gêneros para Ícones para um toque visual extra
const genreIcons = {
    'Ação': <FaBolt />,
    'Aventura': <FaHatWizard />,
    'Animação': <FaFilm />,
    'Comédia': <FaLaughBeam />,
    'Crime': <FaQuestionCircle />,
    'Documentário': <FaBook />,
    'Drama': <FaTheaterMasks />,
    'Família': <FaUsers />,
    'Fantasia': <FaHatWizard />,
    'História': <FaHistory />,
    'Terror': <FaSkullCrossbones />,
    'Música': <FaFilm />,
    'Mistério': <FaSearch />,
    'Romance': <FaHeart />,
    'Ficção científica': <FaRocket />,
};

function Home() {
    const [filmes, setFilmes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const filterRef = useRef(null);

    // Efeito para buscar a lista de gêneros (roda apenas uma vez)
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

    // Efeito para buscar os filmes (com paginação)
    useEffect(() => {
        async function loadFilmes() {
            if (page > 1) {
                setLoadingMore(true);
            } else {
                setLoading(true); 
            }
            
            const params = { api_key: import.meta.env.VITE_API_KEY, language: "pt-BR", page };
            const endpoint = selectedGenre ? "discover/movie" : "movie/now_playing";
            if (selectedGenre) {
                params.with_genres = selectedGenre.id;
            }
            
            const response = await api.get(endpoint, { params });

            setFilmes(prevFilmes => page === 1 ? response.data.results : [...prevFilmes, ...response.data.results]);
            setHasMore(response.data.page < response.data.total_pages);
            setLoading(false);
            setLoadingMore(false);
        }
        loadFilmes();
    }, [selectedGenre, page]);

    // Reseta a paginação ao mudar de gênero
    useEffect(() => {
        setPage(1);
        setFilmes([]);
    }, [selectedGenre]);

    // Efeito para fechar o dropdown ao clicar fora
    useEffect(() => {
        function handleClickOutside(event) {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setIsGenreDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [filterRef]);

    const handleGenreSelect = (genre) => {
        setSelectedGenre(genre);
        setIsGenreDropdownOpen(false);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className={`container ${styles.homeContainer}`}>
                <div className={styles.titleAndFilter}>
                    <h1 className={styles.sectionTitle}>{selectedGenre ? selectedGenre.name : "Em Cartaz"}</h1>
                    
                    <div className={styles.filterContainer} ref={filterRef}>
                        <button className={styles.filterButton} onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}>
                            <span>{selectedGenre ? selectedGenre.name : "Gêneros"}</span>
                            <FaChevronDown size={14} className={`${styles.chevron} ${isGenreDropdownOpen ? styles.chevronOpen : ''}`} />
                        </button>
                        {isGenreDropdownOpen && (
                            <div className={styles.genreDropdown}>
                                <button onClick={() => handleGenreSelect(null)}>
                                    <FaFilm /> Em Cartaz
                                </button>
                                {genres.map((genre) => (
                                    <button key={genre.id} onClick={() => handleGenreSelect(genre)}>
                                        {genreIcons[genre.name] || <FaFilm />}
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
                        {hasMore && !loading && (
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