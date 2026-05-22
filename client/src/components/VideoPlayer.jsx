import { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle, Server, RefreshCw } from 'lucide-react';

// Danh sách server embed hỗ trợ
const SERVERS = [
  {
    id: 'vidsrc',
    label: 'VidSrc',
    movie: (id) => `https://vidsrc.to/embed/movie/${id}`,
    tv:    (id, s, e) => `https://vidsrc.to/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: 'vidsrc2',
    label: 'VidSrc #2',
    movie: (id) => `https://vidsrc.me/embed/movie?tmdb=${id}`,
    tv:    (id, s, e) => `https://vidsrc.me/embed/tv?tmdb=${id}&season=${s}&episode=${e}`,
  },
  {
    id: '2embed',
    label: '2Embed',
    movie: (id) => `https://www.2embed.cc/embed/${id}`,
    tv:    (id, s, e) => `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`,
  },
  {
    id: 'multiembed',
    label: 'MultiEmbed',
    movie: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1`,
    tv:    (id, s, e) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}`,
  },
];

export default function VideoPlayer({ tmdbId, type = 'movie', season, episode, title, onClose }) {
  const [serverId, setServerId] = useState('vidsrc');
  const [key, setKey] = useState(0); // force iframe reload

  const server = SERVERS.find((s) => s.id === serverId) || SERVERS[0];

  const src = type === 'tv' && season && episode
    ? server.tv(tmdbId, season, episode)
    : server.movie(tmdbId);

  const switchServer = useCallback((id) => {
    setServerId(id);
    setKey((k) => k + 1); // reload iframe
  }, []);

  const reload = () => setKey((k) => k + 1);

  // ESC to close
  useState(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  });

  return createPortal(
    <div className="fixed inset-0 z-[999] flex flex-col bg-black">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-white/10 shrink-0 gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">{title}</p>
          {type === 'tv' && season && episode && (
            <p className="text-xs text-zinc-400">Mùa {season} · Tập {episode}</p>
          )}
        </div>

        {/* Server selector */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Server size={13} className="text-zinc-500 hidden sm:block" />
          <span className="text-xs text-zinc-500 mr-1 hidden sm:block">Server:</span>
          {SERVERS.map((s) => (
            <button
              key={s.id}
              onClick={() => switchServer(s.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                serverId === s.id
                  ? 'bg-brand text-white'
                  : 'bg-white/10 text-zinc-300 hover:bg-white/20'
              }`}
            >
              {s.label}
            </button>
          ))}

          {/* Reload button */}
          <button
            onClick={reload}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-md transition-colors ml-1"
            title="Tải lại"
          >
            <RefreshCw size={14} />
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-md transition-colors ml-1"
            aria-label="Đóng player"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Player */}
      <div className="flex-1 relative bg-black">
        <iframe
          key={key}
          src={src}
          allowFullScreen
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          className="w-full h-full border-0"
          title={title}
        />
      </div>

      {/* Disclaimer */}
      <div className="flex items-center gap-2 px-4 py-1.5 bg-zinc-900/80 text-xs text-zinc-500 shrink-0">
        <AlertTriangle size={11} className="text-yellow-500 shrink-0" />
        Nội dung từ bên thứ ba ({server.label}). Nếu không xem được, hãy thử server khác.
        CineFlow không lưu trữ bất kỳ file phim nào.
      </div>
    </div>,
    document.body
  );
}
