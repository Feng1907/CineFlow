import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Loader2 } from 'lucide-react';
import { discoverMovies, getGenres } from '../api/movieApi';
import MovieGrid from '../components/MovieGrid';

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Phổ biến nhất' },
  { value: 'vote_average.desc', label: 'Đánh giá cao nhất' },
  { value: 'release_date.desc', label: 'Mới nhất' },
  { value: 'revenue.desc', label: 'Doanh thu cao nhất' },
];

export default function Genre() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get('sort') || 'popularity.desc';

  const [genreName, setGenreName] = useState('');
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  // Resolve genre name from id
  useEffect(() => {
    getGenres().then((data) => {
      const found = data.genres?.find((g) => String(g.id) === String(id));
      if (found) setGenreName(found.name);
    }).catch(() => {});
  }, [id]);

  const fetchMovies = async (pg = 1, append = false) => {
    append ? setLoadingMore(true) : setLoading(true);
    setError(null);
    try {
      const res = await discoverMovies({ genre_id: id, sort_by: sortBy, page: pg });
      setMovies((prev) => append ? [...prev, ...(res.results || [])] : (res.results || []));
      setTotalPages(res.total_pages || 0);
      setPage(pg);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Refetch when genre id or sort changes
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchMovies(1);
  }, [id, sortBy]);

  const handleSort = (value) => {
    setSearchParams({ sort: value });
  };

  return (
    <div className="fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Thể loại</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {genreName || 'Đang tải...'}
          </h1>
        </div>

        {/* Sort selector */}
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
      </div>

      {/* Grid */}
      <MovieGrid
        movies={movies}
        loading={loading}
        error={error}
        onRetry={() => fetchMovies(1)}
        skeletonCount={18}
      />

      {/* Load more */}
      {movies.length > 0 && page < totalPages && !loading && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => fetchMovies(page + 1, true)}
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
