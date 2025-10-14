import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './Favoritos.module.css';
import { motion } from 'framer-motion';

function Favoritos() {
    const [filmes, setFilmes] = useState([]);

    useEffect(() => {
        const minhaLista = localStorage.getItem("@primeflix");
        setFilmes(JSON.parse(minhaLista) || []);
    }, []);

    function excluirFilme(id) {
        let filtroFilmes = filmes.filter((filme) => filme.id !== id);
        setFilmes(filtroFilmes);
        localStorage.setItem("@primeflix", JSON.stringify(filtroFilmes));
        toast.success("Filme removido com sucesso!");
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className={`container ${styles.favoritosContainer}`}>
                <h1 className={styles.sectionTitle}>Meus Filmes Salvos</h1>

                {filmes.length === 0 && (
                    <div className={styles.emptyMessage}>
                        <h2>Sua lista está vazia :(</h2>
                        <p>Vá para a <Link to="/">página inicial</Link> para salvar seus filmes favoritos.</p>
                    </div>
                )}
                
                <div className={styles.listaFilmes}>
                    {filmes.map((filme) => (
                        <div key={filme.id} className={styles.filmeCard}>
                            <img src={`https://image.tmdb.org/t/p/w500/${filme.poster_path}`} alt={filme.title} />
                            <div className={styles.overlay}>
                                <strong>{filme.title}</strong>
                                <div className={styles.actions}>
                                    <Link to={`/filme/${filme.id}`} className={styles.btn}>Ver detalhes</Link>
                                    <button onClick={() => excluirFilme(filme.id)} className={`${styles.btn} ${styles.btnExclude}`}>Excluir</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

export default Favoritos;