import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Heart, Plus, Check, Star, Clock, Calendar, ChevronLeft, Globe, MessageSquare, MonitorPlay } from 'lucide-react';
import { getMovieDetail } from '../api/movieApi';
import { getBackdropUrl, getPosterUrl, getAvatarUrl, formatYear, formatRuntime, formatRating } from '../utils/imageUrl';
import { useFavorites } from '../hooks/useFavorites';
import { useWatchlist } from '../hooks/useWatchlist';
import { useWatchHistory } from '../hooks/useWatchHistory';
import TrailerModal from '../components/TrailerModal';
import VideoPlayer from '../components/VideoPlayer';
import MovieGrid from '../components/MovieGrid';
import { DetailSkeleton } from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [trailerKey, setTrailer]   = useState(null);
  const [showPlayer, setPlayer]    = useState(false);

  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { addToHistory } = useWatchHistory();

  const fetchMovie = async () => {
    setLoading(true); setError(null);
    try   { setMovie(await getMovieDetail(id)); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMovie(); window.scrollTo(0, 0); }, [id]);

  if (loading) return <DetailSkeleton />;
  if (error)   return <div className="pt-24"><ErrorState message={error} onRetry={fetchMovie} /></div>;
  if (!movie)  return null;

  const trailer   = movie.videos?.results?.find((v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'));
  const cast      = movie.credits?.cast?.slice(0, 12) || [];
  const similar   = movie.similar?.results?.slice(0, 12) || [];
  const providers = movie['watch/providers']?.results?.US;
  const reviews   = movie.reviews?.results?.slice(0, 3) || [];

  // Content rating (US)
  const usRelease = movie.release_dates?.results?.find((r) => r.iso_3166_1 === 'US');
  const rating    = usRelease?.release_dates?.find((r) => r.certification)?.certification;

  // Phim đang chiếu rạp hoặc sắp chiếu → chỉ có trailer, chưa xem được
  const releaseDate  = movie.release_date ? new Date(movie.release_date) : null;
  const isInTheaters = movie.status === 'Released' && releaseDate && (Date.now() - releaseDate) < 60 * 24 * 60 * 60 * 1000; // dưới 60 ngày
  const isUpcoming   = movie.status === 'In Production' || movie.status === 'Post Production' || (releaseDate && releaseDate > new Date());
  const canWatch     = !isUpcoming && movie.status !== 'Planned';

  const fav    = isFavorite(movie.id);
  const inList = isInWatchlist(movie.id);
  const backdrop = getBackdropUrl(movie.backdrop_path);

  const handleTrailer = () => {
    if (trailer) { setTrailer(trailer.key); addToHistory(movie); }
  };

  return (
    <div className="fade-in min-h-screen">
      {/* Backdrop */}
      <div className="relative h-[55vh] min-h-[360px] overflow-hidden">
        {backdrop && <img src={backdrop} alt={movie.title} className="w-full h-full object-cover object-top" />}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface/70 to-transparent" />
        <Link to="/" className="absolute top-20 left-4 sm:left-8 flex items-center gap-1 text-sm text-zinc-300 hover:text-white bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm transition-all">
          <ChevronLeft size={16} /> Quay lại
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 relative z-10 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="shrink-0 w-44 sm:w-56 md:w-64 mx-auto md:mx-0">
            <img src={getPosterUrl(movie.poster_path)} alt={movie.title}
              className="w-full rounded-2xl shadow-2xl shadow-black/70 ring-1 ring-white/10"
              onError={(e) => { e.target.src = '/placeholder-poster.svg'; }} />
          </div>

          {/* Info */}
          <div className="flex-1 pt-4 md:pt-24">
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">{movie.title}</h1>
            {movie.tagline && <p className="text-zinc-400 italic mt-1 text-sm">{movie.tagline}</p>}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mt-4 text-sm text-zinc-300">
              {movie.vote_average > 0 && (
                <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                  <Star size={15} fill="currentColor" /> {formatRating(movie.vote_average)}
                  <span className="text-zinc-500 font-normal">/ 10</span>
                </span>
              )}
              {rating && (
                <span className="px-2 py-0.5 border border-zinc-500 text-zinc-400 text-xs rounded font-medium">{rating}</span>
              )}
              {movie.release_date && (
                <span className="flex items-center gap-1"><Calendar size={14} className="text-zinc-500" /> {movie.release_date}</span>
              )}
              {movie.runtime > 0 && (
                <span className="flex items-center gap-1"><Clock size={14} className="text-zinc-500" /> {formatRuntime(movie.runtime)}</span>
              )}
            </div>

            {/* Genres */}
            {movie.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {movie.genres.map((g) => (
                  <Link key={g.id} to={`/genre/${g.id}`}
                    className="text-xs font-medium px-3 py-1 rounded-full bg-surface-elevated border border-white/10 text-zinc-300 hover:border-brand hover:text-brand transition-colors">
                    {g.name}
                  </Link>
                ))}
              </div>
            )}

            {movie.overview && <p className="mt-5 text-zinc-300 leading-relaxed max-w-2xl">{movie.overview}</p>}

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mt-6">
              {/* Nút Xem Phim — chỉ hiện nếu phim không phải upcoming */}
              {canWatch && (
                <button
                  onClick={() => { setPlayer(true); addToHistory(movie); }}
                  className="btn-primary"
                >
                  <MonitorPlay size={18} /> Xem Phim
                </button>
              )}

              {trailer && (
                <button onClick={handleTrailer} className={canWatch ? 'btn-secondary' : 'btn-primary'}>
                  <Play size={18} fill={canWatch ? 'none' : 'white'} /> Xem Trailer
                </button>
              )}
              <button onClick={() => toggleFavorite(movie)} className={`btn-secondary ${fav ? 'text-brand' : ''}`}>
                <Heart size={18} fill={fav ? 'currentColor' : 'none'} /> {fav ? 'Đã yêu thích' : 'Yêu thích'}
              </button>
              <button onClick={() => toggleWatchlist(movie)} className={`btn-secondary ${inList ? 'text-green-400' : ''}`}>
                {inList ? <Check size={18} /> : <Plus size={18} />} {inList ? 'Đã lưu' : 'Thêm danh sách'}
              </button>
            </div>

            {/* Watch providers */}
            {providers && (
              <div className="mt-6">
                <p className="text-xs text-zinc-500 mb-2 flex items-center gap-1"><Globe size={12} /> Xem trực tuyến tại (Mỹ)</p>
                <div className="flex flex-wrap gap-2">
                  {(providers.flatrate || providers.free || providers.ads || []).map((p) => (
                    <div key={p.provider_id} className="flex items-center gap-1.5 bg-surface-elevated rounded-lg px-2.5 py-1.5 text-xs">
                      {p.logo_path && <img src={`https://image.tmdb.org/t/p/w45${p.logo_path}`} alt={p.provider_name} className="w-5 h-5 rounded-sm object-cover" />}
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
            <h2 className="section-title">Diễn Viên</h2>
            <div className="flex gap-4 overflow-x-auto pb-3" style={{ scrollbarWidth: 'none' }}>
              {cast.map((person) => (
                <Link to={`/person/${person.id}`} key={person.id} className="shrink-0 w-24 text-center group">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-surface-elevated mx-auto ring-2 ring-white/10 group-hover:ring-brand transition-all">
                    <img src={getAvatarUrl(person.profile_path)} alt={person.name} className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = '/placeholder-avatar.svg'; }} />
                  </div>
                  <p className="text-xs font-semibold text-white mt-2 truncate group-hover:text-brand transition-colors">{person.name}</p>
                  <p className="text-xs text-zinc-500 truncate">{person.character}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        {reviews.length > 0 && (
          <section className="mt-14">
            <h2 className="section-title flex items-center gap-2"><MessageSquare size={20} /> Đánh Giá</h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-surface-card border border-white/5 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center text-sm font-bold shrink-0">
                      {review.author?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{review.author}</p>
                      {review.author_details?.rating && (
                        <span className="flex items-center gap-1 text-xs text-yellow-400">
                          <Star size={10} fill="currentColor" /> {review.author_details.rating}/10
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed line-clamp-4">{review.content}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar */}
        {similar.length > 0 && (
          <section className="mt-14">
            <h2 className="section-title">Phim Tương Tự</h2>
            <MovieGrid movies={similar} loading={false} error={null} />
          </section>
        )}
      </div>

      {trailerKey && <TrailerModal videoKey={trailerKey} onClose={() => setTrailer(null)} />}
      {showPlayer && (
        <VideoPlayer
          tmdbId={movie.id}
          type="movie"
          title={movie.title}
          onClose={() => setPlayer(false)}
        />
      )}
    </div>
  );
}
