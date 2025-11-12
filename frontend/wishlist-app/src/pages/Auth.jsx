import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Auth.module.css';
import { useAuth } from '../hooks/useAuth';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/;

    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    if (!passwordRegex.test(password)) {
      alert('Password must contain both letters and numbers');
      return;
    }

    try {
      await login(email, password);
      navigate('/user');
    } catch (err) {
      console.error('Login failed', err);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.formBox}>
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>

        {!isLogin && (
          <div className={styles.inputGroup}>
            <label>Username</label>
            <input type="text" required />
          </div>
        )}

        <div className={styles.inputGroup}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className={styles.buttonsGroup}>
          <button onClick={handleSubmit}>Let's go</button>

          <p>
            {isLogin ? 'No account?' : 'Already have an account?'}{' '}
            <span
              onClick={() => setIsLogin(!isLogin)}
              className={styles.toggle}
            >
              {isLogin ? 'Sign up here' : 'Login here'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
