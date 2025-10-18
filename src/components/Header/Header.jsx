// src/components/Header/Header.jsx (Final com Ícones no Dropdown)
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { BiSearchAlt2 } from 'react-icons/bi';
import { auth } from '../../firebase/firebase.js';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import { FaUserCircle, FaChevronDown, FaFilm, FaRegUser, FaStar, FaSignOutAlt } from 'react-icons/fa'; // Ícones Importados
import { GiLantern } from 'react-icons/gi';

function Header() {
    const [searchQuery, setSearchQuery] = useState("");
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);
    
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!searchQuery) return;
        navigate(`/search?q=${searchQuery}`);
        setSearchQuery("");
    };
    
    const handleLogout = async () => {
        await signOut(auth);
        toast.info("Você saiu da sua conta.");
        navigate('/login');
    };

    return (
        <header className={styles.header}>
            <div className={styles.headerLeft}>
                <div className={styles.logoContainer}>
                    <Link className={styles.logoLink} to="/">
                        <span className={styles.logoText}>LANTERNA MÁGICA</span>
                        <GiLantern className={styles.logoIcon} size={32} />
                    </Link>
                    <p className={styles.tooltip}>
                        Uma homenagem aos primórdios do cinema, sugerindo descoberta e encanto.
                    </p>
                </div>
            </div>

            <div className={styles.headerCenter}>
                <form className={styles.searchForm} onSubmit={handleSubmit}>
                    <input type="text" placeholder="Buscar por um filme..." onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery} />
                    <button type="submit"><BiSearchAlt2 size={20} /></button>
                </form>
            </div>

            <div className={styles.headerRight}>
                <div className={styles.userActions}>
                    {user ? (
                        <div className={styles.userDropdown} ref={dropdownRef}>
                            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className={styles.dropdownButton}>
                                <FaUserCircle size={28} />
                                <span className={styles.userName}>Olá, {user.displayName?.split(' ')[0]}</span>
                                <FaChevronDown size={14} className={`${styles.chevron} ${isDropdownOpen ? styles.chevronOpen : ''}`} />
                            </button>

                            {isDropdownOpen && (
                                <div className={styles.dropdownMenu}>
                                    <Link to="/" className={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}><FaFilm />Em Cartaz</Link>
                                    <Link to="/perfil" className={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}><FaRegUser />Perfil</Link>
                                    <Link to="/favoritos" className={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}><FaStar />Meus Filmes</Link>
                                    <button onClick={handleLogout} className={`${styles.dropdownItem} ${styles.logoutButton}`}><FaSignOutAlt />Sair</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link className={styles.actionButton} to="/login">Login</Link>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;