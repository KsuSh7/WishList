import { useState, useEffect } from 'react';

export default function useFetchData(url, storageKey) {
  const [data, setData] = useState(() => {
    const cached = localStorage.getItem(storageKey);
    if (!cached) return [];
    try {
      return JSON.parse(cached);
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Server returned an error');

        const json = await res.json();
        setData(json);
        localStorage.setItem(storageKey, JSON.stringify(json));
        setError(null);
      } catch (err) {
        console.warn('Server unavailable, using cached data', err);
        const cached = localStorage.getItem(storageKey);
        setData(cached ? JSON.parse(cached) : []);
        setError('Server unavailable — showing cached data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, storageKey]);

  return { data, loading, error };
}
