import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, Menu, X, ChevronDown, Tag, Globe, Search, Heart, LogIn, LogOut, User, List } from 'lucide-react';
import { getGenres } from '../api/movieApi';
import { COUNTRIES } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import SearchOverlay from './SearchOverlay';

function NavDropdown({ label, icon: Icon, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-sm font-medium text-zinc-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
        {Icon && <Icon size={14} />} {label}
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

function UserMenu({ user, logout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm font-medium text-white bg-brand/20 hover:bg-brand/30 border border-brand/30 px-3 py-1.5 rounded-full transition-colors">
        <div className="w-6 h-6 rounded-full bg-brand flex items-center justify-center text-xs font-bold">
          {user.name?.charAt(0)?.toUpperCase()}
        </div>
        <span className="hidden sm:block max-w-24 truncate">{user.name}</span>
        <ChevronDown size={13} className={open ? 'rotate-180' : ''} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-surface-card border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5">
            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
            <p className="text-xs text-zinc-500 truncate">{user.email}</p>
          </div>
          <Link to="/favorites" onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors">
            <Heart size={14} /> Yêu thích
          </Link>
          <button onClick={() => { logout(); setOpen(false); }}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors text-left">
            <LogOut size={14} /> Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [mobileSection, setSection] = useState(null);
  const [genres, setGenres]         = useState([]);
  const [searchOpen, setSearch]     = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setSection(null); }, [location]);
  useEffect(() => { getGenres().then((d) => setGenres(d.genres || [])).catch(() => {}); }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-surface/95 backdrop-blur-md shadow-lg' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <Film className="text-brand" size={26} />
              <span className="text-xl font-extrabold tracking-tight">Cine<span className="text-brand">Flow</span></span>
            </Link>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-0.5">
              <Link to="/" className="text-sm font-medium text-zinc-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">Trang chủ</Link>

              <NavDropdown label="Thể loại" icon={Tag}>
                <div className="grid grid-cols-2 gap-0.5 w-64">
                  {genres.map((g) => (
                    <Link key={g.id} to={`/genre/${g.id}`} className="text-sm text-zinc-300 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition-colors truncate">{g.name}</Link>
                  ))}
                </div>
              </NavDropdown>

              <NavDropdown label="Quốc gia" icon={Globe}>
                <div className="grid grid-cols-2 gap-0.5 w-56">
                  {COUNTRIES.map((c) => (
                    <Link key={c.code} to={`/country/${c.code}`} className="text-sm text-zinc-300 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition-colors">{c.name}</Link>
                  ))}
                </div>
              </NavDropdown>

              <Link to="/now-playing" className="text-sm font-medium text-zinc-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">Chiếu rạp</Link>
              <Link to="/upcoming"    className="text-sm font-medium text-zinc-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">Sắp chiếu</Link>
              <Link to="/movies"      className="text-sm font-medium text-zinc-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">Phim lẻ</Link>
              <Link to="/tv"          className="text-sm font-medium text-zinc-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">Phim bộ</Link>
              {!user && (
                <Link to="/favorites" className="flex items-center gap-1 text-sm font-medium text-zinc-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
                  <Heart size={13} /> Yêu thích
                </Link>
              )}
            </div>

            {/* Right: search + auth */}
            <div className="flex items-center gap-2">
              <button onClick={() => setSearch(true)} className="p-2 text-zinc-300 hover:text-white transition-colors" aria-label="Tìm kiếm">
                <Search size={20} />
              </button>

              {user ? (
                <UserMenu user={user} logout={logout} />
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/login" className="text-sm font-medium text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-1">
                    <LogIn size={14} /> Đăng nhập
                  </Link>
                  <Link to="/register" className="text-sm font-semibold bg-brand hover:bg-brand-hover text-white px-4 py-1.5 rounded-lg transition-colors">
                    Đăng ký
                  </Link>
                </div>
              )}

              <button className="lg:hidden p-2 text-zinc-300 hover:text-white" onClick={() => setMenuOpen((v) => !v)}>
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-surface/98 backdrop-blur-md border-t border-white/5 px-4 pb-5 pt-2 max-h-[80vh] overflow-y-auto">
            <Link to="/"            className="block py-2.5 text-sm font-medium text-zinc-300 hover:text-white">Trang chủ</Link>
            <Link to="/now-playing" className="block py-2.5 text-sm font-medium text-zinc-300 hover:text-white">Phim chiếu rạp</Link>
            <Link to="/upcoming"    className="block py-2.5 text-sm font-medium text-zinc-300 hover:text-white">Phim sắp chiếu</Link>
            <Link to="/movies"      className="block py-2.5 text-sm font-medium text-zinc-300 hover:text-white">Phim lẻ</Link>
            <Link to="/tv"          className="block py-2.5 text-sm font-medium text-zinc-300 hover:text-white">Phim bộ</Link>
            <Link to="/favorites"   className="flex items-center gap-2 py-2.5 text-sm font-medium text-zinc-300 hover:text-white"><Heart size={14} /> Yêu thích</Link>
            {!user && (
              <div className="flex gap-2 pt-2 pb-1">
                <Link to="/login"    className="flex-1 text-center py-2 text-sm border border-white/20 rounded-lg text-zinc-300 hover:text-white">Đăng nhập</Link>
                <Link to="/register" className="flex-1 text-center py-2 text-sm bg-brand rounded-lg text-white font-semibold">Đăng ký</Link>
              </div>
            )}
            {user && (
              <button onClick={logout} className="flex items-center gap-2 py-2.5 text-sm font-medium text-zinc-400 hover:text-white">
                <LogOut size={14} /> Đăng xuất ({user.name})
              </button>
            )}

            {/* Genre accordion */}
            <div className="mt-2 pt-2 border-t border-white/5">
              <button onClick={() => setSection(mobileSection === 'genre' ? null : 'genre')}
                className="flex items-center justify-between w-full py-2 text-sm font-medium text-zinc-400">
                <span className="flex items-center gap-2"><Tag size={13} /> Thể loại</span>
                <ChevronDown size={14} className={mobileSection === 'genre' ? 'rotate-180' : ''} />
              </button>
              {mobileSection === 'genre' && (
                <div className="grid grid-cols-2 gap-0.5 mt-1">
                  {genres.map((g) => (
                    <Link key={g.id} to={`/genre/${g.id}`} className="text-sm text-zinc-300 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition-colors">{g.name}</Link>
                  ))}
                </div>
              )}
            </div>

            {/* Country accordion */}
            <div className="mt-1 pt-1 border-t border-white/5">
              <button onClick={() => setSection(mobileSection === 'country' ? null : 'country')}
                className="flex items-center justify-between w-full py-2 text-sm font-medium text-zinc-400">
                <span className="flex items-center gap-2"><Globe size={13} /> Quốc gia</span>
                <ChevronDown size={14} className={mobileSection === 'country' ? 'rotate-180' : ''} />
              </button>
              {mobileSection === 'country' && (
                <div className="grid grid-cols-2 gap-0.5 mt-1">
                  {COUNTRIES.map((c) => (
                    <Link key={c.code} to={`/country/${c.code}`} className="text-sm text-zinc-300 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition-colors">{c.name}</Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {searchOpen && <SearchOverlay onClose={() => setSearch(false)} />}
    </>
  );
}
