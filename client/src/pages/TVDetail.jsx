import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Heart, Plus, Check, Star, Clock, Calendar, ChevronLeft, Globe, ChevronDown, MonitorPlay } from 'lucide-react';
import { getTVDetail, getTVSeason } from '../api/movieApi';
import { getBackdropUrl, getPosterUrl, getAvatarUrl, formatYear, formatRating } from '../utils/imageUrl';
import { useFavorites } from '../hooks/useFavorites';
import { useWatchlist } from '../hooks/useWatchlist';
import { useWatchHistory } from '../hooks/useWatchHistory';
import TrailerModal from '../components/TrailerModal';
import VideoPlayer from '../components/VideoPlayer';
import MovieGrid from '../components/MovieGrid';
import { DetailSkeleton } from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';

function EpisodeCard({ ep, onWatch }) {
  const still = ep.still_path
    ? `https://image.tmdb.org/t/p/w300${ep.still_path}`
    : '/placeholder-poster.svg';
  return (
    <div className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group">
      {/* Thumbnail + play overlay */}
      <button
        onClick={onWatch}
        className="shrink-0 w-32 sm:w-40 aspect-video bg-surface-elevated rounded-lg overflow-hidden relative"
      >
        <img src={still} alt={ep.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = '/placeholder-poster.svg'; }} />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
          <MonitorPlay size={28} className="text-white drop-shadow-lg" />
        </div>
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-xs text-zinc-500 mb-0.5">Tập {ep.episode_number}</p>
        <p className="text-sm font-semibold text-white leading-snug">{ep.name}</p>
        {ep.runtime > 0 && <p className="text-xs text-zinc-500 mt-0.5">{ep.runtime} phút</p>}
        {ep.overview && <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">{ep.overview}</p>}
        <button
          onClick={onWatch}
          className="mt-2 flex items-center gap-1.5 text-xs text-brand hover:text-red-400 transition-colors font-medium"
        >
          <MonitorPlay size={13} /> Xem tập này
        </button>
      </div>
    </div>
  );
}

