import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/AddWishlist.module.css';

export default function AddWishlist() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCoverFile(file);
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleNext = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    navigate('/add-item', {
      state: {
        title,
        description,
        coverFile,
      },
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <div className={styles.coverCard}>
          <div className={styles.coverImage}>
            {coverPreview ? (
              <img
                src={coverPreview}
                alt="Preview"
                className={styles.coverPreview}
              />
            ) : (
              <div className={styles.coverPlaceholder}></div>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            id="coverInput"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          <button
            type="button"
            className={styles.coverButton}
            onClick={() => document.getElementById('coverInput').click()}
          >
            Upload cover
          </button>
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
          Add Items
        </button>

        <Link to="/user" className={styles.backLink}>
          Back
        </Link>
      </form>
    </div>
  );
}
