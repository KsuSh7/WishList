import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/UserPage.module.css';
import LeftArrow from '../assets/leftArrow.svg';
import RightArrow from '../assets/rightArrow.svg';
import SpinnerIcon from '../assets/spinner.svg';
import { useAuth } from '../hooks/useAuth';
import useFetchData from '../hooks/useFetchData';

export default function UserPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3;

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate('/auth');
  }, [loading, isAuthenticated]);

  const {
    data: wishlists = [],
    loading: wishlistsLoading,
    error,
  } = useFetchData(user ? `${import.meta.env.VITE_API_URL}/wishlists` : null);

  if (loading || !user || wishlistsLoading) {
    return (
      <div className={styles.loadingContainer}>
        <img src={SpinnerIcon} alt="loading" className={styles.svgSpinner} />
      </div>
    );
  }

  const userWishlists = wishlists.filter((wl) => wl.user_id === user.id);
  const handlePrev = () => setStartIndex((prev) => Math.max(prev - 1, 0));
  const handleNext = () =>
    setStartIndex((prev) =>
      Math.min(prev + 1, Math.max(0, userWishlists.length - visibleCount))
    );

  const visibleWishlists = userWishlists.slice(
    startIndex,
    startIndex + visibleCount
  );
  const showArrows = userWishlists.length > visibleCount;

  const handleShare = () => {
    navigator.clipboard
      .writeText(window.location.origin + '/user')
      .then(() => alert('Link copied!'))
      .catch(() => alert('Failed to copy'));
  };

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
          <h2>{user.username}'s page</h2>
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
