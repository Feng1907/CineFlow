import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Plus, Check, Info, Star } from 'lucide-react';
import { useWatchlist } from '../hooks/useWatchlist';
import { useWatchHistory } from '../hooks/useWatchHistory';
import { formatYear, formatRating } from '../utils/imageUrl';

export default function HoverCard({ movie, mediaType, cardRect, onClose }) {
  const navigate  = useNavigate();
  const ref = useRef(null);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { addToHistory } = useWatchHistory();

  const type    = mediaType || (movie.name ? 'tv' : 'movie');
  const title   = movie.title || movie.name || '';
  const year    = formatYear(movie.release_date || movie.first_air_date);
  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
    : movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;
  const inList = isInWatchlist(movie.id);

  // Position card relative to viewport
  const cardWidth = 280;
  const vw = window.innerWidth;
  let left = cardRect.left + cardRect.width / 2 - cardWidth / 2;
  if (left < 8) left = 8;
  if (left + cardWidth > vw - 8) left = vw - cardWidth - 8;

  const top = cardRect.top + window.scrollY - 20;

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const handlePlay = (e) => {
    e.preventDefault();
    addToHistory(movie);
    navigate(`/${type}/${movie.id}`);
    onClose();
  };

  return createPortal(
    <div
      ref={ref}
      onMouseLeave={onClose}
      style={{ position: 'absolute', top, left, width: cardWidth, zIndex: 9999 }}
      className="bg-surface-card rounded-xl shadow-2xl shadow-black/70 overflow-hidden border border-white/10 animate-hovercard"
    >
      {/* Backdrop */}
      <div className="aspect-video bg-surface-elevated relative">
        {backdrop && (
          <img src={backdrop} alt={title} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-card to-transparent" />
        <p className="absolute bottom-2 left-3 right-3 font-bold text-sm leading-tight drop-shadow-lg line-clamp-2">
          {title}
        </p>
      </div>

      {/* Actions */}
      <div className="px-3 pt-2 pb-1 flex items-center gap-2">
        <button
          onClick={handlePlay}
          className="flex items-center justify-center w-9 h-9 bg-white hover:bg-zinc-200 rounded-full transition-colors"
          title="Xem ngay"
        >
          <Play size={16} fill="black" className="text-black ml-0.5" />
        </button>

        <button
          onClick={(e) => { e.preventDefault(); toggleWatchlist(movie); }}
          className="flex items-center justify-center w-9 h-9 bg-surface-elevated hover:bg-zinc-600 border border-white/30 rounded-full transition-colors"
          title={inList ? 'Xóa khỏi danh sách' : 'Thêm vào danh sách'}
        >
          {inList ? <Check size={16} className="text-brand" /> : <Plus size={16} />}
        </button>

        <Link
          to={`/${type}/${movie.id}`}
          onClick={onClose}
          className="ml-auto flex items-center justify-center w-9 h-9 bg-surface-elevated hover:bg-zinc-600 border border-white/30 rounded-full transition-colors"
          title="Xem chi tiết"
        >
          <Info size={16} />
        </Link>
      </div>

      {/* Meta */}
      <div className="px-3 pb-3 space-y-1">
        <div className="flex items-center gap-2 text-xs text-zinc-300">
          {movie.vote_average > 0 && (
            <span className="flex items-center gap-0.5 text-yellow-400 font-semibold">
              <Star size={11} fill="currentColor" />
              {formatRating(movie.vote_average)}
            </span>
          )}
          <span className="text-zinc-500">{year}</span>
        </div>
        {movie.overview && (
          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{movie.overview}</p>
        )}
      </div>
    </div>,
    document.body
  );
}
