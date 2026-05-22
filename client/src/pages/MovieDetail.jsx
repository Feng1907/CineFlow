import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Play, Heart, Star, Clock, Calendar, ChevronLeft, Globe
} from 'lucide-react';
import { getMovieDetail } from '../api/movieApi';
import { getBackdropUrl, getPosterUrl, getAvatarUrl, formatYear, formatRuntime, formatRating } from '../utils/imageUrl';
import { useFavorites } from '../hooks/useFavorites';
import TrailerModal from '../components/TrailerModal';
import MovieGrid from '../components/MovieGrid';
import { DetailSkeleton } from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);

  const { isFavorite, toggleFavorite } = useFavorites();

  const fetchMovie = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMovieDetail(id);
      setMovie(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovie();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <DetailSkeleton />;
  if (error) return (
    <div className="pt-24">
      <ErrorState message={error} onRetry={fetchMovie} />
    </div>
  );
  if (!movie) return null;

  // Find YouTube trailer
  const trailer = movie.videos?.results?.find(
    (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  );

  // Top cast (up to 10)
  const cast = movie.credits?.cast?.slice(0, 10) || [];

  // Similar movies
  const similar = movie.similar?.results?.slice(0, 12) || [];

  // Watch providers for US region
  const providers = movie['watch/providers']?.results?.US;

  const fav = isFavorite(movie.id);
  const backdrop = getBackdropUrl(movie.backdrop_path);

  return (
    <div className="fade-in min-h-screen">
      {/* Backdrop */}
      <div className="relative h-[55vh] min-h-[360px] overflow-hidden">
        {backdrop && (
          <img
            src={backdrop}
            alt={movie.title}
            className="w-full h-full object-cover object-top"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface/70 to-transparent" />

        {/* Back button */}
        <Link
          to="/"
          className="absolute top-20 left-4 sm:left-8 flex items-center gap-1 text-sm text-zinc-300 hover:text-white bg-black/40 hover:bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-sm transition-all"
        >
          <ChevronLeft size={16} /> Back
        </Link>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 relative z-10 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="shrink-0 w-44 sm:w-56 md:w-64 mx-auto md:mx-0">
            <img
              src={getPosterUrl(movie.poster_path)}
              alt={movie.title}
              className="w-full rounded-2xl shadow-2xl shadow-black/70 ring-1 ring-white/10"
              onError={(e) => { e.target.src = '/placeholder-poster.svg'; }}
            />
          </div>

          {/* Info */}
          <div className="flex-1 pt-4 md:pt-24">
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-zinc-400 italic mt-1 text-sm">{movie.tagline}</p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mt-4 text-sm text-zinc-300">
              {movie.vote_average > 0 && (
                <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                  <Star size={15} fill="currentColor" />
                  {formatRating(movie.vote_average)}
                  <span className="text-zinc-500 font-normal">/ 10</span>
                </span>
              )}
              {movie.release_date && (
                <span className="flex items-center gap-1">
                  <Calendar size={14} className="text-zinc-500" />
                  {movie.release_date}
                </span>
              )}
              {movie.runtime > 0 && (
                <span className="flex items-center gap-1">
                  <Clock size={14} className="text-zinc-500" />
                  {formatRuntime(movie.runtime)}
                </span>
              )}
            </div>

            {/* Genres */}
            {movie.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {movie.genres.map((g) => (
                  <span
                    key={g.id}
                    className="text-xs font-medium px-3 py-1 rounded-full bg-surface-elevated border border-white/10 text-zinc-300"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            {movie.overview && (
              <p className="mt-5 text-zinc-300 leading-relaxed max-w-2xl">{movie.overview}</p>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mt-6">
              {trailer && (
                <button
                  onClick={() => setTrailerKey(trailer.key)}
                  className="btn-primary"
                >
                  <Play size={18} fill="white" /> Watch Trailer
                </button>
              )}
              <button
                onClick={() => toggleFavorite(movie)}
                className={`btn-secondary ${fav ? 'text-brand' : ''}`}
              >
                <Heart size={18} fill={fav ? 'currentColor' : 'none'} />
                {fav ? 'In Favorites' : 'Add to Favorites'}
              </button>
            </div>

            {/* Watch providers */}
            {providers && (
              <div className="mt-6">
                <p className="text-xs text-zinc-500 mb-2 flex items-center gap-1">
                  <Globe size={12} /> Available on (US)
                </p>
                <div className="flex flex-wrap gap-2">
                  {(providers.flatrate || providers.free || providers.ads || []).map((p) => (
                    <div key={p.provider_id} className="flex items-center gap-1.5 bg-surface-elevated rounded-lg px-2.5 py-1.5 text-xs">
                      {p.logo_path && (
                        <img
                          src={`https://image.tmdb.org/t/p/w45${p.logo_path}`}
                          alt={p.provider_name}
                          className="w-5 h-5 rounded-sm object-cover"
                        />
                      )}
                      <span className="text-zinc-300">{p.provider_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <section className="mt-14">
            <h2 className="section-title">Cast</h2>
            <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin">
              {cast.map((person) => (
                <div key={person.id} className="shrink-0 w-24 text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-surface-elevated mx-auto ring-2 ring-white/10">
                    <img
                      src={getAvatarUrl(person.profile_path)}
                      alt={person.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = '/placeholder-avatar.svg'; }}
                    />
                  </div>
                  <p className="text-xs font-semibold text-white mt-2 truncate">{person.name}</p>
                  <p className="text-xs text-zinc-500 truncate">{person.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar movies */}
        {similar.length > 0 && (
          <section className="mt-14">
            <h2 className="section-title">Similar Movies</h2>
            <MovieGrid movies={similar} loading={false} error={null} />
          </section>
        )}
      </div>

      {/* Trailer modal */}
      {trailerKey && (
        <TrailerModal videoKey={trailerKey} onClose={() => setTrailerKey(null)} />
      )}
    </div>
  );
}
