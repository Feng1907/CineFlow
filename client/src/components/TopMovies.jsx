import { Link } from 'react-router-dom';
import { getPosterUrl, formatRating } from '../utils/imageUrl';
import { Star } from 'lucide-react';

export default function TopMovies({ movies = [], loading }) {
  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex gap-3 items-center">
            <div className="w-7 h-7 rounded-full bg-surface-elevated shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 bg-surface-elevated rounded w-4/5" />
              <div className="h-3 bg-surface-elevated rounded w-2/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <ol className="space-y-1">
      {movies.slice(0, 10).map((movie, i) => (
        <li key={movie.id}>
          <Link
            to={`/movie/${movie.id}`}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group"
          >
            {/* Rank number */}
            <span className={`shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-sm font-extrabold ${
              i === 0 ? 'bg-brand text-white' :
              i === 1 ? 'bg-zinc-500 text-white' :
              i === 2 ? 'bg-amber-700 text-white' :
              'bg-surface-elevated text-zinc-400'
            }`}>
              {i + 1}
            </span>

            {/* Poster thumbnail */}
            <img
              src={getPosterUrl(movie.poster_path)}
              alt={movie.title}
              className="w-9 h-12 object-cover rounded-md shrink-0"
              onError={(e) => { e.target.src = '/placeholder-poster.svg'; }}
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-200 group-hover:text-white truncate leading-tight">
                {movie.title}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <Star size={11} className="text-yellow-400" fill="currentColor" />
                <span className="text-xs text-zinc-400">{formatRating(movie.vote_average)}</span>
                <span className="text-zinc-600 text-xs">·</span>
                <span className="text-xs text-zinc-500">
                  {(movie.vote_count / 1000).toFixed(1)}k lượt
                </span>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ol>
  );
}
