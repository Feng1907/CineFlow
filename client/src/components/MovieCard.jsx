import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { getPosterUrl, formatYear, formatRating } from '../utils/imageUrl';
import { useFavorites } from '../hooks/useFavorites';

export default function MovieCard({ movie }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(movie.id);

  const handleFav = (e) => {
    e.preventDefault(); // don't navigate
    toggleFavorite(movie);
  };

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="group relative block bg-surface-card rounded-xl overflow-hidden card-hover"
    >
      {/* Poster */}
      <div className="aspect-[2/3] overflow-hidden bg-surface-elevated">
        <img
          src={getPosterUrl(movie.poster_path)}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.target.src = '/placeholder-poster.svg'; }}
        />
      </div>

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Favorite button */}
      <button
        onClick={handleFav}
        aria-label={fav ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
        className={`absolute top-2 right-2 p-1.5 rounded-full transition-all duration-200 ${
          fav
            ? 'bg-brand text-white'
            : 'bg-black/50 text-zinc-400 opacity-0 group-hover:opacity-100 hover:text-white'
        }`}
      >
        <Heart size={14} fill={fav ? 'currentColor' : 'none'} />
      </button>

      {/* Rating badge */}
      {movie.vote_average > 0 && (
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 text-yellow-400 text-xs font-semibold px-2 py-0.5 rounded-full">
          <Star size={11} fill="currentColor" />
          {formatRating(movie.vote_average)}
        </div>
      )}

      {/* Title + year */}
      <div className="p-3">
        <p className="font-semibold text-sm leading-tight truncate text-white">{movie.title}</p>
        <p className="text-xs text-zinc-400 mt-0.5">{formatYear(movie.release_date)}</p>
      </div>
    </Link>
  );
}
