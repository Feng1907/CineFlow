import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Plus, Check, Info, Star } from 'lucide-react';
import { getBackdropUrl, formatYear, formatRating } from '../utils/imageUrl';
import { useWatchlist } from '../hooks/useWatchlist';
import TrailerModal from './TrailerModal';

export default function HeroBanner({ movies }) {
  const [index, setIndex]       = useState(0);
  const [trailerKey, setTrailer] = useState(null);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  useEffect(() => {
    if (!movies?.length) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % Math.min(movies.length, 5)), 7000);
    return () => clearInterval(timer);
  }, [movies]);

  if (!movies?.length) return null;

  const movie   = movies[index];
  const backdrop = getBackdropUrl(movie.backdrop_path);
  const trailer  = movie.videos?.results?.find((v) => v.site === 'YouTube' && v.type === 'Trailer');
  const inList   = isInWatchlist(movie.id);

  return (
    <>
      <div className="relative h-[75vh] min-h-[500px] max-h-[780px] overflow-hidden">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: backdrop ? `url(${backdrop})` : undefined }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-black/20" />

        {/* Content */}
        <div className="relative h-full flex items-end pb-20 px-4 sm:px-10 lg:px-16 max-w-7xl mx-auto">
          <div className="max-w-2xl fade-in" key={movie.id}>
            {/* Meta */}
            <div className="flex items-center gap-3 mb-3">
              <span className="flex items-center gap-1 text-yellow-400 text-sm font-semibold">
                <Star size={14} fill="currentColor" /> {formatRating(movie.vote_average)}
              </span>
              <span className="text-zinc-400 text-sm">•</span>
              <span className="text-zinc-400 text-sm">{formatYear(movie.release_date)}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4 drop-shadow-2xl">
              {movie.title}
            </h1>

            <p className="text-zinc-300 text-sm sm:text-base line-clamp-3 mb-8 max-w-xl">
              {movie.overview}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {trailer ? (
                <button onClick={() => setTrailer(trailer.key)} className="btn-primary text-base px-6 py-3">
                  <Play size={20} fill="white" /> Xem Trailer
                </button>
              ) : (
                <Link to={`/movie/${movie.id}`} className="btn-primary text-base px-6 py-3">
                  <Play size={20} fill="white" /> Xem Ngay
                </Link>
              )}

              <button
                onClick={() => toggleWatchlist(movie)}
                className="btn-secondary text-base px-6 py-3"
              >
                {inList ? <Check size={20} /> : <Plus size={20} />}
                {inList ? 'Đã lưu' : 'Danh sách'}
              </button>

              <Link to={`/movie/${movie.id}`} className="flex items-center justify-center w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-colors" title="Xem chi tiết">
                <Info size={20} />
              </Link>
            </div>
          </div>
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-8 right-8 flex gap-1.5">
          {movies.slice(0, 5).map((_, i) => (
            <button key={i} onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'bg-white w-6' : 'bg-white/40 w-1.5 hover:bg-white/70'}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {trailerKey && <TrailerModal videoKey={trailerKey} onClose={() => setTrailer(null)} />}
    </>
  );
}
