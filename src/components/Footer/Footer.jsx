// src/components/Footer/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

function Footer() {
    return (
        <footer className={styles.mainFooter}>
            <div className={`container ${styles.footerContent}`}>
                <p>Desenvolvido por <strong>Leonardo Gravina Carlos</strong>.</p>
                <p>
                    Gostou do que viu e quer fazer um projeto? <Link to="/contato">Entre em contato</Link>.
                </p>
            </div>
        </footer>
    );
}

export default Footer;