import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { MainLayout } from './components/Layout/index.jsx';
import Home from './pages/Home/Home.jsx';
import Filme from './pages/Filme/Filme.jsx';
import Favoritos from './pages/Favoritos/Favoritos.jsx';
import Erro from './pages/Erro/Erro.jsx';
import Search from './pages/Search/Search.jsx'; // 1. Importe a nova página

function RoutesApp() {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/filme/:id" element={<Filme />} />
                    <Route path="/favoritos" element={<Favoritos />} />
                    <Route path="/search" element={<Search />} /> {/* 2. Adicione a nova rota */}
                </Route>
                <Route path="*" element={<Erro />} />
            </Routes>
        </AnimatePresence>
    );
}

export default RoutesApp;