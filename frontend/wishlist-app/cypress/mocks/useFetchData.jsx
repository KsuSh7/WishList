export default function useFetchData(url) {
  if (url.includes('/wishlists/')) {
    return {
      data: { id: 123, title: 'Birthday', description: 'Party stuff', user_id: 1 },
      loading: false,
      error: null,
    }
  }

  if (url.includes('/items?')) {
    return {
      data: [
        { id: 1, name: 'Shoes', price: 100, cover: null, link: 'http://example.com' },
      ],
      loading: false,
      error: null,
    }
  }

  return { data: [], loading: false, error: null }
}