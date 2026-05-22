import { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import MovieGrid from '../components/MovieGrid';
import SectionHeader from '../components/SectionHeader';
import { HeroSkeleton } from '../components/LoadingSkeleton';
import * as api from '../api/movieApi';

function useMovieSection(fetcher) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetcher();
      setData(res.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);
  return { data, loading, error, retry: fetch };
}

export default function Home() {
  const trending = useMovieSection(() => api.getTrending('week'));
  const popular = useMovieSection(api.getPopular);
  const topRated = useMovieSection(api.getTopRated);
  const nowPlaying = useMovieSection(api.getNowPlaying);

  return (
    <div className="fade-in">
      {/* Hero banner */}
      {trending.loading ? (
        <HeroSkeleton />
      ) : (
        <HeroBanner movies={trending.data} />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        {/* Trending */}
        <section>
          <SectionHeader title="🔥 Trending This Week" />
          <MovieGrid
            movies={trending.data}
            loading={trending.loading}
            error={trending.error}
            onRetry={trending.retry}
          />
        </section>

        {/* Now Playing */}
        <section>
          <SectionHeader title="🎬 Now Playing" />
          <MovieGrid
            movies={nowPlaying.data}
            loading={nowPlaying.loading}
            error={nowPlaying.error}
            onRetry={nowPlaying.retry}
          />
        </section>

        {/* Popular */}
        <section>
          <SectionHeader title="🌟 Popular Movies" to="/search" />
          <MovieGrid
            movies={popular.data}
            loading={popular.loading}
            error={popular.error}
            onRetry={popular.retry}
          />
        </section>

        {/* Top Rated */}
        <section>
          <SectionHeader title="⭐ Top Rated" />
          <MovieGrid
            movies={topRated.data}
            loading={topRated.loading}
            error={topRated.error}
            onRetry={topRated.retry}
          />
        </section>
      </div>
    </div>
  );
}
