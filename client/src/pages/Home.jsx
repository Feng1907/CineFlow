import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import HeroBanner from '../components/HeroBanner';
import MovieCard from '../components/MovieCard';
import MovieGrid from '../components/MovieGrid';
import TopMovies from '../components/TopMovies';
import UpcomingSidebar from '../components/UpcomingSidebar';
import { HeroSkeleton } from '../components/LoadingSkeleton';
import * as api from '../api/movieApi';

// Fetch hook for a single section
function useSection(fetcher) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const load = async () => {
    setLoading(true); setError(null);
    try   { const r = await fetcher(); setData(r.results || []); }
    catch (e) { setError(e.message); }
    finally   { setLoading(false); }
  };

  useEffect(() => { load(); }, []);
  return { data, loading, error, retry: load };
}

// Horizontal scroll row (desktop-style)
function MovieRow({ movies, loading, error, onRetry }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-surface-card rounded-xl overflow-hidden">
            <div className="aspect-[2/3] bg-surface-elevated" />
            <div className="p-3 space-y-2">
              <div className="h-3.5 bg-surface-elevated rounded w-4/5" />
              <div className="h-3 bg-surface-elevated rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (error) return <p className="text-zinc-500 text-sm py-4">{error}</p>;
  if (!movies?.length) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {movies.slice(0, 8).map((m) => <MovieCard key={m.id} movie={m} />)}
    </div>
  );
}

function SectionHeader({ title, to }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
        <span className="w-1 h-6 bg-brand rounded-full inline-block" />
        {title}
      </h2>
      {to && (
        <Link to={to} className="flex items-center gap-1 text-xs text-zinc-400 hover:text-brand transition-colors">
          Xem thêm <ChevronRight size={14} />
        </Link>
      )}
    </div>
  );
}

function SidebarSection({ title, children }) {
  return (
    <div className="bg-surface-card rounded-2xl p-4 border border-white/5">
      <h3 className="text-sm font-extrabold text-brand uppercase tracking-widest mb-4 border-b border-white/5 pb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function Home() {
  const trending   = useSection(() => api.getTrending('week'));
  const nowPlaying = useSection(api.getNowPlaying);
  const popular    = useSection(api.getPopular);
  const topRated   = useSection(api.getTopRated);
  const upcoming   = useSection(api.getUpcoming);

  return (
    <div className="fade-in">
      {/* Hero */}
      {trending.loading ? <HeroSkeleton /> : <HeroBanner movies={trending.data} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* 2-column layout: main content + sidebar */}
        <div className="flex gap-8 items-start">

          {/* ── Left: main content ── */}
          <div className="flex-1 min-w-0 space-y-12">

            {/* Phim mới hôm nay */}
            <section>
              <SectionHeader title="🎬 Phim Mới Hôm Nay" to="/now-playing" />
              <MovieRow
                movies={nowPlaying.data}
                loading={nowPlaying.loading}
                error={nowPlaying.error}
                onRetry={nowPlaying.retry}
              />
            </section>

            {/* Phim thịnh hành */}
            <section>
              <SectionHeader title="🔥 Phim Thịnh Hành" to="/movies" />
              <MovieRow
                movies={trending.data}
                loading={trending.loading}
                error={trending.error}
                onRetry={trending.retry}
              />
            </section>

            {/* Phổ biến */}
            <section>
              <SectionHeader title="🌟 Phim Phổ Biến" to="/movies" />
              <MovieRow
                movies={popular.data}
                loading={popular.loading}
                error={popular.error}
                onRetry={popular.retry}
              />
            </section>

            {/* Top đánh giá */}
            <section>
              <SectionHeader title="⭐ Đánh Giá Cao Nhất" to="/movies" />
              <MovieRow
                movies={topRated.data}
                loading={topRated.loading}
                error={topRated.error}
                onRetry={topRated.retry}
              />
            </section>
          </div>

          {/* ── Right: sidebar ── */}
          <aside className="hidden xl:flex flex-col gap-6 w-72 shrink-0 sticky top-20">
            <SidebarSection title="🏆 Top Phim">
              <TopMovies movies={popular.data} loading={popular.loading} />
            </SidebarSection>

            <SidebarSection title="🎟️ Phim Sắp Chiếu">
              <UpcomingSidebar movies={upcoming.data} loading={upcoming.loading} />
              {!upcoming.loading && (
                <Link
                  to="/upcoming"
                  className="flex items-center justify-center gap-1 mt-3 text-xs text-zinc-400 hover:text-brand transition-colors"
                >
                  Xem tất cả <ChevronRight size={13} />
                </Link>
              )}
            </SidebarSection>
          </aside>
        </div>

        {/* Mobile: Top phim + Sắp chiếu (below main content on small screens) */}
        <div className="xl:hidden mt-12 grid sm:grid-cols-2 gap-6">
          <div className="bg-surface-card rounded-2xl p-4 border border-white/5">
            <h3 className="text-sm font-extrabold text-brand uppercase tracking-widest mb-4 border-b border-white/5 pb-3">
              🏆 Top Phim
            </h3>
            <TopMovies movies={popular.data} loading={popular.loading} />
          </div>
          <div className="bg-surface-card rounded-2xl p-4 border border-white/5">
            <h3 className="text-sm font-extrabold text-brand uppercase tracking-widest mb-4 border-b border-white/5 pb-3">
              🎟️ Phim Sắp Chiếu
            </h3>
            <UpcomingSidebar movies={upcoming.data} loading={upcoming.loading} />
            {!upcoming.loading && (
              <Link to="/upcoming" className="flex items-center justify-center gap-1 mt-3 text-xs text-zinc-400 hover:text-brand transition-colors">
                Xem tất cả <ChevronRight size={13} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
