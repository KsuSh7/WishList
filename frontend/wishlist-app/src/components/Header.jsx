import { Link } from 'react-router-dom';
import styles from '../styles/Header.module.css';
import logo from '../assets/vec_full_black_lightstar.svg';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src={logo} alt="Wish Logo" className={styles.logoImage} />
      </div>
      <nav className={styles.nav}>
        <Link to="/login" className={styles.navLink}>Login</Link>
        <Link to="/signup" className={styles.navLink}>Sign up</Link>
        <Link to="/user" className={styles.icon}></Link>
      </nav>
    </header>
  );
}
