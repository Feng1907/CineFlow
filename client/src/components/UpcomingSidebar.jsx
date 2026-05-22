import { Link } from 'react-router-dom';
import { getPosterUrl, formatYear } from '../utils/imageUrl';
import { Star } from 'lucide-react';

// Render 1–5 filled/empty stars based on rating out of 10
function Stars({ rating }) {
  const filled = Math.round((rating / 10) * 5);
  return (
    <div className="flex gap-0.5 mt-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={11}
          className={i < filled ? 'text-yellow-400' : 'text-zinc-600'}
          fill="currentColor"
        />
      ))}
    </div>
  );
}

export default function UpcomingSidebar({ movies = [], loading }) {
  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-14 h-20 bg-surface-elevated rounded-lg shrink-0" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-3.5 bg-surface-elevated rounded w-4/5" />
              <div className="h-3 bg-surface-elevated rounded w-1/3" />
              <div className="flex gap-0.5 mt-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className="w-3 h-3 bg-surface-elevated rounded-sm" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <ul className="space-y-1">
      {movies.slice(0, 8).map((movie) => (
        <li key={movie.id}>
          <Link
            to={`/movie/${movie.id}`}
            className="flex gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group"
          >
            <img
              src={getPosterUrl(movie.poster_path)}
              alt={movie.title}
              className="w-14 h-20 object-cover rounded-lg shrink-0 ring-1 ring-white/10"
              onError={(e) => { e.target.src = '/placeholder-poster.svg'; }}
            />
            <div className="flex-1 min-w-0 pt-1">
              <p className="text-sm font-semibold text-zinc-200 group-hover:text-white leading-tight line-clamp-2">
                {movie.title}
              </p>
              <p className="text-xs text-zinc-500 mt-1">{formatYear(movie.release_date)}</p>
              <Stars rating={movie.vote_average} />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
