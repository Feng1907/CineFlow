import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, Star } from 'lucide-react';
import { getBackdropUrl, getPosterUrl, formatYear, formatRating } from '../utils/imageUrl';

export default function HeroBanner({ movies }) {
  const [index, setIndex] = useState(0);

  // Cycle through first 5 trending movies every 7 seconds
  useEffect(() => {
    if (!movies?.length) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % Math.min(movies.length, 5)), 7000);
    return () => clearInterval(timer);
  }, [movies]);

  if (!movies?.length) return null;

  const movie = movies[index];
  const backdrop = getBackdropUrl(movie.backdrop_path);

  return (
    <div className="relative h-[70vh] min-h-[480px] max-h-[700px] overflow-hidden">
      {/* Backdrop image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: backdrop ? `url(${backdrop})` : undefined }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-black/30" />

      {/* Content */}
      <div className="relative h-full flex items-end pb-16 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="max-w-xl fade-in" key={movie.id}>
          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center gap-1 text-yellow-400 text-sm font-semibold">
              <Star size={14} fill="currentColor" />
              {formatRating(movie.vote_average)}
            </span>
            <span className="text-zinc-400 text-sm">•</span>
            <span className="text-zinc-400 text-sm">{formatYear(movie.release_date)}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4 drop-shadow-lg">
            {movie.title}
          </h1>

          <p className="text-zinc-300 text-sm sm:text-base line-clamp-3 mb-6">
            {movie.overview}
          </p>

          <div className="flex items-center gap-3">
            <Link to={`/movie/${movie.id}`} className="btn-primary">
              <Info size={18} /> Xem chi tiết
            </Link>
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-6 right-6 flex gap-1.5">
        {movies.slice(0, 5).map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === index ? 'bg-brand w-5' : 'bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
