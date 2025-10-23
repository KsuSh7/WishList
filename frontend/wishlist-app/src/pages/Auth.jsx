import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Auth.module.css';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className={styles.authContainer}>
      <div className={styles.formBox}>
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        {!isLogin && <input type="text" placeholder="Username" />}
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button>{isLogin ? 'Login' : 'Register'}</button>
        <p>
          {isLogin ? 'No account?' : 'Already have an account?'}{' '}
          <span onClick={() => setIsLogin(!isLogin)} className={styles.toggle}>
            {isLogin ? 'Register here' : 'Login here'}
          </span>
        </p>
      </div>
    </div>
  );
}
