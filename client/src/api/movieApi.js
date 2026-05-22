import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
});

// Response interceptor — unwrap data, surface errors
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message = err.response?.data?.error || err.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const getPopular = (page = 1) => api.get('/movies/popular', { params: { page } });
export const getTrending = (timeWindow = 'day') => api.get('/movies/trending', { params: { timeWindow } });
export const getTopRated = (page = 1) => api.get('/movies/top_rated', { params: { page } });
export const getNowPlaying = (page = 1) => api.get('/movies/now-playing', { params: { page } });
export const searchMovies = (query, page = 1) => api.get('/movies/search', { params: { query, page } });
export const getMovieDetail = (id) => api.get(`/movies/${id}`);
export const getGenres = () => api.get('/genres/movie');
export const discoverMovies = ({ genre_id, country, sort_by, page } = {}) =>
  api.get('/movies/discover', { params: { genre_id, country, sort_by, page } });

// TV Series
export const getTVPopular  = (page = 1) => api.get('/tv/popular',  { params: { page } });
export const getTVTrending = (tw = 'week') => api.get('/tv/trending', { params: { timeWindow: tw } });
export const getTVTopRated = (page = 1) => api.get('/tv/top_rated', { params: { page } });
export const getTVOnAir    = (page = 1) => api.get('/tv/on-air',   { params: { page } });
export const getTVDetail   = (id) => api.get(`/tv/${id}`);
export const getTVGenres   = () => api.get('/genres/tv');
export const discoverTV    = ({ genre_id, country, sort_by, page } = {}) =>
  api.get('/tv/discover', { params: { genre_id, country, sort_by, page } });
