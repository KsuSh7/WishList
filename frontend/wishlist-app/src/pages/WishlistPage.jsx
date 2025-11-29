import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import styles from '../styles/WishlistPage.module.css';
import TrashIcon from '../assets/trash.svg';
import { useAuth } from '../hooks/useAuth';
import useFetchData from '../hooks/useFetchData';
import SpinnerIcon from '../assets/spinner.svg';

export default function WishlistPage() {
  const { user: authUser } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL;

  const {
    data: wishlistFromServer = null,
    loading: wishlistLoading,
    error: wishlistError,
  } = useFetchData(`${API_URL}/wishlists/${id}`, `wishlist-${id}`, false);

  const {
    data: itemsFromServer = [],
    loading: itemsLoading,
    error: itemsError,
  } = useFetchData(`${API_URL}/items?wishlist_id=${id}`, `items-${id}`, false);

  const wishlist = location.state?.wishlist || wishlistFromServer;

  const [items, setItems] = useState([]);

  const offline = wishlistError || itemsError;

  useEffect(() => {
    if (itemsFromServer) {
      setItems(itemsFromServer);
    }
  }, [itemsFromServer]);

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
        Wishlist not found{offline ? ' (server unavailable)' : ''}
      </p>
    );
  }

  const ownerView = authUser && authUser.id === wishlist.user_id;

  async function handleDeleteItem(itemId) {
    try {
      const res = await fetch(`${API_URL}/items/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to delete item');
      }

      setItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Server unavailable, cannot delete item.');
    }
  }

  async function handleDeleteWishlist() {
    if (!window.confirm('Are you sure you want to delete this wishlist?'))
      return;

    try {
      const resWishlist = await fetch(`${API_URL}/wishlists/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!resWishlist.ok) throw new Error('Failed to delete wishlist');

      const resItems = await fetch(`${API_URL}/items?wishlist_id=${id}`, {
        credentials: 'include',
      });
      const relatedItems = await resItems.json();
      for (const item of relatedItems) {
        await fetch(`${API_URL}/items/${item.id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
      }

      navigate('/user');
    } catch (err) {
      console.error('Delete wishlist failed:', err);
      alert('Server unavailable, cannot delete wishlist.');
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
                  {ownerView && (
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
                    onClick={() =>
                      item.link && window.open(item.link, '_blank')
                    }
                    disabled={!item.link}
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

      {ownerView && (
        <div className={styles.buttonsGroup}>
          <Link
            to="/add-item"
            state={{
              wishlist_id: wishlist.id,
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
          Server unavailable — changes cannot be saved
        </p>
      )}
    </div>
  );
}
