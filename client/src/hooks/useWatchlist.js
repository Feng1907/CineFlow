import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const LS_KEY = 'cineflow_watchlist';

const loadLocal = () => { try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch { return []; } };

export function useWatchlist() {
  const { user, getToken } = useAuth();
  const [watchlist, setWatchlist] = useState(loadLocal);

  // Sync from server when logged in
  useEffect(() => {
    if (!user) return;
    axios.get(`${API}/user/watchlist`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then((res) => setWatchlist(res.data.results || []))
      .catch(() => {});
  }, [user]);

  // Persist locally when not logged in
  useEffect(() => {
    if (!user) localStorage.setItem(LS_KEY, JSON.stringify(watchlist));
  }, [watchlist, user]);

  const isInWatchlist = useCallback((id) => watchlist.some((m) => m.id === id), [watchlist]);

  const toggleWatchlist = useCallback(async (movie) => {
    const exists = watchlist.some((m) => m.id === movie.id);
    const item = { id: movie.id, title: movie.title || movie.name, poster_path: movie.poster_path, type: movie.media_type || (movie.name ? 'tv' : 'movie') };

    if (user) {
      const headers = { Authorization: `Bearer ${getToken()}` };
      if (exists) {
        await axios.delete(`${API}/user/watchlist/${movie.id}`, { headers });
        setWatchlist((p) => p.filter((m) => m.id !== movie.id));
      } else {
        await axios.post(`${API}/user/watchlist`, item, { headers });
        setWatchlist((p) => [item, ...p]);
      }
    } else {
      setWatchlist((p) => exists ? p.filter((m) => m.id !== movie.id) : [item, ...p]);
    }
  }, [watchlist, user, getToken]);

  return { watchlist, isInWatchlist, toggleWatchlist };
}
