import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/AddWishlist.module.css';
import useWishlistManager from '../hooks/useWishlistManager';

export default function AddItem() {
  const navigate = useNavigate();
  const location = useLocation();
  const { title, description, coverFile, wishlist_id } = location.state || {};

  const { createOrUpdateWishlist, loading, error } = useWishlistManager();

  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [link, setLink] = useState('');
  const [itemCoverFile, setItemCoverFile] = useState(null);
  const [itemCoverPreview, setItemCoverPreview] = useState(null);

  const handleItemCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setItemCoverFile(file);
    setItemCoverPreview(URL.createObjectURL(file));
  };

  const handleAddAnother = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert('Item name is required');
    if (price.trim() && isNaN(Number(price)))
      return alert('Price must be a number');

    setItems((prev) => [
      ...prev,
      {
        name,
        price: price ? Number(price) : 0,
        link,
        imageFile: itemCoverFile || null,
      },
    ]);

    setName('');
    setPrice('');
    setLink('');
    setItemCoverFile(null);
    setItemCoverPreview(null);
  };

  const handleDone = async (e) => {
    e.preventDefault();

    const finalItems = [...items];
    if (name.trim()) {
      finalItems.push({
        name,
        price: price ? Number(price) : 0,
        link,
        imageFile: itemCoverFile || null,
      });
    }

    const result = await createOrUpdateWishlist({
      title,
      description,
      wishlist_id,
      items: finalItems,
      wishlistCover: coverFile || null,
    });

    if (result) {
      navigate(`/wishlist/${result.wishlist.id}`);
    } else {
      alert('Saving failed: ' + (error || 'unknown'));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <div className={styles.coverCard}>
          {itemCoverPreview ? (
            <img
              src={itemCoverPreview}
              alt="Item cover preview"
              className={styles.coverImage}
            />
          ) : (
            <div className={styles.coverImage}></div>
          )}

          <input
            type="file"
            accept="image/*"
            id="itemCoverInput"
            style={{ display: 'none' }}
            onChange={handleItemCoverChange}
          />

          <button
            className={styles.coverButton}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('itemCoverInput').click();
            }}
          >
            Upload item cover
          </button>
        </div>
      </div>

      <form className={styles.rightColumn}>
        <h2>Add an Item</h2>

        <div className={styles.inputGroupItems}>
          <label>Item name</label>
          <input
            data-testid="item-name"
            className={styles.itemsInput}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Price (optional)</label>
          <input
            data-testid="item-price"
            className={styles.itemsInput}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <label>Link (optional)</label>
          <input
            data-testid="item-link"
            className={styles.itemsInput}
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

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}
