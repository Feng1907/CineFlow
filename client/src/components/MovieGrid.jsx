import MovieCard from './MovieCard';
import LoadingSkeleton from './LoadingSkeleton';
import ErrorState from './ErrorState';

export default function MovieGrid({ movies, loading, error, skeletonCount = 8, onRetry }) {
  if (loading) return <LoadingSkeleton count={skeletonCount} />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (!movies?.length) return (
    <div className="text-center py-16 text-zinc-500">Không tìm thấy phim nào.</div>
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
