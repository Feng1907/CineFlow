import { Film } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface-card border-t border-white/5 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Film className="text-brand" size={22} />
            <span className="text-lg font-extrabold tracking-tight">
              Cine<span className="text-brand">Flow</span>
            </span>
          </div>

          <nav className="flex gap-6 text-sm text-zinc-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/search" className="hover:text-white transition-colors">Search</Link>
            <Link to="/favorites" className="hover:text-white transition-colors">Favorites</Link>
          </nav>
        </div>

        <div className="mt-6 pt-6 border-t border-white/5 text-center text-xs text-zinc-500 space-y-1">
          <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
          <p>© {new Date().getFullYear()} CineFlow. For educational purposes only. No movies are hosted or streamed.</p>
        </div>
      </div>
    </footer>
  );
}
