import { useState } from 'react';
import styles from '../styles/Auth.module.css';
import { Link } from "react-router-dom";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className={styles.authContainer}>
      <div className={styles.formBox}>
        <h2>{isLogin ? 'Login' : 'Sigh Up'}</h2>

        {!isLogin && (
          <div className={styles.inputGroup}>
            <label>Username</label>
            <input type="text" />
          </div>
        )}

        <div className={styles.inputGroup}>
          <label>Email</label>
          <input type="email" />
        </div>

        <div className={styles.inputGroup}>
          <label>Password</label>
          <input type="password" />
        </div>

        <div className={styles.buttonsGroup}>
            <Link to="/user">
                <button>Let's go</button>
            </Link>

            <p>
            {isLogin ? 'No account?' : 'Already have an account?'}{' '}
            <span onClick={() => setIsLogin(!isLogin)} className={styles.toggle}>
                {isLogin ? 'Sign up here' : 'Login here'}
            </span>
            </p>
        </div>
      </div>
    </div>
  );
}
