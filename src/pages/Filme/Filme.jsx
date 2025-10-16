// src/pages/Filme/Filme.jsx (Final, com Elenco e Skeleton)
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';
import styles from './Filme.module.css';
import { motion } from 'framer-motion';
import { FaStar, FaUserAlt } from 'react-icons/fa';

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
    const [cast, setCast] = useState([]); // State para o elenco
    const [similarMovies, setSimilarMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        async function loadFilmeData() {
            setLoading(true);
            window.scrollTo(0, 0);
            try {
                const apiKey = import.meta.env.VITE_API_KEY;
                const language = "pt-BR";

                // Busca todos os dados em paralelo
                const [filmeResponse, similarResponse, creditsResponse] = await Promise.all([
                    api.get(`/movie/${id}`, { params: { api_key: apiKey, language } }),
                    api.get(`/movie/${id}/similar`, { params: { api_key: apiKey, language, page: 1 } }),
                    api.get(`/movie/${id}/credits`, { params: { api_key: apiKey, language } })
                ]);
                
                setFilme(filmeResponse.data);
                setSimilarMovies(similarResponse.data.results.slice(0, 6));
                setCast(creditsResponse.data.cast.slice(0, 8)); // Pega os 8 atores principais
                
                const minhaLista = localStorage.getItem("@lanternaMagica");
                const filmesSalvos = JSON.parse(minhaLista) || [];
                const hasFilme = filmesSalvos.some((filmeSalvo) => filmeSalvo.id === filmeResponse.data.id);
                setIsSaved(hasFilme);

                setLoading(false);

            } catch (error) {
                navigate("/", { replace: true });
            }
        }
        loadFilmeData();
    }, [navigate, id]);

    function salvarFilme() {
        const minhaLista = localStorage.getItem("@lanternaMagica");
        let filmesSalvos = JSON.parse(minhaLista) || [];
        
        const hasFilme = filmesSalvos.some((filmeSalvo) => filmeSalvo.id === filme.id);
        if (hasFilme) {
            toast.warn("Esse filme já está na sua lista!");
            return;
        }

        filmesSalvos.push(filme);
        localStorage.setItem("@lanternaMagica", JSON.stringify(filmesSalvos));
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

    if (loading) {
        return <SkeletonFilme />;
    }

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
                        {filme.overview && (
                            <>
                                <h3>Sinopse</h3>
                                <span>{filme.overview}</span>
                            </>
                        )}
                        <strong>Avaliação: {filme.vote_average.toFixed(1)} / 10</strong>
                        <div className={styles.areaButtons}>
                            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={salvarFilme} disabled={isSaved}>
                                {isSaved ? "JÁ SALVO" : "SALVAR"}
                            </button>
                            <a className={`${styles.btn} ${styles.btnSecondary}`} target="_blank" rel="external noreferrer" href={`https://youtube.com/results?search_query=${filme.title} trailer`}>
                                TRAILER
                            </a>
                            <Link to="/" className={`${styles.btn} ${styles.btnSecondary}`}>
                                VOLTAR
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEÇÃO DE ELENCO PRINCIPAL - VERSÃO CORRIGIDA COM LINK */}
            {cast.length > 0 && (
                <div className={`container ${styles.castSection}`}>
                    <h2 className={styles.sectionTitle}>Elenco Principal</h2>
                    <div className={styles.castGrid}>
                        {cast.map((person) => (
                            // 1. O <Link> agora envolve todo o card do ator. A 'key' vem para cá.
                            <Link to={`/person/${person.id}`} key={person.id} className={styles.castMemberLink}>
                                
                                {/* 2. O conteúdo do card (imagem, nome) continua o mesmo, mas agora está DENTRO do Link */}
                                <div className={styles.castMember}>
                                    {person.profile_path ? (
                                        <img 
                                            src={`https://image.tmdb.org/t/p/w185/${person.profile_path}`} 
                                            alt={person.name} 
                                        />
                                    ) : (
                                        <div className={styles.imagePlaceholder}>
                                            <FaUserAlt size={40} />
                                        </div>
                                    )}
                                    <strong>{person.name}</strong>
                                    <span>{person.character}</span>
                                </div>

                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Seção de Filmes Semelhantes */}
            {similarMovies.length > 0 && (
                <div className={`container ${styles.similarSection}`}>
                    <h2 className={styles.sectionTitle}>Filmes Semelhantes</h2>
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