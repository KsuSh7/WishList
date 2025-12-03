import styles from '../styles/NotFound.module.css';
import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <h1>Oops...</h1>
        <p>Wish there was a page like this</p>
        <Link to="/">
          <button>Back on the main</button>
        </Link>
      </div>
    </div>
  );
}
