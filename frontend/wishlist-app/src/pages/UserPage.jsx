import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/UserPage.module.css';
import LeftArrow from '../assets/leftArrow.svg';
import RightArrow from '../assets/rightArrow.svg';
import { useAuth } from '../hooks/useAuth';
import useFetchData from '../hooks/useFetchData';
import SpinnerIcon from '../assets/spinner.svg';

export default function UserPage() {
  const { isAuthenticated, user } = useAuth();
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3;

  const {
    data: wishlists = [],
    loading,
    error,
  } = useFetchData(import.meta.env.VITE_API_URL + '/wishlists', 'wishlists');

  const userWishlists = wishlists.filter((wl) => wl.userId === user?.id);

  const handlePrev = () => setStartIndex((prev) => Math.max(prev - 1, 0));
  const handleNext = () =>
    setStartIndex((prev) =>
      Math.min(prev + 1, Math.max(0, userWishlists.length - visibleCount))
    );

  const handleShare = () => {
    const baseUrl = window.location.origin;
    const shareLink = `${baseUrl}/user`;
    navigator.clipboard
      .writeText(shareLink)
      .then(() => alert('Link copied to clipboard!'))
      .catch(() => alert('Failed to copy link'));
  };

  const visibleWishlists = userWishlists.slice(
    startIndex,
    startIndex + visibleCount
  );
  const showArrows = userWishlists.length > visibleCount;

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <img src={SpinnerIcon} className={styles.svgSpinner} alt="loading" />
      </div>
    );
  }

  if (error && userWishlists.length === 0)
    return (
      <p style={{ color: 'red', textAlign: 'center' }}>
        {error} (no cached data)
      </p>
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
          <h2>{user ? `${user.username}'s page` : "User's page"}</h2>
          <div className={styles.wishlistsInfo}>
            <p className={styles.count}>{userWishlists.length}</p>
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

      {userWishlists.length === 0 ? (
        <p className={styles.noWishlists}>There are no wishlists yet</p>
      ) : (
        <div className={styles.gallery}>
          {showArrows && (
            <img
              src={LeftArrow}
              alt="Left"
              className={styles.arrowIcon}
              onClick={handlePrev}
            />
          )}

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

          {showArrows && (
            <img
              src={RightArrow}
              alt="Right"
              className={styles.arrowIcon}
              onClick={handleNext}
            />
          )}
        </div>
      )}
    </div>
  );
}
