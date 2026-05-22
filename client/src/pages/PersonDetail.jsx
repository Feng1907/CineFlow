import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Calendar, MapPin, User } from 'lucide-react';
import { getPerson } from '../api/movieApi';
import { getPosterUrl, getAvatarUrl } from '../utils/imageUrl';
import ErrorState from '../components/ErrorState';

export default function PersonDetail() {
  const { id } = useParams();
  const [person, setPerson]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [showFullBio, setShowBio] = useState(false);

  const fetchPerson = async () => {
    setLoading(true); setError(null);
    try { setPerson(await getPerson(id)); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPerson(); window.scrollTo(0, 0); }, [id]);

  if (loading) return (
    <div className="pt-24 max-w-7xl mx-auto px-4 animate-pulse">
      <div className="flex gap-8 mt-8">
        <div className="w-48 h-72 bg-surface-elevated rounded-2xl shrink-0" />
        <div className="flex-1 space-y-4 pt-4">
          <div className="h-8 bg-surface-elevated rounded w-1/3" />
          <div className="h-4 bg-surface-elevated rounded w-1/4" />
          <div className="h-4 bg-surface-elevated rounded w-full" />
          <div className="h-4 bg-surface-elevated rounded w-5/6" />
        </div>
      </div>
    </div>
  );
  if (error) return <div className="pt-24"><ErrorState message={error} onRetry={fetchPerson} /></div>;
  if (!person) return null;

  // Combine and dedupe movie + TV credits, sort by popularity
  const movieCredits = (person.movie_credits?.cast || []).map((m) => ({ ...m, mediaType: 'movie' }));
  const tvCredits    = (person.tv_credits?.cast   || []).map((m) => ({ ...m, title: m.name, mediaType: 'tv' }));
  const allCredits   = [...movieCredits, ...tvCredits]
    .filter((m) => m.poster_path)
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 24);

  const avatar = person.profile_path
    ? `https://image.tmdb.org/t/p/w300${person.profile_path}`
    : '/placeholder-avatar.svg';

  const bioShort = person.biography?.slice(0, 500);
  const bioLong  = person.biography;

  return (
    <div className="fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <Link to="javascript:history.back()" onClick={(e) => { e.preventDefault(); window.history.back(); }}
        className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white mb-8 transition-colors">
        <ChevronLeft size={16} /> Quay lại
      </Link>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Avatar */}
        <div className="shrink-0 w-48 mx-auto md:mx-0">
          <img src={avatar} alt={person.name} className="w-full rounded-2xl shadow-2xl shadow-black/60 ring-1 ring-white/10 aspect-[2/3] object-cover" onError={(e) => { e.target.src = '/placeholder-avatar.svg'; }} />
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold">{person.name}</h1>
          <p className="text-zinc-400 text-sm mt-1">{person.known_for_department}</p>

          <div className="flex flex-wrap gap-4 mt-4 text-sm text-zinc-400">
            {person.birthday && (
              <span className="flex items-center gap-1.5"><Calendar size={14} /> {person.birthday}</span>
            )}
            {person.place_of_birth && (
              <span className="flex items-center gap-1.5"><MapPin size={14} /> {person.place_of_birth}</span>
            )}
            {person.gender !== undefined && (
              <span className="flex items-center gap-1.5">
                <User size={14} /> {person.gender === 1 ? 'Nữ' : person.gender === 2 ? 'Nam' : 'Khác'}
              </span>
            )}
          </div>

          {person.biography && (
            <div className="mt-5">
              <p className="text-zinc-300 leading-relaxed text-sm">
                {showFullBio ? bioLong : bioShort}
                {!showFullBio && bioLong?.length > 500 && '...'}
              </p>
              {bioLong?.length > 500 && (
                <button onClick={() => setShowBio((v) => !v)} className="text-brand text-xs mt-2 hover:underline">
                  {showFullBio ? 'Thu gọn' : 'Xem thêm'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Filmography */}
      {allCredits.length > 0 && (
        <section className="mt-14">
          <h2 className="section-title">Filmography ({allCredits.length} tác phẩm)</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {allCredits.map((item) => (
              <Link
                key={`${item.mediaType}-${item.id}`}
                to={`/${item.mediaType}/${item.id}`}
                className="group block"
              >
                <div className="aspect-[2/3] rounded-lg overflow-hidden bg-surface-elevated">
                  <img
                    src={getPosterUrl(item.poster_path)}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => { e.target.src = '/placeholder-poster.svg'; }}
                  />
                </div>
                <p className="text-xs text-zinc-400 mt-1 truncate group-hover:text-white transition-colors">{item.title}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
