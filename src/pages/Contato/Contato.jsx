import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiPhone, FiLinkedin, FiGithub } from 'react-icons/fi';
import styles from './Contato.module.css';

function Contato() { // Nome da função corrigido para corresponder ao nome do arquivo
    const navigate = useNavigate();

    return (
        // Nome da classe corrigido de 'contatoContent' para 'contatoContent'
        <main className={styles.contatoContent}>
            <div className={styles.contatoCard}>
                <h1 className={styles.contatoTitle}>Leonardo Gravina Carlos</h1>
                <p className={styles.contatoSubtitle}>Desenvolvedor de Software</p>

                <div className={styles.contatoInfoList}>
                    <a href="mailto:leonardocarlos807@gmail.com" className={styles.contatoItem}>
                        <FiMail size={20} />
                        <span>leonardocarlos807@gmail.com</span>
                    </a>
                    <a href="https://wa.me/5532984057124" target="_blank" rel="noopener noreferrer" className={styles.contatoItem}>
                        <FiPhone size={20} />
                        <span>(32) 98405-7124</span>
                    </a>
                    <a href="https://www.linkedin.com/in/leonardo-gravina-a770bb237" target="_blank" rel="noopener noreferrer" className={styles.contatoItem}>
                        <FiLinkedin size={20} />
                        <span>LinkedIn</span>
                    </a>
                    <a href="https://github.com/LeoGravina" target="_blank" rel="noopener noreferrer" className={styles.contatoItem}>
                        <FiGithub size={20} />
                        <span>GitHub</span>
                    </a>
                </div>

                <button className={styles.backButton} onClick={() => navigate(-1)}>
                    Voltar
                </button>
            </div>
        </main>
    );
}

export default Contato; // Export corrigido