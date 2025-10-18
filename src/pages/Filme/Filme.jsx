// src/pages/Filme/Filme.jsx (Final, com Ícones nas Seções)
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db, auth } from '../../firebase/firebase.js';
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import api from '../../services/api';
import { toast } from 'react-toastify';
import styles from './Filme.module.css';
import { motion } from 'framer-motion';
import { FaStar, FaUserAlt, FaUsers, FaFilm } from 'react-icons/fa'; // Ícones FaUsers e FaFilm adicionados

// Componente para o esqueleto da página de detalhes
const SkeletonFilme = () => (
    <div className={styles.filmeContainer}>
        <div className={`container ${styles.contentCard}`}>
            <div className={styles.poster}>
                <div className={`${styles.skeleton} ${styles.skeletonPoster}`}></div>
            </div>
            <div className={styles.details}>
                <div className={`${styles.skeleton} ${styles.skeletonTitle}`}></div>
                <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '80%' }}></div>
                <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '90%' }}></div>
                <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '70%' }}></div>
                <div className={`${styles.skeleton} ${styles.skeletonTag}`}></div>
            </div>
        </div>
    </div>
);

function Filme() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [filme, setFilme] = useState({});
    const [cast, setCast] = useState([]);
    const [similarMovies, setSimilarMovies] = useState([]);
    const [watchProviders, setWatchProviders] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        async function loadFilmeData() {
            setLoading(true);
            window.scrollTo(0, 0);
            try {
                const apiKey = import.meta.env.VITE_API_KEY;
                const language = "pt-BR";

                const [filmeResponse, similarResponse, creditsResponse, providersResponse] = await Promise.all([
                    api.get(`/movie/${id}`, { params: { api_key: apiKey, language } }),
                    api.get(`/movie/${id}/similar`, { params: { api_key: apiKey, language, page: 1 } }),
                    api.get(`/movie/${id}/credits`, { params: { api_key: apiKey, language } }),
                    api.get(`/movie/${id}/watch/providers`, { params: { api_key: apiKey } })
                ]);
                
                setFilme(filmeResponse.data);
                setSimilarMovies(similarResponse.data.results.slice(0, 6));
                setCast(creditsResponse.data.cast.slice(0, 8));
                
                if (providersResponse.data.results.BR) {
                    setWatchProviders(providersResponse.data.results.BR);
                }
                
                if (auth.currentUser) {
                    const movieRef = doc(db, "users", auth.currentUser.uid, "movies", filmeResponse.data.id.toString());
                    const docSnap = await getDoc(movieRef);
                    setIsSaved(docSnap.exists());
                }

                setLoading(false);

            } catch (error) {
                navigate("/", { replace: true });
            }
        }
        loadFilmeData();
    }, [navigate, id, user]);

    async function handleSaveMovie() {
        if (!user) {
            toast.warn("Você precisa estar logado para salvar um filme!");
            navigate('/login');
            return;
        }

        const movieRef = doc(db, "users", user.uid, "movies", filme.id.toString());
        
        if (isSaved) {
            await deleteDoc(movieRef);
            setIsSaved(false);
            toast.info("Filme removido dos seus salvos.");
        } else {
            await setDoc(movieRef, {
                id: filme.id,
                title: filme.title,
                poster_path: filme.poster_path,
                status: 'Na Fila',
            });
            setIsSaved(true);
            toast.success("Filme salvo com sucesso!", {
                icon: <FaStar />,
                style: {
                    background: 'var(--color-gray-medium)',
                    color: 'var(--color-brand-yellow)',
                    border: '1px solid var(--color-gray-light)',
                },
            });
        }
    }
    
    if (loading) {
        return <SkeletonFilme />;
    }

    const renderProviders = (providers) => {
        if (!providers) return null;
        return providers.map(provider => {
            const searchQuery = `Assistir ${filme.title} ${provider.provider_name}`;
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
            return (
                <a key={provider.provider_id} href={searchUrl} target="_blank" rel="noopener noreferrer" className={styles.provider}>
                    <img src={`https://image.tmdb.org/t/p/w92/${provider.logo_path}`} alt={provider.provider_name} title={provider.provider_name} />
                </a>
            );
        });
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className={styles.filmeContainer}>
                <div className={styles.backdrop} style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/${filme.backdrop_path})` }}></div>
                <div className={`container ${styles.contentCard}`}>
                    <div className={styles.poster}>
                        <img src={`https://image.tmdb.org/t/p/w500/${filme.poster_path}`} alt={filme.title} />
                    </div>
                    <div className={styles.details}>
                        <h1>{filme.title}</h1>
                        {filme.overview && ( <><h3>Sinopse</h3><span>{filme.overview}</span></> )}
                        <strong>Avaliação: {filme.vote_average ? filme.vote_average.toFixed(1) : 'N/A'} / 10</strong>
                        <div className={styles.areaButtons}>
                            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSaveMovie} disabled={!user}>
                                {isSaved ? "REMOVER" : "SALVAR"}
                            </button>
                            <a className={`${styles.btn} ${styles.btnSecondary}`} target="_blank" rel="external noreferrer" href={`https://youtube.com/results?search_query=${filme.title} trailer`}>TRAILER</a>
                            <Link to="/" className={`${styles.btn} ${styles.btnSecondary}`}>VOLTAR</Link>
                        </div>
                        {watchProviders && (watchProviders.flatrate || watchProviders.rent || watchProviders.buy) && (
                            <div className={styles.streamingSection}>
                                <h3>Onde Assistir</h3>
                                <div className={styles.providers}>
                                    {renderProviders(watchProviders.flatrate)}
                                    {renderProviders(watchProviders.rent)}
                                    {renderProviders(watchProviders.buy)}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {cast.length > 0 && (
                <div className={`container ${styles.castSection}`}>
                    <h2 className={styles.sectionTitle}>
                        <FaUsers /> Elenco Principal
                    </h2>
                    <div className={styles.castGrid}>
                        {cast.map((person) => (
                            <Link to={`/person/${person.id}`} key={person.id} className={styles.castMemberLink}>
                                <div className={styles.castMember}>
                                    {person.profile_path ? (
                                        <img src={`https://image.tmdb.org/t/p/w185/${person.profile_path}`} alt={person.name} />
                                    ) : (
                                        <div className={styles.imagePlaceholder}><FaUserAlt size={40} /></div>
                                    )}
                                    <strong>{person.name}</strong>
                                    <span>{person.character}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {similarMovies.length > 0 && (
                <div className={`container ${styles.similarSection}`}>
                    <h2 className={styles.sectionTitle}>
                        <FaFilm /> Filmes Semelhantes
                    </h2>
                    <div className={styles.similarGrid}>
                        {similarMovies.map((similar) => (
                            <Link to={`/filme/${similar.id}`} key={similar.id} className={styles.similarCard}>
                                <img src={`https://image.tmdb.org/t/p/w500/${similar.poster_path}`} alt={similar.title} />
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
}

export default Filme;