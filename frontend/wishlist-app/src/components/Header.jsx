import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/Header.module.css';
import logo from '../assets/vec_full_black_lightstar.svg';
import { useAuth } from '../hooks/useAuth';

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">
          <img src={logo} alt="Wish Logo" className={styles.logoImage} />
        </Link>
      </div>

      <nav className={styles.nav}>
        {isAuthenticated ? (
          <>
            <Link to="/" onClick={handleLogout} className={styles.navLink}>
              Logout
            </Link>
            <Link to="/user" className={styles.icon}></Link>
          </>
        ) : (
          <>
            <Link to="/auth" className={styles.navLink}>
              Login
            </Link>
            <Link to="/auth" className={styles.navLink}>
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
