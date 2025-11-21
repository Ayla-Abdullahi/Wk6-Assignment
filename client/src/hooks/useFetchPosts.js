import { useEffect, useState } from 'react';

export function useFetchPosts(fetchImpl = fetch) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    fetchImpl('/api/posts')
      .then(r => {
        if (!r.ok) throw new Error('Failed to load posts');
        return r.json();
      })
      .then(json => {
        if (active) {
          setData(json);
          setLoading(false);
        }
      })
      .catch(e => {
        if (active) {
          setError(e);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [fetchImpl]);

  return { data, loading, error };
}
