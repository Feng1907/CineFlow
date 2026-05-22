import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { searchMovies } from '../api/movieApi';
import { getPosterUrl, formatYear } from '../utils/imageUrl';

const DEBOUNCE_MS = 350;

export default function SearchOverlay({ onClose }) {
  const [query, setQuery]       = useState('');
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const debounceRef = useRef(null);
  const inputRef    = useRef(null);
  const navigate    = useNavigate();

  // Auto-focus
  useEffect(() => { inputRef.current?.focus(); }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [onClose]);

  // Debounced search
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!query.trim()) { setResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchMovies(query, 1);
        setResults((res.results || []).slice(0, 8));
      } catch { setResults([]); }
      finally { setLoading(false); }
    }, DEBOUNCE_MS);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const goTo = (item) => {
    const type = item.media_type === 'tv' || item.name ? 'movie' : 'movie';
    navigate(`/movie/${item.id}`);
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) { navigate(`/search?q=${encodeURIComponent(query.trim())}`); onClose(); }
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex flex-col items-center pt-20 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-2xl">
        {/* Search input */}
        <form onSubmit={handleSubmit} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={22} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm phim, TV show..."
            className="w-full bg-surface-card border border-white/15 rounded-2xl pl-12 pr-12 py-4 text-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white">
              <X size={20} />
            </button>
          )}
        </form>

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-3 bg-surface-card border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {results.map((item) => (
              <button
                key={item.id}
                onClick={() => goTo(item)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
              >
                <img
                  src={getPosterUrl(item.poster_path)}
                  alt={item.title || item.name}
                  className="w-10 h-14 object-cover rounded-md shrink-0"
                  onError={(e) => { e.target.src = '/placeholder-poster.svg'; }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{item.title || item.name}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{formatYear(item.release_date || item.first_air_date)}</p>
                </div>
              </button>
            ))}
            {query.trim() && (
              <button
                onClick={handleSubmit}
                className="w-full px-4 py-3 text-sm text-brand hover:bg-white/5 transition-colors text-left border-t border-white/5 flex items-center gap-2"
              >
                <Search size={14} /> Xem tất cả kết quả cho "{query}"
              </button>
            )}
          </div>
        )}

        {loading && (
          <div className="mt-4 text-center text-zinc-500 text-sm">Đang tìm kiếm...</div>
        )}

        {!query && (
          <div className="mt-6 text-center text-zinc-600 text-sm flex flex-col items-center gap-2">
            <Search size={32} className="text-zinc-700 mb-1" />
            Nhập tên phim để tìm kiếm
          </div>
        )}
      </div>
    </div>
  );
}
