import styles from '../styles/WishlistPage.module.css';

export default function WishlistPage() {
  return (
    <div className={styles.container}>
      <h2>My Wishlist</h2>
      <div className={styles.itemsGrid}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={styles.itemCard}>
            <div className={styles.itemImage}>🛍️</div>
            <div className={styles.itemButtons}>
              <button>View</button>
              <button>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <button className={styles.deleteWishlist}>Delete Wishlist</button>
    </div>
  );
}
