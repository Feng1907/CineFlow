import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, Film, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [location]);

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
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Film className="text-brand" size={28} />
            <span className="text-xl font-extrabold tracking-tight">
              Cine<span className="text-brand">Flow</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">Home</Link>
            <Link to="/search" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">Movies</Link>
            <Link to="/favorites" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors flex items-center gap-1">
              <Heart size={15} /> Favorites
            </Link>
          </div>

          {/* Search + mobile menu */}
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="hidden sm:flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/10 border border-white/10 text-sm text-white placeholder-zinc-400 rounded-full pl-9 pr-4 py-1.5 w-44 focus:w-56 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand"
                />
              </div>
            </form>

            {/* Mobile search icon */}
            <Link to="/search" className="sm:hidden p-2 text-zinc-300 hover:text-white">
              <Search size={20} />
            </Link>

            <Link to="/favorites" className="hidden md:hidden sm:flex p-2 text-zinc-300 hover:text-white">
              <Heart size={20} />
            </Link>

            {/* Mobile hamburger */}
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

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-surface/98 backdrop-blur-md border-t border-white/5 px-4 pb-4 pt-2 space-y-1">
          <Link to="/" className="block py-2.5 text-sm font-medium text-zinc-300 hover:text-white">Home</Link>
          <Link to="/search" className="block py-2.5 text-sm font-medium text-zinc-300 hover:text-white">Movies</Link>
          <Link to="/favorites" className="flex items-center gap-2 py-2.5 text-sm font-medium text-zinc-300 hover:text-white">
            <Heart size={15} /> Favorites
          </Link>
          {/* Mobile search bar */}
          <form onSubmit={handleSearch} className="pt-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input
                type="text"
                placeholder="Search movies..."
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
