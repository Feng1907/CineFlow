import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, Film, Menu, X, ChevronDown, Tag, Globe } from 'lucide-react';
import { getGenres } from '../api/movieApi';
import { COUNTRIES } from '../utils/constants';

// Reusable dropdown wrapper
function NavDropdown({ label, icon: Icon, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-sm font-medium text-zinc-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
      >
        {Icon && <Icon size={14} />}
        {label}
        <ChevronDown size={13} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 bg-surface-card border border-white/10 rounded-xl shadow-2xl z-50 p-3">
          {children}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [mobileSection, setSection] = useState(null); // 'genre' | 'country'
  const [genres, setGenres]       = useState([]);
  const [searchQuery, setQuery]   = useState('');
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setSection(null); }, [location]);

  useEffect(() => {
    getGenres().then((d) => setGenres(d.genres || [])).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setQuery('');
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-surface/95 backdrop-blur-md shadow-lg' : 'bg-gradient-to-b from-black/80 to-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Film className="text-brand" size={26} />
            <span className="text-xl font-extrabold tracking-tight">
              Cine<span className="text-brand">Flow</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            <Link to="/" className="text-sm font-medium text-zinc-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
              Trang chủ
            </Link>

            {/* Thể loại dropdown */}
            <NavDropdown label="Thể loại" icon={Tag}>
              <div className="grid grid-cols-2 gap-0.5 w-64">
                {genres.map((g) => (
                  <Link key={g.id} to={`/genre/${g.id}`}
                    className="text-sm text-zinc-300 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition-colors truncate">
                    {g.name}
                  </Link>
                ))}
              </div>
            </NavDropdown>

            {/* Quốc gia dropdown */}
            <NavDropdown label="Quốc gia" icon={Globe}>
              <div className="grid grid-cols-2 gap-0.5 w-56">
                {COUNTRIES.map((c) => (
                  <Link key={c.code} to={`/country/${c.code}`}
                    className="text-sm text-zinc-300 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition-colors">
                    {c.name}
                  </Link>
                ))}
              </div>
            </NavDropdown>

            <Link to="/now-playing" className="text-sm font-medium text-zinc-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
              Chiếu rạp
            </Link>
            <Link to="/upcoming" className="text-sm font-medium text-zinc-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
              Sắp chiếu
            </Link>
            <Link to="/movies" className="text-sm font-medium text-zinc-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
              Phim lẻ
            </Link>
            <Link to="/tv" className="text-sm font-medium text-zinc-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
              Phim bộ
            </Link>
            <Link to="/favorites" className="flex items-center gap-1 text-sm font-medium text-zinc-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
              <Heart size={13} /> Yêu thích
            </Link>
          </div>

          {/* Search + hamburger */}
          <div className="flex items-center gap-2">
            <form onSubmit={handleSearch} className="hidden sm:flex">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={15} />
                <input
                  type="text"
                  placeholder="Tìm kiếm phim..."
                  value={searchQuery}
                  onChange={(e) => setQuery(e.target.value)}
                  className="bg-white/10 border border-white/10 text-sm text-white placeholder-zinc-400 rounded-full pl-9 pr-4 py-1.5 w-36 focus:w-48 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </form>

            <Link to="/search" className="sm:hidden p-2 text-zinc-300 hover:text-white">
              <Search size={20} />
            </Link>

            <button
              className="lg:hidden p-2 text-zinc-300 hover:text-white"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-surface/98 backdrop-blur-md border-t border-white/5 px-4 pb-5 pt-2 max-h-[80vh] overflow-y-auto">
          <Link to="/" className="block py-2.5 text-sm font-medium text-zinc-300 hover:text-white">Trang chủ</Link>
          <Link to="/now-playing" className="block py-2.5 text-sm font-medium text-zinc-300 hover:text-white">Phim chiếu rạp</Link>
          <Link to="/upcoming" className="block py-2.5 text-sm font-medium text-zinc-300 hover:text-white">Phim sắp chiếu</Link>
          <Link to="/movies" className="block py-2.5 text-sm font-medium text-zinc-300 hover:text-white">Phim lẻ</Link>
          <Link to="/tv" className="block py-2.5 text-sm font-medium text-zinc-300 hover:text-white">Phim bộ</Link>
          <Link to="/favorites" className="flex items-center gap-2 py-2.5 text-sm font-medium text-zinc-300 hover:text-white">
            <Heart size={14} /> Yêu thích
          </Link>

          {/* Mobile: Thể loại accordion */}
          <div className="mt-2 pt-2 border-t border-white/5">
            <button
              onClick={() => setSection(mobileSection === 'genre' ? null : 'genre')}
              className="flex items-center justify-between w-full py-2 text-sm font-medium text-zinc-400"
            >
              <span className="flex items-center gap-2"><Tag size={13} /> Thể loại</span>
              <ChevronDown size={14} className={mobileSection === 'genre' ? 'rotate-180' : ''} />
            </button>
            {mobileSection === 'genre' && (
              <div className="grid grid-cols-2 gap-0.5 mt-1">
                {genres.map((g) => (
                  <Link key={g.id} to={`/genre/${g.id}`}
                    className="text-sm text-zinc-300 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition-colors">
                    {g.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mobile: Quốc gia accordion */}
          <div className="mt-1 pt-1 border-t border-white/5">
            <button
              onClick={() => setSection(mobileSection === 'country' ? null : 'country')}
              className="flex items-center justify-between w-full py-2 text-sm font-medium text-zinc-400"
            >
              <span className="flex items-center gap-2"><Globe size={13} /> Quốc gia</span>
              <ChevronDown size={14} className={mobileSection === 'country' ? 'rotate-180' : ''} />
            </button>
            {mobileSection === 'country' && (
              <div className="grid grid-cols-2 gap-0.5 mt-1">
                {COUNTRIES.map((c) => (
                  <Link key={c.code} to={`/country/${c.code}`}
                    className="text-sm text-zinc-300 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition-colors">
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mobile search */}
          <form onSubmit={handleSearch} className="mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={15} />
              <input type="text" placeholder="Tìm kiếm phim..." value={searchQuery}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-white/10 border border-white/10 text-sm text-white placeholder-zinc-400 rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
          </form>
        </div>
      )}
    </nav>
  );
}
