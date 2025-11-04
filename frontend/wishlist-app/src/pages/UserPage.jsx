import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/UserPage.module.css';
import LeftArrow from '../assets/leftArrow.svg';
import RightArrow from '../assets/rightArrow.svg';
import { useAuth } from '../hooks/useAuth';

export default function UserPage() {
  const { isAuthenticated, user } = useAuth();
  const [wishlists, setWishlists] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3;

  useEffect(() => {
    fetch('http://localhost:5000/wishlists')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load wishlists');
        return res.json();
      })
      .then((data) => setWishlists(data))
      .catch((err) => console.error(err));
  }, []);

  const handlePrev = () => setStartIndex((prev) => Math.max(prev - 1, 0));
  const handleNext = () =>
    setStartIndex((prev) =>
      Math.min(prev + 1, Math.max(0, wishlists.length - visibleCount))
    );

  const handleShare = () => {
    const baseUrl = window.location.origin;
    const shareLink = `${baseUrl}/user/${user?.id || 'guest'}/public`;

    navigator.clipboard
      .writeText(shareLink)
      .then(() => alert('Link copied to clipboard!'))
      .catch(() => alert('Failed to copy link'));
  };

  const visibleWishlists = wishlists.slice(
    startIndex,
    startIndex + visibleCount
  );

  return (
    <div className={styles.container}>
      <div className={styles.profile}>
        <div className={styles.avatarBlock}>
          <div className={styles.avatarPlaceholder}></div>
          {isAuthenticated && (
            <a href="#" className={styles.uploadLink}>
              Add picture
            </a>
          )}
        </div>

        <div className={styles.userInfo}>
          <h2>User's page</h2>
          <div className={styles.wishlistsInfo}>
            <p className={styles.count}>{wishlists.length}</p>
            <p>Wishlists</p>
          </div>
        </div>

        {isAuthenticated && (
          <div className={styles.actions}>
            <Link to="/add-wishlist">
              <button className={styles.newButton}>Make a new wish</button>
            </Link>
            <button className={styles.shareButton} onClick={handleShare}>
              Share my page
            </button>
          </div>
        )}
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
              <p className={styles.wishlistLabel}>{wl.title}</p>
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
