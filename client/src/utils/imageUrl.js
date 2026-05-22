const POSTER_BASE = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE = 'https://image.tmdb.org/t/p/original';
const AVATAR_BASE = 'https://image.tmdb.org/t/p/w185';

export const getPosterUrl = (path) =>
  path ? `${POSTER_BASE}${path}` : '/placeholder-poster.svg';

export const getBackdropUrl = (path) =>
  path ? `${BACKDROP_BASE}${path}` : null;

export const getAvatarUrl = (path) =>
  path ? `${AVATAR_BASE}${path}` : '/placeholder-avatar.svg';

export const formatYear = (dateStr) =>
  dateStr ? new Date(dateStr).getFullYear() : 'N/A';

export const formatRuntime = (minutes) => {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

export const formatRating = (rating) =>
  rating ? rating.toFixed(1) : 'N/A';
