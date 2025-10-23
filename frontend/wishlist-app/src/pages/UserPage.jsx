import { useState } from 'react';
import { Link } from 'react-router-dom'; // додано
import styles from '../styles/UserPage.module.css';
import LeftArrow from '../assets/leftArrow.svg';
import RightArrow from '../assets/rightArrow.svg';

export default function UserPage() {
  const [wishlists, setWishlists] = useState([
    { id: 1, name: 'Wishlist 1', description: 'This is a sample description for wishlist 1.' },
    { id: 2, name: 'Wishlist 2', description: 'This is a sample description for wishlist 2.' },
    { id: 3, name: 'Wishlist 3', description: 'This is a sample description for wishlist 3.' },
    { id: 4, name: 'Wishlist 4', description: 'This is a sample description for wishlist 4.' },
    { id: 5, name: 'Wishlist 5', description: 'This is a sample description for wishlist 5.' },
    { id: 6, name: 'Wishlist 6', description: 'This is a sample description for wishlist 6.' },
  ]);

  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3;

  const handlePrev = () => setStartIndex(prev => Math.max(prev - 1, 0));
  const handleNext = () => setStartIndex(prev => Math.min(prev + 1, wishlists.length - visibleCount));

  const visibleWishlists = wishlists.slice(startIndex, startIndex + visibleCount);

  return (
    <div className={styles.container}>
      <div className={styles.profile}>
        <div className={styles.avatarBlock}>
          <div className={styles.avatarPlaceholder}></div>
          <a href="#" className={styles.uploadLink}>Add picture</a>
        </div>

        <div className={styles.userInfo}>
          <h2>User's page</h2>
          <div className={styles.wishlistsInfo}>
            <p className={styles.count}>{wishlists.length}</p>
            <p>Wishlists</p>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.newButton}>Make a new wish</button>
          <button>Share my page</button>
        </div>
      </div>

      <h2>My wishlists</h2>
      <div className={styles.gallery}>
        <img
          src={LeftArrow}
          alt="Left"
          className={styles.arrowIcon}
          onClick={handlePrev}
        />

        <div className={styles.wishlistList}>
          {visibleWishlists.map((wl) => (
            <div key={wl.id} className={styles.wishlistCard}>
              <Link to={`/wishlist/${wl.id}`} className={styles.wishlistLink}>
                <div className={styles.wishlistImage}></div>
              </Link>
              <p className={styles.wishlistLabel}>{wl.name}</p>
              <p className={styles.wishlistDescription}>{wl.description}</p>
            </div>
          ))}
        </div>

        <img
          src={RightArrow}
          alt="Right"
          className={styles.arrowIcon}
          onClick={handleNext}
        />
      </div>
    </div>
  );
}
