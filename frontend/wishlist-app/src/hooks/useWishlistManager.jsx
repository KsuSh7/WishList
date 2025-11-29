import { useState } from 'react';
import { useAuth } from './useAuth';

export default function useWishlistManager() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOrUpdateWishlist = async ({
    title,
    description,
    wishlist_id,
    items,
  }) => {
    setLoading(true);
    setError(null);

    try {
      let savedWishlist;

      // CREATE
      if (!wishlist_id) {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/wishlists`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description }),
        });

        if (!res.ok) throw new Error('Wishlist creation failed');
        savedWishlist = await res.json();
      }

      // UPDATE
      else {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/wishlists/${wishlist_id}`,
          {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description }),
          }
        );

        if (!res.ok) throw new Error('Wishlist update failed');
        savedWishlist = await res.json();
      }

      if (!savedWishlist?.id) throw new Error('Wishlist response missing id');

      // SAVE ITEMS
      const savedItems = [];
      if (Array.isArray(items) && items.length > 0) {
        for (const item of items) {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/items`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              wishlist_id: savedWishlist.id,
              name: item.name,
              price: Number(item.price) || 0,
              link: item.link,
            }),
          });

          if (res.ok) savedItems.push(await res.json());
        }
      }

      return { wishlist: savedWishlist, items: savedItems };
    } catch (err) {
      console.error(err);
      setError(err.message || 'Server unavailable');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createOrUpdateWishlist, loading, error };
}
