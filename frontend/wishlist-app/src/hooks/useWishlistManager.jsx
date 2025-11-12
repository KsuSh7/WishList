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

    let currentWishlistId = wishlistId || Date.now() + Math.random();
    let updatedWishlist = { id: currentWishlistId, title, description };

    try {
      if (wishlistId === undefined) {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/wishlists`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description }),
        });
        if (!res.ok) throw new Error('Server not available');
        updatedWishlist = await res.json();
        currentWishlistId = updatedWishlist.id;
      }

      const savedItems = [];
      for (const item of items) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...item, wishlistId: currentWishlistId }),
          });
          if (!res.ok) throw new Error();
          savedItems.push(await res.json());
        } catch {
          savedItems.push({
            ...item,
            id: Date.now() + Math.random(),
            wishlistId: currentWishlistId,
          });
        }
      }

      localStorage.setItem(
        `wishlist-${currentWishlistId}`,
        JSON.stringify(updatedWishlist)
      );
      localStorage.setItem(
        `items-${currentWishlistId}`,
        JSON.stringify(savedItems)
      );

      const allWishlists = JSON.parse(
        localStorage.getItem('wishlists') || '[]'
      );
      if (!allWishlists.find((wl) => wl.id === currentWishlistId)) {
        allWishlists.push(updatedWishlist);
      }
      localStorage.setItem('wishlists', JSON.stringify(allWishlists));

      return { wishlist: updatedWishlist, items: savedItems };
    } catch (err) {
      setError('Server not available — saved locally.');
      localStorage.setItem(
        `wishlist-${currentWishlistId}`,
        JSON.stringify(updatedWishlist)
      );
      localStorage.setItem(`items-${currentWishlistId}`, JSON.stringify(items));

      const allWishlists = JSON.parse(
        localStorage.getItem('wishlists') || '[]'
      );
      if (!allWishlists.find((wl) => wl.id === currentWishlistId)) {
        allWishlists.push(updatedWishlist);
      }
      localStorage.setItem('wishlists', JSON.stringify(allWishlists));

      return { wishlist: updatedWishlist, items };
    } finally {
      setLoading(false);
    }
  };

  return { createOrUpdateWishlist, loading, error };
}
