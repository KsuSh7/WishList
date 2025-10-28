import { Link } from 'react-router-dom';
import styles from '../styles/Header.module.css';
import logo from '../assets/vec_full_black_lightstar.svg';

export default function Header() {
  const isAuthenticated = true;

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src={logo} alt="Wish Logo" className={styles.logoImage} />
      </div>

      <nav className={styles.nav}>
        {isAuthenticated ? (
          <>
            <Link to="/" className={styles.navLink}>
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
