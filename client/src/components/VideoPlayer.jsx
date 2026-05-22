import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle, Server, RefreshCw, ChevronDown, Shield } from 'lucide-react';

const SERVERS = [
  {
    id: 'embedsu',
    label: 'Embed.su',
    movie: (id) => `https://embed.su/embed/movie/${id}`,
    tv:    (id, s, e) => `https://embed.su/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: 'autoembed',
    label: 'AutoEmbed',
    movie: (id) => `https://autoembed.co/movie/tmdb/${id}`,
    tv:    (id, s, e) => `https://autoembed.co/tv/tmdb/${id}-${s}-${e}`,
  },
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
    id: 'vidsrcxyz',
    label: 'VidSrc #3',
    movie: (id) => `https://vidsrc.xyz/embed/movie/${id}`,
    tv:    (id, s, e) => `https://vidsrc.xyz/embed/tv?tmdb=${id}&season=${s}&episode=${e}`,
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
  {
    id: 'moviesapi',
    label: 'MoviesAPI',
    movie: (id) => `https://moviesapi.club/movie/${id}`,
    tv:    (id, s, e) => `https://moviesapi.club/tv/${id}-${s}-${e}`,
  },
];

export default function VideoPlayer({ tmdbId, type = 'movie', season, episode, title, onClose }) {
  const [serverId, setServerId] = useState('embedsu');
  const [key, setKey]           = useState(0);
  const [blockAds, setBlockAds] = useState(true);
  const [dropOpen, setDrop]     = useState(false);

  const server = SERVERS.find((s) => s.id === serverId) || SERVERS[0];
  const src = type === 'tv' && season && episode
    ? server.tv(tmdbId, season, episode)
    : server.movie(tmdbId);

  const switchServer = useCallback((id) => {
    setServerId(id);
    setKey((k) => k + 1);
    setDrop(false);
  }, []);

  const reload = () => setKey((k) => k + 1);
  const toggleAds = () => { setBlockAds((v) => !v); setKey((k) => k + 1); };

  useEffect(() => {
    const prev = document.body.style.overflow;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[999] flex flex-col bg-black">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-white/10 shrink-0 gap-3">
        {/* Title */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white truncate">{title}</p>
          {type === 'tv' && season && episode && (
            <p className="text-xs text-zinc-400">Mùa {season} · Tập {episode}</p>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Server dropdown */}
          <div className="relative">
            <button
              onClick={() => setDrop((v) => !v)}
              className="flex items-center gap-1.5 bg-brand text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-brand-hover transition-colors"
            >
              <Server size={12} />
              {server.label}
              <ChevronDown size={12} className={dropOpen ? 'rotate-180' : ''} />
            </button>

            {dropOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-zinc-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-10">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest px-3 pt-2 pb-1">
                  Chọn server ({SERVERS.length})
                </p>
                {SERVERS.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => switchServer(s.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors ${
                      serverId === s.id
                        ? 'bg-brand/20 text-brand font-semibold'
                        : 'text-zinc-300 hover:bg-white/5'
                    }`}
                  >
                    <span>{s.label}</span>
                    {serverId === s.id && <span className="text-[10px]">▶ Đang dùng</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Block ads toggle */}
          <button
            onClick={toggleAds}
            title={blockAds ? 'Đang chặn popup ads — click để tắt' : 'Popup chưa chặn — click để bật'}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              blockAds ? 'bg-green-700/80 text-green-200' : 'bg-white/10 text-zinc-400'
            }`}
          >
            <Shield size={12} />
            <span className="hidden sm:inline">{blockAds ? 'Ads OFF' : 'Ads ON'}</span>
          </button>

          {/* Reload */}
          <button onClick={reload} title="Tải lại"
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <RefreshCw size={15} />
          </button>

          {/* Close */}
          <button onClick={onClose} aria-label="Đóng"
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Player */}
      <div className="flex-1 relative bg-black" onClick={() => setDrop(false)}>
        <iframe
          key={key}
          src={src}
          allowFullScreen
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          sandbox={blockAds
            ? 'allow-scripts allow-same-origin allow-forms allow-presentation allow-pointer-lock allow-fullscreen'
            : undefined}
          className="w-full h-full border-0"
          title={title}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 px-4 py-1.5 bg-zinc-900/90 text-xs text-zinc-500 shrink-0">
        <AlertTriangle size={11} className="text-yellow-500 shrink-0" />
        Server: <span className="text-zinc-400 font-medium">{server.label}</span>
        &nbsp;· Nếu lỗi hãy thử server khác. CineFlow không lưu trữ file phim.
      </div>
    </div>,
    document.body
  );
}
