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

      if (wishlist_id) {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/wishlists/${wishlist_id}`,
          {
            credentials: 'include',
          }
        );
        if (res.ok) {
          savedWishlist = await res.json();
        } else if (res.status === 404) {
          wishlist_id = null;
        } else {
          throw new Error('Failed to check wishlist existence');
        }
      }

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
          else console.warn('Item not saved', item);
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
