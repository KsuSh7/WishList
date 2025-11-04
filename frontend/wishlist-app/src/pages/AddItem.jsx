import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/AddWishlist.module.css';
import useWishlistManager from '../hooks/useWishlistManager';

export default function AddItem() {
  const navigate = useNavigate();
  const location = useLocation();
  const { createOrUpdateWishlist, loading, error } = useWishlistManager();

  const { title, description, wishlistId } = location.state || {};
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [link, setLink] = useState('');

  const handleAddAnother = (e) => {
    e.preventDefault();
    if (!name.trim() || !price.trim() || !link.trim()) return;

    setItems((prev) => [...prev, { name, price, link }]);
    setName('');
    setPrice('');
    setLink('');
  };

  const handleDone = async (e) => {
    e.preventDefault();
    const finalItems = [...items];
    if (name.trim() && price.trim() && link.trim()) {
      finalItems.push({ name, price, link });
    }

    const id = await createOrUpdateWishlist({
      title,
      description,
      wishlistId,
      items: finalItems,
    });
    if (id) navigate(`/wishlist/${id}`);
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
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="price">Enter its price</label>
          <input
            className={styles.itemsInput}
            id="price"
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <label htmlFor="link">Paste a link to your item</label>
          <input
            className={styles.itemsInput}
            id="link"
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>

        <div className={styles.buttonGroup}>
          <button onClick={handleAddAnother}>Add more items</button>
          <button onClick={handleDone} className={styles.addFinalItemButton}>
            Done
          </button>
        </div>
      </form>
    </div>
  );
}
