import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/UserPage.module.css';
import LeftArrow from '../assets/leftArrow.svg';
import RightArrow from '../assets/rightArrow.svg';
import SpinnerIcon from '../assets/spinner.svg';
import { useAuth } from '../hooks/useAuth';
import useFetchData from '../hooks/useFetchData';

export default function UserPage() {
  const { user: authUser, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3;

  const searchParams = new URLSearchParams(location.search);
  const shareId = searchParams.get('share_id');
  const ownerView = !shareId || (authUser && authUser.id === shareId);
  const userIdToFetch = shareId || (authUser ? authUser.id : null);

  const fetchUrl = userIdToFetch
    ? `${import.meta.env.VITE_API_URL}/wishlists?user_id=${userIdToFetch}`
    : null;

  const {
    data: wishlists = [],
    loading: wishlistsLoading,
    error,
  } = useFetchData(fetchUrl);

  useEffect(() => {
    if (!loading && ownerView && !authUser) navigate('/auth');
  }, [loading, authUser]);

  if (loading || (ownerView && !authUser) || wishlistsLoading) {
    return (
      <div className={styles.loadingContainer}>
        <img src={SpinnerIcon} alt="loading" className={styles.svgSpinner} />
      </div>
    );
  }

  const userWishlists = wishlists;

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
    if (!authUser) return;
    const shareLink = `${window.location.origin}/user?share_id=${authUser.id}`;
    navigator.clipboard
      .writeText(shareLink)
      .then(() => alert('Link copied!'))
      .catch(() => alert('Failed to copy'));
  };

  return (
    <div className={styles.container}>
      <div className={styles.profile}>
        <div className={styles.avatarBlock}>
          <div className={styles.avatarPlaceholder}></div>
          {ownerView && authUser && (
            <a href="#" className={styles.uploadLink}>
              Add picture
            </a>
          )}
        </div>

        <div className={styles.userInfo}>
          <h2>
            {ownerView && authUser
              ? `${authUser.username}'s page`
              : "User's page"}
          </h2>
          <div className={styles.wishlistsInfo}>
            <p className={styles.count}>{userWishlists.length}</p>
            <p>Wishlists</p>
          </div>
        </div>

        {ownerView && authUser && (
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

      <h2>Wishlists</h2>

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
                <Link
                  to={`/wishlist/${wl.id}`}
                  className={styles.wishlistLink}
                  state={ownerView && authUser ? { wishlist: wl } : {}}
                >
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
