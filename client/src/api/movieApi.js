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
export const discoverMovies = ({ genre_id, sort_by, page } = {}) =>
  api.get('/movies/discover', { params: { genre_id, sort_by, page } });
