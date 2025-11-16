import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import styles from '../styles/WishlistPage.module.css';
import TrashIcon from '../assets/trash.svg';
import { useAuth } from '../hooks/useAuth';
import useFetchData from '../hooks/useFetchData';
import SpinnerIcon from '../assets/spinner.svg';

export default function WishlistPage() {
  const { isAuthenticated } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL;

  const {
    data: wishlistFromServer = null,
    loading: wishlistLoading,
    error: wishlistError,
  } = useFetchData(`${API_URL}/wishlists/${id}`, `wishlist-${id}`);

  const {
    data: itemsFromServer = [],
    loading: itemsLoading,
    error: itemsError,
  } = useFetchData(`${API_URL}/items?wishlistId=${id}`, `items-${id}`);

  const wishlist = location.state?.wishlist || wishlistFromServer;

  const [items, setItems] = useState([]);

  const offline = wishlistError || itemsError;

  useEffect(() => {
    if (!location.state?.items && itemsFromServer) {
      setItems(itemsFromServer);
    }
    if (location.state?.items) {
      setItems(location.state.items);
    }
  }, [itemsFromServer, location.state]);

  if (wishlistLoading || itemsLoading) {
    return (
      <div className={styles.loadingContainer}>
        <img src={SpinnerIcon} className={styles.svgSpinner} alt="loading" />
      </div>
    );
  }

  if (!wishlist) {
    return (
      <p style={{ color: 'red', textAlign: 'center' }}>
        Wishlist not found{offline ? ' (offline, showing cached data)' : ''}
      </p>
    );
  }

  async function handleDeleteItem(itemId) {
    if (offline) {
      const updatedItems = items.filter((item) => item.id !== itemId);
      setItems(updatedItems);
      localStorage.setItem(`items-${id}`, JSON.stringify(updatedItems));
      return;
    }

    try {
      await fetch(`${API_URL}/items/${itemId}`, { method: 'DELETE' });
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  }

  async function handleDeleteWishlist() {
    if (!window.confirm('Are you sure you want to delete this wishlist?'))
      return;

    if (offline) {
      localStorage.removeItem(`wishlist-${id}`);
      localStorage.removeItem(`items-${id}`);
      const allWishlists = JSON.parse(
        localStorage.getItem('wishlists') || '[]'
      ).filter((wl) => wl.id !== id);
      localStorage.setItem('wishlists', JSON.stringify(allWishlists));
      navigate('/user');
      return;
    }

    try {
      await fetch(`${API_URL}/wishlists/${id}`, { method: 'DELETE' });

      const res = await fetch(`${API_URL}/items?wishlistId=${id}`);
      const relatedItems = await res.json();
      for (const item of relatedItems) {
        await fetch(`${API_URL}/items/${item.id}`, { method: 'DELETE' });
      }

      navigate('/user');
    } catch (err) {
      console.error('Delete wishlist failed:', err);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{wishlist.title}</h2>
        <p className={styles.description}>{wishlist.description}</p>
      </div>

      <div className={styles.itemsGrid}>
        {items.length > 0 ? (
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

      {offline && (
        <p style={{ color: 'red', marginTop: '10px' }}>
          Offline mode — changes only in local storage
        </p>
      )}
    </div>
  );
}
