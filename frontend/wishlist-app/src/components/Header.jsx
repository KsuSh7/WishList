import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/Header.module.css';
import logo from '../assets/vec_full_black_lightstar.svg';
import { useAuth } from '../hooks/useAuth';

export default function Header() {
  const { user: authUser, isAuthenticated, logout, loading } = useAuth() || {};
  const navigate = useNavigate();

  if (loading) {
    console.log('HEADER still loading...');
    return null;
  }

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/');
  };
  console.log('HEADER authUser:', authUser);
  console.log(
    'Full avatar URL:',
    `${import.meta.env.VITE_API_URL}${authUser?.avatar}`
  );

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

            <Link to="/user" className={styles.icon}>
              {authUser?.avatar ? (
                <img
                  src={`${import.meta.env.VITE_API_URL}${authUser.avatar}`}
                  alt="avatar"
                  className={styles.avatarImage}
                />
              ) : (
                <span className={styles.placeholder}></span>
              )}
            </Link>
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
