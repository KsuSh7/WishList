import { useSearchParams } from 'react-router-dom';

export default function AddItem() {
  const [searchParams] = useSearchParams();
  const wishlistId = searchParams.get('wishlistId');

  return (
    <div>
      <h2>Add Item to Wishlist #{wishlistId}</h2>
    </div>
  );
}
