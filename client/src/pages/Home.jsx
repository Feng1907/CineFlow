import { useState, useEffect, useCallback } from 'react';
import { Clock, Trash2 } from 'lucide-react';
import HeroBanner from '../components/HeroBanner';
import CarouselRow from '../components/CarouselRow';
import { HeroSkeleton } from '../components/LoadingSkeleton';
import { useWatchHistory } from '../hooks/useWatchHistory';
import * as api from '../api/movieApi';

const REFRESH_INTERVAL = 5 * 60 * 1000; // auto-refresh data mỗi 5 phút

// Fetch 1 section, trả về { data, loading, refresh }
function useSection(fetcher) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    fetcher()
      .then((r) => setData(r.results || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  return { data, loading, refresh: load };
}

// Row gộp nhiều trang (nhiều phim hơn)
function useMergedSection(fetchers) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    Promise.all(fetchers.map((f) => f().then((r) => r.results || []).catch(() => [])))
      .then((pages) => {
        // Gộp + dedup theo id
        const seen = new Set();
        const merged = pages.flat().filter((m) => {
          if (seen.has(m.id)) return false;
          seen.add(m.id); return true;
        });
        setData(merged);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  return { data, loading, refresh: load };
}

export default function Home() {
  // Hero — trending hôm nay + tuần (gộp để có nhiều phim hơn)
  const heroSection = useMergedSection([
    () => api.getTrending('day'),
    () => api.getTrending('week'),
  ]);

  // Các rows
  const nowPlaying  = useSection(api.getNowPlaying);
  const popular     = useSection(api.getPopular);
  const topRated    = useSection(api.getTopRated);
  const upcoming    = useSection(api.getUpcoming);
  const tvTrending  = useSection(() => api.getTVTrending('week'));
  const tvTopRated  = useSection(api.getTVTopRated);
  const tvOnAir     = useSection(api.getTVOnAir);

  // Phim theo thể loại
  const action      = useSection(() => api.discoverMovies({ genre_id: 28,  sort_by: 'popularity.desc' }));
  const comedy      = useSection(() => api.discoverMovies({ genre_id: 35,  sort_by: 'popularity.desc' }));
  const horror      = useSection(() => api.discoverMovies({ genre_id: 27,  sort_by: 'popularity.desc' }));
  const romance     = useSection(() => api.discoverMovies({ genre_id: 10749, sort_by: 'popularity.desc' }));
  const scifi       = useSection(() => api.discoverMovies({ genre_id: 878, sort_by: 'popularity.desc' }));
  const animation   = useSection(() => api.discoverMovies({ genre_id: 16,  sort_by: 'popularity.desc' }));
  const thriller    = useSection(() => api.discoverMovies({ genre_id: 53,  sort_by: 'popularity.desc' }));

  // Phim theo quốc gia
  const korean      = useSection(() => api.discoverMovies({ country: 'KR', sort_by: 'popularity.desc' }));
  const japanese    = useSection(() => api.discoverMovies({ country: 'JP', sort_by: 'popularity.desc' }));
  const thai        = useSection(() => api.discoverMovies({ country: 'TH', sort_by: 'popularity.desc' }));
  const chinese     = useSection(() => api.discoverMovies({ country: 'CN', sort_by: 'popularity.desc' }));

  // TV theo quốc gia
  const kdrama      = useSection(() => api.discoverTV({ country: 'KR', sort_by: 'popularity.desc' }));

  const { history, clearHistory } = useWatchHistory();

  // Auto-refresh hero + trending mỗi 5 phút
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

        {/* Xem gần đây */}
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

        {/* Phim mới & thịnh hành */}
        <CarouselRow title="🔥 Thịnh Hành Hôm Nay"        movies={heroSection.data} loading={heroSection.loading} to="/movies" />
        <CarouselRow title="🎬 Phim Đang Chiếu Rạp"        movies={nowPlaying.data}  loading={nowPlaying.loading}  to="/now-playing" />
        <CarouselRow title="🎟️ Phim Sắp Ra Mắt"            movies={upcoming.data}    loading={upcoming.loading}    to="/upcoming" />

        {/* TV Shows */}
        <CarouselRow title="📺 TV Shows Thịnh Hành"        movies={tvTrending.data}  loading={tvTrending.loading}  to="/tv" mediaType="tv" />
        <CarouselRow title="📡 TV Shows Đang Chiếu"        movies={tvOnAir.data}     loading={tvOnAir.loading}     to="/tv" mediaType="tv" />
        <CarouselRow title="⭐ TV Shows Đánh Giá Cao"      movies={tvTopRated.data}  loading={tvTopRated.loading}  to="/tv" mediaType="tv" />

        {/* Theo thể loại phim */}
        <CarouselRow title="💥 Phim Hành Động"             movies={action.data}      loading={action.loading}      to="/genre/28" />
        <CarouselRow title="😱 Phim Kinh Dị"               movies={horror.data}      loading={horror.loading}      to="/genre/27" />
        <CarouselRow title="🚀 Phim Khoa Học Viễn Tưởng"  movies={scifi.data}       loading={scifi.loading}       to="/genre/878" />
        <CarouselRow title="💕 Phim Tình Cảm"              movies={romance.data}     loading={romance.loading}     to="/genre/10749" />
        <CarouselRow title="😂 Phim Hài"                   movies={comedy.data}      loading={comedy.loading}      to="/genre/35" />
        <CarouselRow title="🎭 Phim Giật Gân"              movies={thriller.data}    loading={thriller.loading}    to="/genre/53" />
        <CarouselRow title="🎨 Phim Hoạt Hình"             movies={animation.data}   loading={animation.loading}   to="/genre/16" />

        {/* K-Drama & châu Á */}
        <CarouselRow title="🇰🇷 K-Drama Thịnh Hành"        movies={kdrama.data}      loading={kdrama.loading}      to="/country/KR" mediaType="tv" />
        <CarouselRow title="🇰🇷 Phim Hàn Quốc"             movies={korean.data}      loading={korean.loading}      to="/country/KR" />
        <CarouselRow title="🇯🇵 Phim Nhật Bản"             movies={japanese.data}    loading={japanese.loading}    to="/country/JP" />
        <CarouselRow title="🇹🇭 Phim Thái Lan"             movies={thai.data}        loading={thai.loading}        to="/country/TH" />
        <CarouselRow title="🇨🇳 Phim Trung Quốc"           movies={chinese.data}     loading={chinese.loading}     to="/country/CN" />

        {/* Phổ biến & đánh giá cao */}
        <CarouselRow title="🌟 Phim Phổ Biến"              movies={popular.data}     loading={popular.loading}     to="/movies" />
        <CarouselRow title="🏆 Đánh Giá Cao Nhất"          movies={topRated.data}    loading={topRated.loading}    to="/movies" />
      </div>
    </div>
  );
}
