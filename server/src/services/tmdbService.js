const axios = require('axios');
const { tmdb } = require('../config/env');

// Axios instance with TMDB Bearer auth pre-configured
const tmdbClient = axios.create({
  baseURL: tmdb.baseUrl,
  headers: {
    Authorization: `Bearer ${tmdb.token}`,
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

const get = (path, params = {}) =>
  tmdbClient.get(path, { params }).then((res) => res.data);

module.exports = {
  getPopular: (page = 1) => get('/movie/popular', { page }),

  getTrending: (timeWindow = 'day') => get(`/trending/movie/${timeWindow}`),

  getTopRated: (page = 1) => get('/movie/top_rated', { page }),

  getNowPlaying: (page = 1) => get('/movie/now_playing', { page }),

  searchMovies: (query, page = 1) =>
    get('/search/movie', { query, page, include_adult: false }),

  getMovieDetail: (id) =>
    get(`/movie/${id}`, {
      append_to_response: 'credits,videos,similar,watch/providers',
    }),

  getGenres: () => get('/genre/movie/list'),
};
