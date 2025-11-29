import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/AddWishlist.module.css';
import useWishlistManager from '../hooks/useWishlistManager';

export default function AddItem() {
  const navigate = useNavigate();
  const location = useLocation();
  const { createOrUpdateWishlist, loading, error } = useWishlistManager();

  const { title, description, wishlist_id } = location.state || {};

  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [link, setLink] = useState('');

  const isValidUrl = (url) => {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  };

  const handleAddAnother = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Item name is required');
      return;
    }

    if (price.trim() && isNaN(Number(price))) {
      alert('Price must be a valid number');
      return;
    }

    if (link.trim() && !isValidUrl(link)) {
      alert('Please enter a valid URL (starting with http or https)');
      return;
    }

    setItems((prev) => [
      ...prev,
      { name, price: price.trim() ? Number(price) : 0, link },
    ]);

    setName('');
    setPrice('');
    setLink('');
  };

  const handleDone = async (e) => {
    e.preventDefault();

    const finalItems = [...items];

    if (name.trim()) {
      finalItems.push({ name, price: price.trim() ? Number(price) : 0, link });
    }

    const result = await createOrUpdateWishlist({
      title,
      description,
      wishlist_id,
      items: finalItems,
    });

    if (result) {
      navigate(`/wishlist/${result.wishlist.id}`, { replace: true });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <div className={styles.coverCard}>
          <div className={styles.coverImage}></div>
          <button className={styles.coverButton}>Upload cover</button>
        </div>
      </div>

      <form className={styles.rightColumn}>
        <h2>Add an Item</h2>

        <div className={styles.inputGroupItems}>
          <label htmlFor="name">Enter item’s name</label>
          <input
            className={styles.itemsInput}
            id="name"
            type="text"
            placeholder="Apple Watch"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="price">Enter its price (optional)</label>
          <input
            className={styles.itemsInput}
            id="price"
            type="text"
            placeholder="199.99"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <label htmlFor="link">Paste a link (optional)</label>
          <input
            className={styles.itemsInput}
            id="link"
            type="text"
            placeholder="https://example.com/item"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>

        <div className={styles.buttonGroup}>
          <button onClick={handleAddAnother} className={styles.addItemButton}>
            Add more items
          </button>

          <button
            onClick={handleDone}
            className={styles.addFinalItemButton}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Done'}
          </button>
        </div>

        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </form>
    </div>
  );
}
