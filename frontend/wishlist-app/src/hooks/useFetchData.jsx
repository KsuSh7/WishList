import { useState, useEffect } from 'react';

export default function useFetchData(url) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(url, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) throw new Error('Server returned an error');

        const json = await res.json();
        setData(json);
        setError(null);
      } catch (err) {
        setError('Server unavailable');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [url]);

  return { data, loading, error };
}
