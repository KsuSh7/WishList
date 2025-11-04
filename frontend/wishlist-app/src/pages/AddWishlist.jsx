import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/AddWishlist.module.css';

export default function AddWishlist() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:5000/wishlists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    })
      .then((res) => res.json())
      .then((newWishlist) => {
        navigate(`/add-item?wishlistId=${newWishlist.id}`);
      })
      .catch((err) => console.error('Error adding wishlist:', err));
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <div className={styles.coverCard}>
          <div className={styles.coverImage}></div>
          <button className={styles.coverButton}>Upload cover</button>
        </div>
      </div>

      <form className={styles.rightColumn} onSubmit={handleSubmit}>
        <h2>Make a Wish</h2>

        <div className={styles.inputGroup}>
          <label htmlFor="title">Give a name to your wishlist</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label htmlFor="description">Add a caption</label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button type="submit" className={styles.addItemButton}>
          Add Item
        </button>
        <Link to="/user" className={styles.backLink}>
          Back
        </Link>
      </form>
    </div>
  );
}
