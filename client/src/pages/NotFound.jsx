import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="fade-in flex flex-col items-center justify-center min-h-screen gap-6 px-4 text-center">
      <Film className="text-zinc-700" size={80} />
      <div>
        <h1 className="text-8xl font-extrabold text-zinc-800">404</h1>
        <p className="text-xl font-semibold text-white mt-2">Page Not Found</p>
        <p className="text-zinc-400 mt-2">Looks like this scene was cut from the film.</p>
      </div>
      <Link to="/" className="btn-primary">
        Back to Home
      </Link>
    </div>
  );
}
