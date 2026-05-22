import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Trash2 } from 'lucide-react';
import HeroBanner from '../components/HeroBanner';
import CarouselRow from '../components/CarouselRow';
import { HeroSkeleton } from '../components/LoadingSkeleton';
import { useWatchHistory } from '../hooks/useWatchHistory';
import * as api from '../api/movieApi';

function useSection(fetcher) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetcher()
      .then((r) => setData(r.results || []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}

export default function Home() {
  const trending   = useSection(() => api.getTrending('week'));
  const nowPlaying = useSection(api.getNowPlaying);
  const popular    = useSection(api.getPopular);
  const topRated   = useSection(api.getTopRated);
  const upcoming   = useSection(api.getUpcoming);
  const tvTrending = useSection(() => api.getTVTrending('week'));

  const { history, clearHistory } = useWatchHistory();

  return (
    <div className="fade-in">
      {/* Hero Banner */}
      {trending.loading ? <HeroSkeleton /> : <HeroBanner movies={trending.data} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 space-y-4">

        {/* Xem tiếp */}
        {history.length > 0 && (
          <section>
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
          </section>
        )}

        <CarouselRow title="🔥 Phim Thịnh Hành Tuần Này" movies={trending.data} loading={trending.loading} to="/movies" />
        <CarouselRow title="🎬 Phim Đang Chiếu Rạp"     movies={nowPlaying.data} loading={nowPlaying.loading} to="/now-playing" />
        <CarouselRow title="📺 TV Shows Thịnh Hành"      movies={tvTrending.data} loading={tvTrending.loading} to="/tv" mediaType="tv" />
        <CarouselRow title="🌟 Phim Phổ Biến"            movies={popular.data}    loading={popular.loading}    to="/movies" />
        <CarouselRow title="⭐ Đánh Giá Cao Nhất"        movies={topRated.data}   loading={topRated.loading}   to="/movies" />
        <CarouselRow title="🎟️ Phim Sắp Ra Mắt"         movies={upcoming.data}   loading={upcoming.loading}   to="/upcoming" />
      </div>
    </div>
  );
}
