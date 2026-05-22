import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const LS_KEY = 'cineflow_history';
const MAX = 20;

const loadLocal = () => { try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch { return []; } };

export function useWatchHistory() {
  const { user, getToken } = useAuth();
  const [history, setHistory] = useState(loadLocal);

  // Sync from server when logged in
  useEffect(() => {
    if (!user) return;
    axios.get(`${API}/user/history`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then((res) => setHistory(res.data.results || []))
      .catch(() => {});
  }, [user, getToken]);

  useEffect(() => {
    if (!user) localStorage.setItem(LS_KEY, JSON.stringify(history));
  }, [history, user]);

  const addToHistory = useCallback(async (movie) => {
    const item = {
      id: movie.id,
      title: movie.title || movie.name,
      poster_path: movie.poster_path,
      type: movie.media_type || (movie.name ? 'tv' : 'movie'),
      watchedAt: new Date().toISOString(),
    };

    if (user) {
      axios.post(`${API}/user/history`, item, { headers: { Authorization: `Bearer ${getToken()}` } })
        .then((res) => setHistory(res.data.results || []))
        .catch(() => {});
    } else {
      setHistory((prev) => {
        const filtered = prev.filter((m) => m.id !== item.id);
        return [item, ...filtered].slice(0, MAX);
      });
    }
  }, [user, getToken]);

  const clearHistory = useCallback(async () => {
    if (user) {
      await axios.delete(`${API}/user/history`, { headers: { Authorization: `Bearer ${getToken()}` } }).catch(() => {});
    }
    setHistory([]);
    localStorage.removeItem(LS_KEY);
  }, [user, getToken]);

  return { history, addToHistory, clearHistory };
}
