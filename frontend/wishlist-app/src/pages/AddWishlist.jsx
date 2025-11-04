import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/AddWishlist.module.css';

export default function AddWishlist() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleNext = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }
    navigate('/add-item', { state: { title, description } });
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <div className={styles.coverCard}>
          <div className={styles.coverImage}></div>
          <button className={styles.coverButton}>Upload cover</button>
        </div>
      </div>

      <form className={styles.rightColumn} onSubmit={handleNext}>
        <h2>Make a Wish</h2>

        <div className={styles.inputGroup}>
          <label htmlFor="title">Give a name to your wishlist</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
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
