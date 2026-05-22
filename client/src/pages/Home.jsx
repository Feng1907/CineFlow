import { useState, useEffect, useCallback, useRef } from 'react';
import { Clock, Trash2 } from 'lucide-react';
import HeroBanner from '../components/HeroBanner';
import CarouselRow from '../components/CarouselRow';
import { HeroSkeleton } from '../components/LoadingSkeleton';
import { useWatchHistory } from '../hooks/useWatchHistory';
import * as api from '../api/movieApi';

const REFRESH_INTERVAL = 5 * 60 * 1000;

// Delay helper để stagger requests tránh 429
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function useSection(fetcher, delayMs = 0) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    if (delayMs) await delay(delayMs);
    try {
      const r = await fetcher();
      setData(r.results || []);
    } catch {
      setData([]); // set [] khi lỗi để tránh crash null.length
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  return { data, loading, refresh: load };
}

function useMergedSection(fetchers, delayMs = 0) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    if (delayMs) await delay(delayMs);
    try {
      const pages = await Promise.all(
        fetchers.map((f) => f().then((r) => r.results || []).catch(() => []))
      );
      const seen = new Set();
      const merged = pages.flat().filter((m) => {
        if (seen.has(m.id)) return false;
        seen.add(m.id); return true;
      });
      setData(merged);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  return { data, loading, refresh: load };
}

