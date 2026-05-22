import { useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import HoverCard from './HoverCard';

// Single card width in the carousel
function CarouselCard({ movie, mediaType }) {
  const [hovered, setHovered] = useState(false);
  const [cardRect, setCardRect] = useState(null);
  const timerRef = useRef(null);
  const ref = useRef(null);

  const type = mediaType || (movie.name ? 'tv' : 'movie');
  const title = movie.title || movie.name || '';
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : '/placeholder-poster.svg';
  const to = `/${type}/${movie.id}`;

  const handleEnter = () => {
    timerRef.current = setTimeout(() => {
      if (ref.current) setCardRect(ref.current.getBoundingClientRect());
      setHovered(true);
    }, 450);
  };

  const handleLeave = () => {
    clearTimeout(timerRef.current);
    setHovered(false);
  };

  return (
    <div
      ref={ref}
      className="relative shrink-0 w-32 sm:w-36 md:w-40 lg:w-44"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <Link to={to} className="block group">
        <div className="aspect-[2/3] rounded-lg overflow-hidden bg-surface-elevated">
          <img
            src={poster}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => { e.target.src = '/placeholder-poster.svg'; }}
          />
        </div>
        <p className="text-xs text-zinc-300 mt-1.5 truncate px-0.5">{title}</p>
      </Link>

      {hovered && cardRect && (
        <HoverCard movie={movie} mediaType={type} cardRect={cardRect} onClose={handleLeave} />
      )}
    </div>
  );
}

export default function CarouselRow({ title, movies = [], loading, to, mediaType }) {
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft]   = useState(false);
  const [showRight, setShowRight] = useState(true);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 10);
    setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.75, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="mb-8">
        <div className="h-6 w-48 bg-surface-elevated rounded animate-pulse mb-3" />
        <div className="flex gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="shrink-0 w-32 sm:w-36 md:w-40 lg:w-44 aspect-[2/3] bg-surface-elevated rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!movies?.length) return null;

  return (
    <div className="mb-10 group/row">
      {/* Section header */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <div className="flex items-center gap-2">
          <span className="w-1 h-5 bg-brand rounded-full" />
          <h2 className="text-base md:text-lg font-bold text-white">{title}</h2>
          {to && (
            <Link to={to} className="text-xs text-brand opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center gap-0.5 ml-1">
              Xem tất cả <ChevronRight size={12} />
            </Link>
          )}
        </div>
      </div>

      {/* Scrollable row */}
      <div className="relative">
        {/* Left arrow */}
        {showLeft && (
          <button
            onClick={() => scroll(-1)}
            className="absolute left-0 top-0 bottom-4 z-20 w-10 flex items-center justify-center bg-gradient-to-r from-surface to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity hover:from-black/80"
            aria-label="Cuộn trái"
          >
            <ChevronLeft className="text-white drop-shadow-lg" size={28} />
          </button>
        )}

        {/* Right arrow */}
        {showRight && (
          <button
            onClick={() => scroll(1)}
            className="absolute right-0 top-0 bottom-4 z-20 w-10 flex items-center justify-center bg-gradient-to-l from-surface to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity hover:from-black/80"
            aria-label="Cuộn phải"
          >
            <ChevronRight className="text-white drop-shadow-lg" size={28} />
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={updateArrows}
          className="flex gap-3 overflow-x-auto pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <CarouselCard key={movie.id} movie={movie} mediaType={mediaType} />
          ))}
        </div>
      </div>
    </div>
  );
}
