import { useState } from 'react';

export default function useWishlistManager() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOrUpdateWishlist = async ({
    title,
    description,
    wishlistId,
    items,
  }) => {
    setLoading(true);
    setError(null);

    try {
      let currentWishlistId = wishlistId;

      if (!currentWishlistId) {
        const res = await fetch('http://localhost:5000/wishlists', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description }),
        });
        const newWishlist = await res.json();
        currentWishlistId = newWishlist.id;
      }

      for (const item of items) {
        await fetch('http://localhost:5000/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...item, wishlistId: currentWishlistId }),
        });
      }

      return currentWishlistId;
    } catch (err) {
      setError(err);
      console.error('Error creating/updating wishlist:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createOrUpdateWishlist, loading, error };
}
