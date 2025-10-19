// src/components/ScrollArrow/ScrollArrow.jsx (Final com Scroll Suave)
import { useState, useEffect } from 'react';
import styles from './ScrollArrow.module.css';
import { FaChevronDown } from 'react-icons/fa';
import { Link } from 'react-scroll'; // 1. Importa o Link da nova biblioteca

function ScrollArrow() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // A função manual de scroll foi removida, a biblioteca cuida de tudo!

    return (
        // 2. Substitui o <button> pelo <Link> da react-scroll
        <Link
            to="page-footer" // O ID do nosso alvo (o footer)
            smooth={true}     // Ativa a animação suave
            duration={800}    // Duração da animação em milissegundos (ajuste a gosto)
            className={`${styles.arrowContainer} ${!isVisible ? styles.hidden : ''}`}
            aria-label="Rolar para o final da página"
        >
            <FaChevronDown size={28} className={styles.blinkingArrow} />
        </Link>
    );
}

export default ScrollArrow;