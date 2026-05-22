import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies } from '../api/movieApi';
import SearchBar from '../components/SearchBar';
import MovieGrid from '../components/MovieGrid';
import { Loader2 } from 'lucide-react';

const DEBOUNCE_MS = 400;

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);

  // Sync query state khi URL thay đổi từ bên ngoài (e.g., Navbar search)
  useEffect(() => {
    const q = searchParams.get('q') || '';
    if (q && q !== query) {
      setQuery(q);
      doSearch(q, 1);
    }
  }, [searchParams]);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const debounceRef = useRef(null);

  const doSearch = async (q, pg = 1, append = false) => {
    if (!q.trim()) { setMovies([]); setTotalPages(0); return; }
    append ? setLoadingMore(true) : setLoading(true);
    setError(null);
    try {
      const res = await searchMovies(q, pg);
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

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (query.trim()) {
      setSearchParams({ q: query }, { replace: true });
      debounceRef.current = setTimeout(() => doSearch(query, 1), DEBOUNCE_MS);
    } else {
      setSearchParams({}, { replace: true });
      setMovies([]);
      setTotalPages(0);
    }
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // Chạy search từ URL param khi component mount lần đầu
  useEffect(() => { if (initialQuery) doSearch(initialQuery, 1); }, []); // eslint-disable-line

  return (
    <div className="fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      <h1 className="text-2xl font-bold mb-6 text-center">Tìm Kiếm Phim</h1>

      <SearchBar value={query} onChange={setQuery} onClear={() => setQuery('')} />

      <div className="mt-8">
        {query.trim() && !loading && !error && movies.length > 0 && (
          <p className="text-sm text-zinc-400 mb-4">
            Kết quả cho <span className="text-white font-medium">"{query}"</span>
          </p>
        )}

        <MovieGrid
          movies={movies}
          loading={loading}
          error={error}
          onRetry={() => doSearch(query, 1)}
          skeletonCount={12}
        />

        {!loading && !error && query.trim() && movies.length === 0 && (
          <div className="text-center py-16 text-zinc-500">
            <p className="text-lg">Không có kết quả cho "{query}"</p>
            <p className="text-sm mt-1">Hãy thử từ khóa khác.</p>
          </div>
        )}

        {!query.trim() && (
          <div className="text-center py-20 text-zinc-500">
            <p className="text-lg">Nhập tên phim để tìm kiếm...</p>
          </div>
        )}

        {movies.length > 0 && page < totalPages && !loading && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => doSearch(query, page + 1, true)}
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
    </div>
  );
}
