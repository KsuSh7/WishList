import styles from '../styles/WishlistPage.module.css';
import TrashIcon from '../assets/trash.svg';

export default function WishlistPage() {
  const wishlist = {
    name: 'Wishlist 1',
    description: 'This is a sample description for wishlist 1.',
    items: [
      { id: 1, name: 'Item 1', price: '$25.00' },
      { id: 2, name: 'Item 2', price: '$18.50' },
      { id: 3, name: 'Item 3', price: '$40.00' },
      { id: 4, name: 'Item 4', price: '$12.00' },
      { id: 5, name: 'Item 5', price: '$55.00' },
      { id: 6, name: 'Item 6', price: '$30.00' },
    ],
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{wishlist.name}</h2>
        <p className={styles.description}>{wishlist.description}</p>
      </div>

      <div className={styles.itemsGrid}>
        {wishlist.items.map((item) => (
          <div key={item.id} className={styles.itemCard}>
            <div className={styles.itemImage}></div>
            <div className={styles.itemInfo}>
              <div className={styles.textBlock}>
                <p className={styles.itemName}>{item.name}</p>
                <p className={styles.itemPrice}>{item.price}</p>
              </div>
              <div className={styles.itemButtons}>
                <button className={styles.deleteButton}>
                  <img src={TrashIcon} alt="Delete" className={styles.trashIcon} />
                </button>
                <button className={styles.viewButton}>View</button>

              </div>
            </div>
          </div>
        ))}
      </div>

      <button className={styles.deleteWishlist}>Delete Wishlist</button>
    </div>
  );
}
