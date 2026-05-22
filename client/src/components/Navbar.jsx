import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, Film, Menu, X, ChevronDown, Tag } from 'lucide-react';
import { getGenres } from '../api/movieApi';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [genreOpen, setGenreOpen] = useState(false);
  const [genres, setGenres] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const genreRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fetch genres once
  useEffect(() => {
    getGenres().then((data) => setGenres(data.genres || [])).catch(() => {});
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); setGenreOpen(false); }, [location]);

  // Close genre dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (genreRef.current && !genreRef.current.contains(e.target)) {
        setGenreOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-surface/95 backdrop-blur-md shadow-lg' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Film className="text-brand" size={28} />
            <span className="text-xl font-extrabold tracking-tight">
              Cine<span className="text-brand">Flow</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className="text-sm font-medium text-zinc-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              Trang chủ
            </Link>

            {/* Genre dropdown */}
            <div ref={genreRef} className="relative">
              <button
                onClick={() => setGenreOpen((v) => !v)}
                className="flex items-center gap-1 text-sm font-medium text-zinc-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <Tag size={14} /> Thể loại
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${genreOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown panel */}
              {genreOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-surface-card border border-white/10 rounded-xl shadow-2xl p-3 grid grid-cols-2 gap-1">
                  {genres.map((genre) => (
                    <Link
                      key={genre.id}
                      to={`/genre/${genre.id}`}
                      className="text-sm text-zinc-300 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition-colors truncate"
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/search"
              className="text-sm font-medium text-zinc-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              Khám phá
            </Link>
            <Link
              to="/favorites"
              className="flex items-center gap-1.5 text-sm font-medium text-zinc-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <Heart size={14} /> Yêu thích
            </Link>
          </div>

          {/* Search + mobile toggle */}
          <div className="flex items-center gap-2">
            <form onSubmit={handleSearch} className="hidden sm:flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={15} />
                <input
                  type="text"
                  placeholder="Tìm kiếm phim..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/10 border border-white/10 text-sm text-white placeholder-zinc-400 rounded-full pl-9 pr-4 py-1.5 w-40 focus:w-52 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand"
                />
              </div>
            </form>

            <Link to="/search" className="sm:hidden p-2 text-zinc-300 hover:text-white">
              <Search size={20} />
            </Link>

            <button
              className="md:hidden p-2 text-zinc-300 hover:text-white"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-surface/98 backdrop-blur-md border-t border-white/5 px-4 pb-5 pt-2">
          <Link to="/" className="block py-2.5 text-sm font-medium text-zinc-300 hover:text-white">
            Trang chủ
          </Link>
          <Link to="/search" className="block py-2.5 text-sm font-medium text-zinc-300 hover:text-white">
            Khám phá
          </Link>
          <Link to="/favorites" className="flex items-center gap-2 py-2.5 text-sm font-medium text-zinc-300 hover:text-white">
            <Heart size={14} /> Yêu thích
          </Link>

          {/* Mobile genre list */}
          <div className="mt-2 pt-2 border-t border-white/5">
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1">
              <Tag size={11} /> Thể loại
            </p>
            <div className="grid grid-cols-2 gap-1">
              {genres.map((genre) => (
                <Link
                  key={genre.id}
                  to={`/genre/${genre.id}`}
                  className="text-sm text-zinc-300 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition-colors"
                >
                  {genre.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile search */}
          <form onSubmit={handleSearch} className="mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={15} />
              <input
                type="text"
                placeholder="Tìm kiếm phim..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 border border-white/10 text-sm text-white placeholder-zinc-400 rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
          </form>
        </div>
      )}
    </nav>
  );
}
