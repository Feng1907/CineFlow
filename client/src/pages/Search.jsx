import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMulti, searchMovies, searchTV } from '../api/movieApi';
import SearchBar from '../components/SearchBar';
import MovieGrid from '../components/MovieGrid';
import { Loader2, Film, Tv, LayoutGrid } from 'lucide-react';

const DEBOUNCE_MS = 400;

const TABS = [
  { key: 'multi',  label: 'Tất cả',     icon: LayoutGrid, fetcher: searchMulti  },
  { key: 'movie',  label: 'Phim lẻ',    icon: Film,       fetcher: searchMovies },
  { key: 'tv',     label: 'TV Shows',   icon: Tv,         fetcher: searchTV     },
];

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery]         = useState(initialQuery);
  const [tab, setTab]             = useState('multi');
  const [movies, setMovies]       = useState([]);
  const [page, setPage]           = useState(1);
  const [totalPages, setTotal]    = useState(0);
  const [loading, setLoading]     = useState(false);
  const [loadingMore, setMore]    = useState(false);
  const [error, setError]         = useState(null);
  const debounceRef = useRef(null);

  const currentTab = TABS.find((t) => t.key === tab) || TABS[0];

  const doSearch = useCallback(async (q, pg = 1, append = false, tabKey = tab) => {
    if (!q.trim()) { setMovies([]); setTotal(0); return; }
    const tabObj = TABS.find((t) => t.key === tabKey) || TABS[0];
    append ? setMore(true) : setLoading(true);
    setError(null);
    try {
      const res = await tabObj.fetcher(q, pg);
      // multi-search trả về media_type trên mỗi item
      const results = (res.results || []).filter(
        (r) => r.media_type !== 'person' // bỏ kết quả là diễn viên
      );
      setMovies((prev) => append ? [...prev, ...results] : results);
      setTotal(res.total_pages || 0);
      setPage(pg);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); setMore(false); }
  }, [tab]);

  // Debounce khi query thay đổi
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (query.trim()) {
      setSearchParams({ q: query }, { replace: true });
      debounceRef.current = setTimeout(() => doSearch(query, 1), DEBOUNCE_MS);
    } else {
      setSearchParams({}, { replace: true });
      setMovies([]); setTotal(0);
    }
    return () => clearTimeout(debounceRef.current);
  }, [query, tab]);

  // Sync khi URL thay đổi từ ngoài (Navbar search)
  useEffect(() => {
    const q = searchParams.get('q') || '';
    if (q && q !== query) { setQuery(q); doSearch(q, 1); }
  }, [searchParams]);

  // Mount lần đầu
  useEffect(() => { if (initialQuery) doSearch(initialQuery, 1); }, []); // eslint-disable-line

  const handleTabChange = (key) => {
    setTab(key);
    setMovies([]); setPage(1);
    if (query.trim()) doSearch(query, 1, false, key);
  };

  return (
    <div className="fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      <h1 className="text-2xl font-bold mb-6 text-center">Tìm Kiếm</h1>

      <SearchBar value={query} onChange={setQuery} onClear={() => setQuery('')} />

      {/* Tabs */}
      <div className="flex gap-1 mt-5 bg-surface-card border border-white/5 rounded-xl p-1 w-fit mx-auto">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => handleTabChange(key)}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              tab === key ? 'bg-brand text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {query.trim() && !loading && movies.length > 0 && (
          <p className="text-sm text-zinc-400 mb-4">
            {movies.length} kết quả cho <span className="text-white font-medium">"{query}"</span>
            {' '}· <span className="text-zinc-500">{currentTab.label}</span>
          </p>
        )}

        <MovieGrid movies={movies} loading={loading} error={error}
          onRetry={() => doSearch(query, 1)} skeletonCount={12} />

        {!loading && !error && query.trim() && movies.length === 0 && (
          <div className="text-center py-16 text-zinc-500">
            <p className="text-lg">Không có kết quả cho "{query}"</p>
            <p className="text-sm mt-1">Hãy thử từ khóa khác hoặc chuyển tab.</p>
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
