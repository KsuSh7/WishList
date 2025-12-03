import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/UserPage.module.css';
import LeftArrow from '../assets/leftArrow.svg';
import RightArrow from '../assets/rightArrow.svg';
import SpinnerIcon from '../assets/spinner.svg';
import { useAuth } from '../hooks/useAuth';
import useFetchData from '../hooks/useFetchData';

export default function UserPage() {
  const { user: authUser, updateUser, loading } = useAuth() || {};
  const navigate = useNavigate();
  const location = useLocation();
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3;

  const searchParams = new URLSearchParams(location.search);
  const shareId = searchParams.get('share_id');

  const ownerView = !shareId && authUser;
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

  if (loading || wishlistsLoading) {
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

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/avatar`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      updateUser((prev) => ({ ...prev, avatar: data.avatar }));

      alert('Avatar updated!');
    } catch (err) {
      console.error(err);
      alert('Failed to upload avatar');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.profile}>
        <div className={styles.avatarBlock}>
          {userIdToFetch && userIdToFetch === (authUser?.id || shareId) ? (
            authUser?.avatar ? (
              <img
                src={`${import.meta.env.VITE_API_URL}${authUser.avatar}`}
                alt="avatar"
                className={styles.avatarImage}
              />
            ) : (
              <div className={styles.avatarPlaceholder}></div>
            )
          ) : (
            <div className={styles.avatarPlaceholder}></div>
          )}

          {ownerView && authUser && (
            <>
              <a
                href="#"
                className={styles.uploadLink}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('avatarInput').click();
                }}
              >
                Add picture
              </a>
              <input
                type="file"
                id="avatarInput"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
              />
            </>
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
                  {wl.cover ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL}${wl.cover}`}
                      alt={wl.title}
                      className={styles.wishlistImage}
                    />
                  ) : (
                    <div className={styles.coverPlaceholder}></div>
                  )}
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
