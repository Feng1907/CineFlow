import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../context/ToastContext';

const STORAGE_KEY = 'cineflow_favorites';

const load = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
};

export function useFavorites() {
  const [favorites, setFavorites] = useState(load);
  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = useCallback(
    (id) => favorites.some((m) => m.id === id),
    [favorites]
  );

  const toggleFavorite = useCallback((movie) => {
    setFavorites((prev) => {
      const exists = prev.some((m) => m.id === movie.id);
      showToast(exists ? 'Đã xóa khỏi yêu thích' : '❤️ Đã thêm vào yêu thích', exists ? 'info' : 'success');
      return exists ? prev.filter((m) => m.id !== movie.id) : [movie, ...prev];
    });
  }, [showToast]);

  const removeFavorite = useCallback((id) => {
    setFavorites((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return { favorites, isFavorite, toggleFavorite, removeFavorite };
}