export default function TVDetail() {
  const { id } = useParams();
  const [show, setShow]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [trailerKey, setTrailer]  = useState(null);
  const [player, setPlayer]       = useState(null); // { season, episode }
  const [selectedSeason, setSeason] = useState(1);
  const [seasonData, setSeasonData] = useState(null);
  const [seasonLoading, setSeasonLoading] = useState(false);

  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { addToHistory } = useWatchHistory();

  const fetchShow = async () => {
    setLoading(true); setError(null);
    try { setShow(await getTVDetail(id)); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchShow(); window.scrollTo(0, 0); }, [id]);

  // Load season when selected
  useEffect(() => {
    if (!show) return;
    setSeasonLoading(true);
    getTVSeason(id, selectedSeason)
      .then(setSeasonData)
      .catch(() => setSeasonData(null))
      .finally(() => setSeasonLoading(false));
  }, [id, show, selectedSeason]);

  if (loading) return <DetailSkeleton />;
  if (error)   return <div className="pt-24"><ErrorState message={error} onRetry={fetchShow} /></div>;
  if (!show)   return null;

  const trailer   = show.videos?.results?.find((v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'));
  const cast      = show.credits?.cast?.slice(0, 10) || [];
  const similar   = show.similar?.results?.slice(0, 12) || [];
  const providers = show['watch/providers']?.results?.US;
  const seasons   = show.seasons?.filter((s) => s.season_number > 0) || [];
  const backdrop  = getBackdropUrl(show.backdrop_path);
  const fav       = isFavorite(show.id);
  const inList    = isInWatchlist(show.id);

  return (
    <div className="fade-in min-h-screen">
      {/* Backdrop */}
      <div className="relative h-[55vh] min-h-[360px] overflow-hidden">
        {backdrop && <img src={backdrop} alt={show.name} className="w-full h-full object-cover object-top" />}
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
            <img src={getPosterUrl(show.poster_path)} alt={show.name} className="w-full rounded-2xl shadow-2xl shadow-black/70 ring-1 ring-white/10" onError={(e) => { e.target.src = '/placeholder-poster.svg'; }} />
          </div>

          {/* Info */}
          <div className="flex-1 pt-4 md:pt-24">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2 py-0.5 bg-brand rounded font-bold uppercase tracking-wider">TV Series</span>
              {show.status && <span className="text-xs text-zinc-400">{show.status}</span>}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">{show.name}</h1>
            {show.tagline && <p className="text-zinc-400 italic mt-1 text-sm">{show.tagline}</p>}

            <div className="flex flex-wrap items-center gap-3 mt-4 text-sm text-zinc-300">
              {show.vote_average > 0 && (
                <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                  <Star size={15} fill="currentColor" /> {formatRating(show.vote_average)}<span className="text-zinc-500 font-normal">/ 10</span>
                </span>
              )}
              {show.first_air_date && (
                <span className="flex items-center gap-1"><Calendar size={14} className="text-zinc-500" />{show.first_air_date}</span>
              )}
              {show.number_of_seasons > 0 && (
                <span className="flex items-center gap-1"><Clock size={14} className="text-zinc-500" />{show.number_of_seasons} mùa · {show.number_of_episodes} tập</span>
              )}
            </div>

            {show.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {show.genres.map((g) => <span key={g.id} className="text-xs font-medium px-3 py-1 rounded-full bg-surface-elevated border border-white/10 text-zinc-300">{g.name}</span>)}
              </div>
            )}

            {show.overview && <p className="mt-5 text-zinc-300 leading-relaxed max-w-2xl">{show.overview}</p>}

            <div className="flex flex-wrap gap-3 mt-6">
              {trailer && (
                <button onClick={() => { setTrailer(trailer.key); addToHistory({ ...show, type: 'tv' }); }} className="btn-primary">
                  <Play size={18} fill="white" /> Xem Trailer
                </button>
              )}
              <button onClick={() => toggleFavorite(show)} className={`btn-secondary ${fav ? 'text-brand' : ''}`}>
                <Heart size={18} fill={fav ? 'currentColor' : 'none'} /> {fav ? 'Đã yêu thích' : 'Yêu thích'}
              </button>
              <button onClick={() => toggleWatchlist({ ...show, name: show.name, media_type: 'tv' })} className={`btn-secondary ${inList ? 'text-green-400' : ''}`}>
                {inList ? <Check size={18} /> : <Plus size={18} />} {inList ? 'Trong danh sách' : 'Thêm vào danh sách'}
              </button>
            </div>

            {providers && (
              <div className="mt-6">
                <p className="text-xs text-zinc-500 mb-2 flex items-center gap-1"><Globe size={12} /> Xem trực tuyến tại (Mỹ)</p>
                <div className="flex flex-wrap gap-2">
                  {(providers.flatrate || providers.free || []).map((p) => (
                    <div key={p.provider_id} className="flex items-center gap-1.5 bg-surface-elevated rounded-lg px-2.5 py-1.5 text-xs">
                      {p.logo_path && <img src={`https://image.tmdb.org/t/p/w45${p.logo_path}`} alt={p.provider_name} className="w-5 h-5 rounded-sm" />}
                      <span className="text-zinc-300">{p.provider_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Episodes section */}
        {seasons.length > 0 && (
          <section className="mt-14">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title mb-0">Danh Sách Tập</h2>
              {seasons.length > 1 && (
                <div className="relative">
                  <select
                    value={selectedSeason}
                    onChange={(e) => setSeason(Number(e.target.value))}
                    className="appearance-none bg-surface-elevated border border-white/10 text-sm text-white rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-brand cursor-pointer"
                  >
                    {seasons.map((s) => (
                      <option key={s.season_number} value={s.season_number}>
                        Mùa {s.season_number} ({s.episode_count} tập)
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                </div>
              )}
            </div>

            {seasonLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex gap-4 p-3 animate-pulse">
                    <div className="w-40 aspect-video bg-surface-elevated rounded-lg shrink-0" />
                    <div className="flex-1 space-y-2 pt-1">
                      <div className="h-3 bg-surface-elevated rounded w-1/4" />
                      <div className="h-4 bg-surface-elevated rounded w-2/3" />
                      <div className="h-3 bg-surface-elevated rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : seasonData?.episodes?.length > 0 ? (
              <div className="divide-y divide-white/5">
                {seasonData.episodes.map((ep) => (
                  <EpisodeCard
                    key={ep.id}
                    ep={ep}
                    onWatch={() => setPlayer({ season: selectedSeason, episode: ep.episode_number })}
                  />
                ))}
              </div>
            ) : (
              <p className="text-zinc-500 text-sm py-4">Chưa có thông tin về tập phim.</p>
            )}
          </section>
        )}

        {/* Cast */}
        {cast.length > 0 && (
          <section className="mt-14">
            <h2 className="section-title">Diễn Viên</h2>
            <div className="flex gap-4 overflow-x-auto pb-3" style={{ scrollbarWidth: 'none' }}>
              {cast.map((person) => (
                <Link to={`/person/${person.id}`} key={person.id} className="shrink-0 w-24 text-center group">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-surface-elevated mx-auto ring-2 ring-white/10 group-hover:ring-brand transition-all">
                    <img src={getAvatarUrl(person.profile_path)} alt={person.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = '/placeholder-avatar.svg'; }} />
                  </div>
                  <p className="text-xs font-semibold text-white mt-2 truncate group-hover:text-brand transition-colors">{person.name}</p>
                  <p className="text-xs text-zinc-500 truncate">{person.character}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {similar.length > 0 && (
          <section className="mt-14">
            <h2 className="section-title">TV Shows Tương Tự</h2>
            <MovieGrid movies={similar} loading={false} error={null} />
          </section>
        )}
      </div>

      {trailerKey && <TrailerModal videoKey={trailerKey} onClose={() => setTrailer(null)} />}
      {player && (
        <VideoPlayer
          tmdbId={show.id}
          type="tv"
          season={player.season}
          episode={player.episode}
          title={show.name}
          onClose={() => setPlayer(null)}
        />
      )}
    </div>
  );
}