export default function Home() {
  // Hero — batch 1 (ngay lập tức)
  const heroSection = useMergedSection([
    () => api.getTrending('day'),
    () => api.getTrending('week'),
  ], 0);

  // Batch 2 — delay 200ms
  const nowPlaying  = useSection(api.getNowPlaying,                   200);
  const tvTrending  = useSection(() => api.getTVTrending('week'),     200);

  // Batch 3 — delay 400ms
  const popular     = useSection(api.getPopular,                      400);
  const tvOnAir     = useSection(api.getTVOnAir,                      400);

  // Batch 4 — delay 600ms
  const topRated    = useSection(api.getTopRated,                     600);
  const tvTopRated  = useSection(api.getTVTopRated,                   600);

  // Batch 5 — delay 800ms
  const upcoming    = useSection(api.getUpcoming,                     800);
  const action      = useSection(() => api.discoverMovies({ genre_id: 28,    sort_by: 'popularity.desc' }), 800);

  // Batch 6 — delay 1000ms
  const horror      = useSection(() => api.discoverMovies({ genre_id: 27,    sort_by: 'popularity.desc' }), 1000);
  const scifi       = useSection(() => api.discoverMovies({ genre_id: 878,   sort_by: 'popularity.desc' }), 1000);

  // Batch 7 — delay 1200ms
  const romance     = useSection(() => api.discoverMovies({ genre_id: 10749, sort_by: 'popularity.desc' }), 1200);
  const comedy      = useSection(() => api.discoverMovies({ genre_id: 35,    sort_by: 'popularity.desc' }), 1200);

  // Batch 8 — delay 1400ms
  const thriller    = useSection(() => api.discoverMovies({ genre_id: 53,    sort_by: 'popularity.desc' }), 1400);
  const animation   = useSection(() => api.discoverMovies({ genre_id: 16,    sort_by: 'popularity.desc' }), 1400);

  // Batch 9 — delay 1600ms
  const kdrama      = useSection(() => api.discoverTV({ country: 'KR', sort_by: 'popularity.desc' }),       1600);
  const korean      = useSection(() => api.discoverMovies({ country: 'KR', sort_by: 'popularity.desc' }),   1600);

  // Batch 10 — delay 1800ms
  const japanese    = useSection(() => api.discoverMovies({ country: 'JP', sort_by: 'popularity.desc' }),   1800);
  const thai        = useSection(() => api.discoverMovies({ country: 'TH', sort_by: 'popularity.desc' }),   1800);
  const chinese     = useSection(() => api.discoverMovies({ country: 'CN', sort_by: 'popularity.desc' }),   2000);

  const { history, clearHistory } = useWatchHistory();

  // Auto-refresh hero + now playing mỗi 5 phút
  useEffect(() => {
    const timer = setInterval(() => {
      heroSection.refresh();
      nowPlaying.refresh();
    }, REFRESH_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fade-in">
      {heroSection.loading ? <HeroSkeleton /> : <HeroBanner movies={heroSection.data} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 space-y-6">

        {history.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-1 h-5 bg-brand rounded-full" />
                <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                  <Clock size={16} className="text-brand" /> Xem Gần Đây
                </h2>
              </div>
              <button onClick={clearHistory} className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors">
                <Trash2 size={12} /> Xóa
              </button>
            </div>
            <CarouselRow movies={history} loading={false} />
          </div>
        )}

        <CarouselRow title="🔥 Thịnh Hành Hôm Nay"        movies={heroSection.data} loading={heroSection.loading} to="/movies" />
        <CarouselRow title="🎬 Phim Đang Chiếu Rạp"        movies={nowPlaying.data}  loading={nowPlaying.loading}  to="/now-playing" />
        <CarouselRow title="📺 TV Shows Thịnh Hành"        movies={tvTrending.data}  loading={tvTrending.loading}  to="/tv" mediaType="tv" />
        <CarouselRow title="🌟 Phim Phổ Biến"              movies={popular.data}     loading={popular.loading}     to="/movies" />
        <CarouselRow title="📡 TV Shows Đang Chiếu"        movies={tvOnAir.data}     loading={tvOnAir.loading}     to="/tv" mediaType="tv" />
        <CarouselRow title="⭐ Đánh Giá Cao Nhất"          movies={topRated.data}    loading={topRated.loading}    to="/movies" />
        <CarouselRow title="🏅 TV Shows Đánh Giá Cao"      movies={tvTopRated.data}  loading={tvTopRated.loading}  to="/tv" mediaType="tv" />
        <CarouselRow title="🎟️ Phim Sắp Ra Mắt"            movies={upcoming.data}    loading={upcoming.loading}    to="/upcoming" />
        <CarouselRow title="💥 Phim Hành Động"             movies={action.data}      loading={action.loading}      to="/genre/28" />
        <CarouselRow title="😱 Phim Kinh Dị"               movies={horror.data}      loading={horror.loading}      to="/genre/27" />
        <CarouselRow title="🚀 Phim Khoa Học Viễn Tưởng"  movies={scifi.data}       loading={scifi.loading}       to="/genre/878" />
        <CarouselRow title="💕 Phim Tình Cảm"              movies={romance.data}     loading={romance.loading}     to="/genre/10749" />
        <CarouselRow title="😂 Phim Hài"                   movies={comedy.data}      loading={comedy.loading}      to="/genre/35" />
        <CarouselRow title="🎭 Phim Giật Gân"              movies={thriller.data}    loading={thriller.loading}    to="/genre/53" />
        <CarouselRow title="🎨 Phim Hoạt Hình"             movies={animation.data}   loading={animation.loading}   to="/genre/16" />
        <CarouselRow title="🇰🇷 K-Drama Thịnh Hành"        movies={kdrama.data}      loading={kdrama.loading}      to="/country/KR" mediaType="tv" />
        <CarouselRow title="🇰🇷 Phim Hàn Quốc"             movies={korean.data}      loading={korean.loading}      to="/country/KR" />
        <CarouselRow title="🇯🇵 Phim Nhật Bản"             movies={japanese.data}    loading={japanese.loading}    to="/country/JP" />
        <CarouselRow title="🇹🇭 Phim Thái Lan"             movies={thai.data}        loading={thai.loading}        to="/country/TH" />
        <CarouselRow title="🇨🇳 Phim Trung Quốc"           movies={chinese.data}     loading={chinese.loading}     to="/country/CN" />
      </div>
    </div>
  );
}
