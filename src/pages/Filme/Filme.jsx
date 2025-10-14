import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';
import styles from './Filme.module.css';
import { motion } from 'framer-motion';

function Filme() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [filme, setFilme] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadFilme() {
            try {
                const response = await api.get(`/movie/${id}`, {
                    params: {
                        api_key: import.meta.env.VITE_API_KEY,
                        language: "pt-BR",
                    }
                });
                setFilme(response.data);
                setLoading(false);
            } catch (error) {
                navigate("/", { replace: true });
            }
        }
        loadFilme();
    }, [navigate, id]);

    function salvarFilme() {
        const minhaLista = localStorage.getItem("@primeflix");
        let filmesSalvos = JSON.parse(minhaLista) || [];
        const hasFilme = filmesSalvos.some((filmeSalvo) => filmeSalvo.id === filme.id);

        if (hasFilme) {
            toast.warn("Esse filme já está na sua lista!");
            return;
        }

        filmesSalvos.push(filme);
        localStorage.setItem("@primeflix", JSON.stringify(filmesSalvos));
        toast.success("Filme salvo com sucesso!");
    }

    if (loading) {
        return <div className={styles.loading}><h1>Carregando...</h1></div>;
    }

    const filmesSalvos = JSON.parse(localStorage.getItem("@primeflix")) || [];
    const isFilmeSalvo = filmesSalvos.some(filmeSalvo => filmeSalvo.id === filme.id);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className={styles.filmeContainer}>
                <div 
                    className={styles.backdrop} 
                    style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/${filme.backdrop_path})` }}
                ></div>

                <div className={`container ${styles.contentCard}`}>
                    <div className={styles.poster}>
                        <img src={`https://image.tmdb.org/t/p/w500/${filme.poster_path}`} alt={filme.title} />
                    </div>
                    <div className={styles.details}>
                        <h1>{filme.title}</h1>
                        <span>{filme.overview}</span>
                        <strong>Avaliação: {filme.vote_average.toFixed(1)} / 10</strong>
                        <div className={styles.areaButtons}>
                            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={salvarFilme} disabled={isFilmeSalvo}>
                                {isFilmeSalvo ? "JÁ SALVO" : "SALVAR"}
                            </button>
                            <a className={`${styles.btn} ${styles.btnSecondary}`} target="_blank" rel="external noreferrer" href={`https://youtube.com/results?search_query=${filme.title} trailer`}>
                                TRAILER
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default Filme;