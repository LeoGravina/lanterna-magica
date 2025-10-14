import { Link } from 'react-router-dom';
import styles from './Erro.module.css';
import { motion } from 'framer-motion';

function Erro() {
    return (
        <motion.div className={styles.notFound} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h1>404</h1>
            <h2>Página Não Encontrada</h2>
            <Link to="/">Voltar para a Home</Link>
        </motion.div>
    );
}

export default Erro;