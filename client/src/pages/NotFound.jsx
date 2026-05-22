import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="fade-in flex flex-col items-center justify-center min-h-screen gap-6 px-4 text-center">
      <Film className="text-zinc-700" size={80} />
      <div>
        <h1 className="text-8xl font-extrabold text-zinc-800">404</h1>
        <p className="text-xl font-semibold text-white mt-2">Trang không tồn tại</p>
        <p className="text-zinc-400 mt-2">Có vẻ như trang này đã bị xóa khỏi kịch bản.</p>
      </div>
      <Link to="/" className="btn-primary">
        Về trang chủ
      </Link>
    </div>
  );
}
