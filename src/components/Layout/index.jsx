// src/components/Layout/index.jsx (Código completo e corrigido)
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';
import styles from './Layout.module.css'; // 1. Importe o novo CSS

export function MainLayout() {
  return (
    // 2. Adicione o wrapper principal
    <div className={styles.layoutWrapper}>
      <Header />
      {/* 3. Aplique a classe para o conteúdo principal crescer */}
      <main className={styles.mainContent}>
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
}