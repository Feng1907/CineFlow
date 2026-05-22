import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';
import MovieCard from '../components/MovieCard';

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <div className="fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="text-brand" size={28} fill="currentColor" />
        <h1 className="text-2xl font-bold">Phim Yêu Thích</h1>
        {favorites.length > 0 && (
          <span className="text-sm text-zinc-400">({favorites.length} phim)</span>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-24">
          <Heart className="mx-auto text-zinc-700 mb-4" size={64} />
          <h2 className="text-xl font-semibold text-zinc-400">Chưa có phim yêu thích</h2>
          <p className="text-zinc-500 mt-2 text-sm">
            Nhấn vào biểu tượng trái tim trên bất kỳ bộ phim nào để lưu vào đây.
          </p>
          <Link to="/" className="btn-primary mt-6 inline-flex">
            Khám phá phim
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {favorites.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
