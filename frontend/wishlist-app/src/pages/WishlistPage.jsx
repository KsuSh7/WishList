import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from '../styles/WishlistPage.module.css';
import TrashIcon from '../assets/trash.svg';
import { useAuth } from '../hooks/useAuth';

export default function WishlistPage() {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState(null);
  const [items, setItems] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/wishlists/${id}`)
      .then((res) => res.json())
      .then((data) => setWishlist(data))
      .catch((err) => console.error('Error loading wishlist:', err));

    fetch(`http://localhost:5000/items?wishlistId=${id}`)
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error('Error loading items:', err));
  }, [id]);

  if (!wishlist) return <p>Loading...</p>;

  function handleDeleteItem(itemId) {
    fetch(`http://localhost:5000/items/${itemId}`, { method: 'DELETE' })
      .then(() => setItems((prev) => prev.filter((i) => i.id !== itemId)))
      .catch((err) => console.error('Delete failed:', err));
  }

  function handleDeleteWishlist() {
    if (window.confirm('Are you sure you want to delete this wishlist?')) {
      fetch(`http://localhost:5000/wishlists/${id}`, { method: 'DELETE' })
        .then(() =>
          fetch(`http://localhost:5000/items?wishlistId=${id}`)
            .then((res) => res.json())
            .then((relatedItems) => {
              relatedItems.forEach((item) => {
                fetch(`http://localhost:5000/items/${item.id}`, {
                  method: 'DELETE',
                });
              });
            })
        )
        .then(() => navigate('/user'))
        .catch((err) => console.error('Delete wishlist failed:', err));
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{wishlist.title}</h2>
        <p className={styles.description}>{wishlist.description}</p>
      </div>

      <div className={styles.itemsGrid}>
        {items.map((item) => (
          <div key={item.id} className={styles.itemCard}>
            <div className={styles.itemImage}></div>
            <div className={styles.itemInfo}>
              <div className={styles.textBlock}>
                <p className={styles.itemName}>{item.name}</p>
                <p className={styles.itemPrice}>${item.price}</p>
              </div>
              <div className={styles.itemButtons}>
                {isAuthenticated && (
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <img
                      src={TrashIcon}
                      alt="Delete"
                      className={styles.trashIcon}
                    />
                  </button>
                )}
                <button
                  className={styles.viewButton}
                  onClick={() => window.open(item.link, '_blank')}
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isAuthenticated && (
        <div className={styles.buttonsGroup}>
          <Link
            to={'/add-item'}
            state={{
              wishlistId: id,
              title: wishlist.title,
              description: wishlist.description,
            }}
            className={styles.addItemButton}
          >
            <button>Add Items</button>
          </Link>

          <button
            className={styles.deleteWishlist}
            onClick={handleDeleteWishlist}
          >
            Delete Wishlist
          </button>
        </div>
      )}
    </div>
  );
}
