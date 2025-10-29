import { Link } from 'react-router-dom';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.block}>
        <h1 className={styles.title}>Make a Wish</h1>
        <p className={styles.subtitle}>
          No more guessing gifts — build your wishlist, share it with friends
          and family, and turn your wishes into reality
        </p>
        <Link to="/auth">
          <button className={styles.button}>Let's go</button>
        </Link>
      </div>
    </div>
  );
}
