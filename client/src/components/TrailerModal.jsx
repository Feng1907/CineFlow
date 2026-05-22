import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2 } from 'lucide-react';

export default function TrailerModal({ videoKey, onClose }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const prev = document.body.style.overflow;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    // Luôn restore overflow kể cả khi navigate trang trong lúc modal đang mở
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  // createPortal đảm bảo modal render trực tiếp vào document.body
  // tránh bị ảnh hưởng bởi CSS transform/animation của component cha
  return createPortal(
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-black rounded-2xl overflow-hidden shadow-2xl"
        style={{ width: 'calc(100vw - 2rem)', maxWidth: '56rem', aspectRatio: '16/9' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-black/70 hover:bg-black text-white p-1.5 rounded-full transition-colors"
          aria-label="Đóng trailer"
        >
          <X size={20} />
        </button>
        {/* Loading skeleton */}
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
            <Loader2 size={36} className="animate-spin text-brand" />
          </div>
        )}
        <iframe
          src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
          allow="autoplay; encrypted-media"
          allowFullScreen
          onLoad={() => setLoaded(true)}
          className="w-full h-full border-0"
          title="Trailer phim"
        />
      </div>
    </div>,
    document.body
  );
}
