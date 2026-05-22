import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle } from 'lucide-react';

/**
 * VideoPlayer — nhúng VidSrc embed player qua portal
 * Props:
 *   tmdbId      — TMDB movie/show ID
 *   type        — 'movie' | 'tv'
 *   season      — số mùa (chỉ dùng với tv)
 *   episode     — số tập (chỉ dùng với tv)
 *   title       — tên phim (hiện trên header)
 *   onClose     — callback đóng player
 */
export default function VideoPlayer({ tmdbId, type = 'movie', season, episode, title, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // VidSrc embed URL
  const src = type === 'tv' && season && episode
    ? `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`
    : `https://vidsrc.to/embed/movie/${tmdbId}`;

  return createPortal(
    <div
      className="fixed inset-0 z-[999] flex flex-col bg-black"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-white/10 shrink-0">
        <div>
          <p className="text-sm font-semibold text-white truncate max-w-lg">{title}</p>
          {type === 'tv' && season && episode && (
            <p className="text-xs text-zinc-400">Mùa {season} · Tập {episode}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors ml-4 shrink-0"
          aria-label="Đóng player"
        >
          <X size={20} />
        </button>
      </div>

      {/* Player */}
      <div className="flex-1 relative">
        <iframe
          src={src}
          allowFullScreen
          allow="autoplay; encrypted-media; fullscreen"
          className="w-full h-full border-0"
          title={title}
        />
      </div>

      {/* Disclaimer */}
      <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/80 text-xs text-zinc-500 shrink-0">
        <AlertTriangle size={12} className="text-yellow-500 shrink-0" />
        Nội dung được cung cấp bởi bên thứ ba (VidSrc). CineFlow không lưu trữ bất kỳ file phim nào.
      </div>
    </div>,
    document.body
  );
}
