import { useState, useEffect } from 'react';
import { SlidersHorizontal, Loader2 } from 'lucide-react';
import MovieGrid from './MovieGrid';
import { SORT_OPTIONS } from '../utils/constants';

/**
 * Reusable browse page layout — handles fetch, pagination, sort.
 * Props:
 *   title     — page heading
 *   subtitle  — small label above heading
 *   fetcher   — (page, sortBy) => Promise<{ results, total_pages }>
 *   watchKey  — value that triggers a fresh fetch when it changes (e.g. genre id)
 *   showSort  — whether to show the sort dropdown (default true)
 */
export default function BrowsePage({ title, subtitle, fetcher, watchKey, showSort = true }) {
  const [sortBy, setSortBy]       = useState('popularity.desc');
  const [movies, setMovies]       = useState([]);
  const [page, setPage]           = useState(1);
  const [totalPages, setTotal]    = useState(0);
  const [loading, setLoading]     = useState(true);
  const [loadingMore, setMore]    = useState(false);
  const [error, setError]         = useState(null);

  const load = async (pg, sort, append = false) => {
    append ? setMore(true) : setLoading(true);
    setError(null);
    try {
      const res = await fetcher(pg, sort);
      setMovies((prev) => append ? [...prev, ...(res.results || [])] : (res.results || []));
      setTotal(res.total_pages || 0);
      setPage(pg);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setMore(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setSortBy('popularity.desc');
    load(1, 'popularity.desc');
  }, [watchKey]);

  const handleSort = (value) => {
    setSortBy(value);
    load(1, value);
  };

  return (
    <div className="fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          {subtitle && (
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">{subtitle}</p>
          )}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{title}</h1>
        </div>

        {showSort && (
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal size={16} className="text-zinc-400" />
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
              className="bg-surface-elevated border border-white/10 text-sm text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <MovieGrid
        movies={movies}
        loading={loading}
        error={error}
        onRetry={() => load(1, sortBy)}
        skeletonCount={18}
      />

      {movies.length > 0 && page < totalPages && !loading && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => load(page + 1, sortBy, true)}
            disabled={loadingMore}
            className="btn-secondary min-w-[140px] justify-center"
          >
            {loadingMore
              ? <><Loader2 size={16} className="animate-spin" /> Đang tải...</>
              : 'Xem thêm'}
          </button>
        </div>
      )}
    </div>
  );
}
