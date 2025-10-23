import logo from '../assets/react.svg';
import styles from '../styles/BackgroundLogo.module.css';

export default function BackgroundLogo() {
  return <img src={logo} alt="background logo" className={styles.bgLogo} />;
}
