import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/AddWishlist.module.css';

export default function AddItem() {
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleCreateOrUpdateWishlist = async (e) => {
    e.preventDefault();

    try {
      const finalItems = [...items];
      if (name.trim() && price.trim() && link.trim()) {
        finalItems.push({ name, price, link });
      }

      let currentWishlistId = wishlistId;

      // Якщо створюємо новий wishlist (наприклад, прийшли з AddWishlist)
      if (!currentWishlistId) {
        const res = await fetch('http://localhost:5000/wishlists', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description }),
        });
        const newWishlist = await res.json();
        currentWishlistId = newWishlist.id;
      }

      // Додаємо айтеми до вішліста
      for (const item of finalItems) {
        await fetch('http://localhost:5000/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...item, wishlistId: currentWishlistId }),
        });
      }

      navigate(`/wishlist/${currentWishlistId}`);
    } catch (err) {
      console.error('Error creating/updating wishlist:', err);
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
          <button
            onClick={handleCreateOrUpdateWishlist}
            className={styles.addFinalItemButton}
          >
            Done
          </button>
        </div>
      </form>
    </div>
  );
}
