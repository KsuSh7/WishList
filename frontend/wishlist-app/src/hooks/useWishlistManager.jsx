import { useState } from 'react';
import { useAuth } from './useAuth';

export default function useWishlistManager() {
  const { user } = useAuth();
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
      let savedWishlist;

      if (!wishlistId) {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/wishlists`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          body: JSON.stringify({ title, description, userId: user.id }),
        });

        if (!res.ok) throw new Error();
        savedWishlist = await res.json();
      } else {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/wishlists/${wishlistId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
            body: JSON.stringify({ title, description }),
          }
        );

        if (!res.ok) throw new Error();
        savedWishlist = await res.json();
      }

      const savedItems = [];

      for (const item of items) {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/items`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          body: JSON.stringify({
            ...item,
            wishlistId: savedWishlist.id,
            userId: user.id,
          }),
        });

        if (res.ok) savedItems.push(await res.json());
      }

      return { wishlist: savedWishlist, items: savedItems };
    } catch (err) {
      setError('Server unavailable');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createOrUpdateWishlist, loading, error };
}
