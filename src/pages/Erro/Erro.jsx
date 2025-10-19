import { Link } from 'react-router-dom';
import styles from './Erro.module.css';
import { motion } from 'framer-motion';

function Erro() {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3, ease: "easeInOut" }} >
            <h1>404</h1>
            <h2>Página Não Encontrada</h2>
            <Link to="/">Voltar para a Home</Link>
        </motion.div>
    );
}

export default Erro;