import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, Plus, Check, Info, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { getBackdropUrl, formatYear, formatRating } from '../utils/imageUrl';
import { useWatchlist } from '../hooks/useWatchlist';
import TrailerModal from './TrailerModal';

const INTERVAL = 6000; // 6 giây mỗi slide
const MAX_SLIDES = 10; // hiện tối đa 10 phim

export default function HeroBanner({ movies, onRefresh }) {
  const [index, setIndex]       = useState(0);
  const [trailerKey, setTrailer] = useState(null);
  const [progress, setProgress]  = useState(0);
  const [paused, setPaused]      = useState(false);
  const intervalRef = useRef(null);
  const progressRef = useRef(null);
  const startRef    = useRef(null);

  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  const slides = movies?.filter((m) => m.backdrop_path).slice(0, MAX_SLIDES) || [];
  const total  = slides.length;

  const goTo = useCallback((i) => {
    setIndex((i + total) % total);
    setProgress(0);
    startRef.current = Date.now();
  }, [total]);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Auto-advance with smooth progress bar
  useEffect(() => {
    if (!total || paused) return;

    startRef.current = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min((elapsed / INTERVAL) * 100, 100);
      setProgress(pct);

      if (elapsed >= INTERVAL) {
        setIndex((i) => (i + 1) % total);
        setProgress(0);
        startRef.current = Date.now();
      }
    };

    progressRef.current = setInterval(tick, 50);
    return () => clearInterval(progressRef.current);
  }, [total, paused, index]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft')  prev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev]);

  if (!slides.length) return null;

  const movie   = slides[index];
  const backdrop = getBackdropUrl(movie.backdrop_path);
  const trailer  = movie.videos?.results?.find((v) => v.site === 'YouTube' && v.type === 'Trailer');
  const inList   = isInWatchlist(movie.id);

  return (
    <>
      <div
        className="relative h-[75vh] min-h-[500px] max-h-[780px] overflow-hidden mt-16 select-none"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Backdrop — preload tiếp theo để tránh nhấp nháy */}
        {slides.map((m, i) => {
          const bg = getBackdropUrl(m.backdrop_path);
          return (
            <div
              key={m.id}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
              style={{
                backgroundImage: bg ? `url(${bg})` : 'none',
                opacity: i === index ? 1 : 0,
                zIndex: i === index ? 1 : 0,
              }}
            />
          );
        })}

        {/* Gradient overlays */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-surface via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-20 h-full flex items-end pb-16 px-4 sm:px-10 lg:px-16 max-w-7xl mx-auto">
          <div key={movie.id} className="max-w-2xl fade-in">
            {/* Meta badges */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {movie.vote_average > 0 && (
                <span className="flex items-center gap-1 text-yellow-400 text-sm font-bold bg-black/40 px-2 py-0.5 rounded-md">
                  <Star size={13} fill="currentColor" /> {formatRating(movie.vote_average)}
                </span>
              )}
              <span className="text-zinc-400 text-sm bg-black/30 px-2 py-0.5 rounded-md">
                {formatYear(movie.release_date)}
              </span>
              {movie.original_language && movie.original_language !== 'en' && (
                <span className="text-xs text-zinc-400 uppercase bg-black/30 px-2 py-0.5 rounded-md tracking-widest">
                  {movie.original_language}
                </span>
              )}
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4 drop-shadow-2xl">
              {movie.title}
            </h1>

            {movie.overview && (
              <p className="text-zinc-300 text-sm sm:text-base line-clamp-2 mb-8 max-w-xl leading-relaxed">
                {movie.overview}
              </p>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {trailer ? (
                <button onClick={() => setTrailer(trailer.key)} className="btn-primary text-base px-6 py-3 shadow-lg">
                  <Play size={20} fill="white" /> Xem Trailer
                </button>
              ) : (
                <Link to={`/movie/${movie.id}`} className="btn-primary text-base px-6 py-3 shadow-lg">
                  <Play size={20} fill="white" /> Xem Ngay
                </Link>
              )}

              <button onClick={() => toggleWatchlist(movie)} className="btn-secondary text-base px-6 py-3">
                {inList ? <Check size={20} /> : <Plus size={20} />}
                {inList ? 'Đã lưu' : 'Danh sách'}
              </button>

              <Link to={`/movie/${movie.id}`}
                className="flex items-center justify-center w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-colors"
                title="Xem chi tiết"
              >
                <Info size={20} />
              </Link>
            </div>
          </div>
        </div>

        {/* Prev / Next arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center bg-black/40 hover:bg-black/70 rounded-full transition-all opacity-0 hover:opacity-100 group-hover:opacity-100 backdrop-blur-sm"
          aria-label="Slide trước"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center bg-black/40 hover:bg-black/70 rounded-full transition-all opacity-0 hover:opacity-100 group-hover:opacity-100 backdrop-blur-sm"
          aria-label="Slide tiếp theo"
        >
          <ChevronRight size={22} />
        </button>

        {/* Bottom controls: dots + progress bar */}
        <div className="absolute bottom-5 right-6 z-30 flex flex-col items-end gap-2">
          {/* Dots */}
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? 'bg-white w-6' : 'bg-white/30 w-1.5 hover:bg-white/60'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Progress bar cho slide hiện tại */}
          <div className="w-24 h-0.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {trailerKey && <TrailerModal videoKey={trailerKey} onClose={() => setTrailer(null)} />}
    </>
  );
}
