import styles from '../styles/UserPage.module.css';

export default function UserPage() {
  return (
    <div className={styles.container}>
      <div className={styles.profile}>
        <img src="https://via.placeholder.com/100" alt="avatar" className={styles.avatar} />
        <div>
          <h2>Username</h2>
          <p>Wishlists: 3</p>
        </div>
        <div className={styles.actions}>
          <button>Create new</button>
          <button>Share wishlist</button>
        </div>
      </div>

      <div className={styles.gallery}>
        <button className={styles.arrow}>←</button>
        <div className={styles.wishlistList}>
          <div className={styles.wishlistCard}>Wishlist 1</div>
          <div className={styles.wishlistCard}>Wishlist 2</div>
          <div className={styles.wishlistCard}>Wishlist 3</div>
        </div>
        <button className={styles.arrow}>→</button>
      </div>
    </div>
  );
}
