import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import styles from './Pessoa.module.css';
import { motion } from 'framer-motion';
import { FaUserAlt } from 'react-icons/fa';
import ScrollArrow from '../../components/ScrollArrow/ScrollArrow.jsx';

function Pessoa() {
    const { id } = useParams();
    const [personDetails, setPersonDetails] = useState({});
    const [movieCredits, setMovieCredits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPersonData() {
            setLoading(true);
            window.scrollTo(0, 0);

            const apiKey = import.meta.env.VITE_API_KEY;
            const language = "pt-BR";

            try {
                const [detailsResponse, creditsResponse] = await Promise.all([
                    api.get(`/person/${id}`, { params: { api_key: apiKey, language } }),
                    api.get(`/person/${id}/movie_credits`, { params: { api_key: apiKey, language } })
                ]);

                setPersonDetails(detailsResponse.data);
                const sortedCredits = creditsResponse.data.cast.sort((a, b) => b.popularity - a.popularity);
                setMovieCredits(sortedCredits);
                setLoading(false);

            } catch (error) {
                console.error("Erro ao buscar dados da pessoa:", error);
                setLoading(false);
            }
        }
        loadPersonData();
    }, [id]);

    if (loading) {
        return <div className={styles.loading}><h1>Carregando...</h1></div>;
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3, ease: "easeInOut" }} >
            <div className={`container ${styles.personContainer}`}>
                <div className={styles.mainInfo}>
                    <div className={styles.poster}>
                        {personDetails.profile_path ? (
                            <img 
                                src={`https://image.tmdb.org/t/p/w500/${personDetails.profile_path}`} 
                                alt={personDetails.name} 
                            />
                        ) : (
                            <div className={styles.imagePlaceholder}>
                                <FaUserAlt size={80} />
                            </div>
                        )}
                    </div>
                    <div className={styles.details}>
                        <h1>{personDetails.name}</h1>
                        {personDetails.biography && (
                            <>
                                <h3>Biografia</h3>
                                <p>{personDetails.biography}</p>
                            </>
                        )}
                        <Link to="/" className={styles.backButton}>Voltar para a Home</Link>
                    </div>
                </div>

                {movieCredits.length > 0 && (
                    <div className={styles.filmographySection}>
                        <h2>Filmografia</h2>
                        <div className={styles.filmGrid}>
                            {movieCredits.map((movie) => (
                                <Link to={`/filme/${movie.id}`} key={movie.credit_id} className={styles.movieCard}>
                                    {movie.poster_path ? (
                                        <img 
                                            src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} 
                                            alt={movie.title} 
                                        />
                                    ) : (
                                        <div className={styles.moviePlaceholder}>
                                            <span>{movie.title}</span>
                                        </div>
                                    )}
                                    <div className={styles.movieInfo}>
                                        <strong>{movie.title}</strong>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {!loading && <ScrollArrow />}
        </motion.div>
    );
}

export default Pessoa;