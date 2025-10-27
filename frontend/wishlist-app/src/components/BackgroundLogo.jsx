import styles from '../styles/BackgroundLogo.module.css';
import logo from '../assets/vec_darkstar.svg';

export default function BackgroundLogo() {
  return <img src={logo} alt="background logo" className={styles.bgLogo} />;
}
