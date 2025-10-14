import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { BiSearchAlt2 } from 'react-icons/bi'; // Importando o ícone de busca

function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault(); // Previne o recarregamento da página
        if (!searchQuery) return; // Não faz nada se a busca estiver vazia
        navigate(`/search?q=${searchQuery}`);
        setSearchQuery(""); // Limpa o campo de busca após pesquisar
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}>
            <Link className={styles.logo} to="/">Prime Flix</Link>

            <form className={styles.searchForm} onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Buscar por um filme..."
                    onChange={(e) => setSearchQuery(e.target.value)}
                    value={searchQuery}
                />
                <button type="submit">
                    <BiSearchAlt2 size={20} />
                </button>
            </form>

            <Link className={styles.favoritosBtn} to="/favoritos">Meus Filmes</Link>
        </header>
    );
}

export default Header;