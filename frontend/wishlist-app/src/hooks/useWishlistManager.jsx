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
    items = [],
    wishlistCover = null,
  }) => {
    setLoading(true);
    setError(null);

    try {
      let savedWishlist = null;

      if (wishlist_id) {
        const resCheck = await fetch(
          `${import.meta.env.VITE_API_URL}/wishlists/${wishlist_id}`,
          {
            credentials: 'include',
          }
        );
        if (resCheck.ok) {
          savedWishlist = await resCheck.json();
        } else if (resCheck.status === 404) {
          wishlist_id = null;
        } else {
          throw new Error('Failed to check wishlist existence');
        }
      }
      if (!wishlist_id) {
        const resCreate = await fetch(
          `${import.meta.env.VITE_API_URL}/wishlists`,
          {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description }),
          }
        );
        if (!resCreate.ok) {
          const txt = await resCreate.text();
          throw new Error('Wishlist creation failed: ' + txt);
        }
        savedWishlist = await resCreate.json();
      }

      if (wishlistCover) {
        const fd = new FormData();
        fd.append('cover', wishlistCover);

        const resCover = await fetch(
          `${import.meta.env.VITE_API_URL}/wishlists/${savedWishlist.id}/cover`,
          { method: 'POST', credentials: 'include', body: fd }
        );
        if (resCover.ok) {
          const coverData = await resCover.json();
          savedWishlist.cover = coverData.cover;
        } else {
          console.warn('Wishlist cover upload failed');
        }
      }

      const savedItems = [];
      for (const it of items) {
        let saved = null;

        const resCreate = await fetch(`${import.meta.env.VITE_API_URL}/items`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            wishlist_id: savedWishlist.id,
            name: it.name,
            price: Number(it.price) || 0,
            link: it.link || null,
          }),
        });

        if (resCreate.ok) saved = await resCreate.json();
        else {
          console.warn('Failed to create item:', it.name);
          continue;
        }

        if (saved && it.imageFile) {
          const fd2 = new FormData();
          fd2.append('cover', it.imageFile);

          const upload = await fetch(
            `${import.meta.env.VITE_API_URL}/items/cover/${saved.id}`,
            {
              method: 'POST',
              credentials: 'include',
              body: fd2,
            }
          );

          if (upload.ok) {
            const upData = await upload.json();
            saved.cover = upData.cover;
          } else {
            console.warn('Item cover upload failed for item id', saved.id);
          }
        }

        savedItems.push(saved);
      }

      return { wishlist: savedWishlist, items: savedItems };
    } catch (err) {
      console.error(err);
      setError(err.message || 'Server error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createOrUpdateWishlist, loading, error };
}
