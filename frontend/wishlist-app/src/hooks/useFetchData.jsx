import { useState, useEffect } from 'react';

export default function useFetchData(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(url, { credentials: 'include' });
        if (!res.ok) {
          const txt = await res.text();
          console.error('Fetch failed:', url, res.status, txt);
          throw new Error(`Server error: ${res.status}`);
        }
        const json = await res.json();
        setData(json);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Server unavailable');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [url]);

  return { data, loading, error };
}
