import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from '../styles/WishlistPage.module.css';
import TrashIcon from '../assets/trash.svg';
import { useAuth } from '../hooks/useAuth';
import useFetchData from '../hooks/useFetchData';

export default function WishlistPage() {
  const { isAuthenticated } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: wishlist,
    loading: wishlistLoading,
    error: wishlistError,
  } = useFetchData(`http://localhost:5000/wishlists/${id}`);

  const {
    data: items,
    loading: itemsLoading,
    error: itemsError,
  } = useFetchData(`http://localhost:5000/items?wishlistId=${id}`);

  if (wishlistLoading || itemsLoading) return <p>Loading...</p>;
  if (wishlistError || itemsError)
    return <p>Error loading data: {wishlistError || itemsError}</p>;
  if (!wishlist) return <p>Wishlist not found</p>;

  async function handleDeleteItem(itemId) {
    try {
      await fetch(`http://localhost:5000/items/${itemId}`, {
        method: 'DELETE',
      });
      window.location.reload();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  }

  async function handleDeleteWishlist() {
    if (window.confirm('Are you sure you want to delete this wishlist?')) {
      try {
        await fetch(`http://localhost:5000/wishlists/${id}`, {
          method: 'DELETE',
        });

        const res = await fetch(`http://localhost:5000/items?wishlistId=${id}`);
        const relatedItems = await res.json();
        for (const item of relatedItems) {
          await fetch(`http://localhost:5000/items/${item.id}`, {
            method: 'DELETE',
          });
        }

        navigate('/user');
      } catch (err) {
        console.error('Delete wishlist failed:', err);
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{wishlist.title}</h2>
        <p className={styles.description}>{wishlist.description}</p>
      </div>

      <div className={styles.itemsGrid}>
        {items && items.length > 0 ? (
          items.map((item) => (
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
          ))
        ) : (
          <p className={styles.noItems}>No items yet</p>
        )}
      </div>

      {isAuthenticated && (
        <div className={styles.buttonsGroup}>
          <Link
            to="/add-item"
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
